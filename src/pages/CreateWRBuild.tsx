/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import '~/styles/index.css'
import {
  Input,
  Button,

  AccordionItem,
  Accordion
} from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation } from 'react-router-dom'
import { championApi } from '~/apis/champion.api'
import AutocompleteSelect from '~/components/AutocompleteSelect'
import { buildApi } from '~/apis/build.api'
const CreateWRBuild = () => {
  const location = useLocation()
  const blog = location.state

  const [champions, setChampions] = useState<any[]>([])
  useQuery({
    queryKey: ['wr-champions', 'create'],
    queryFn: async () => {
      const response = await championApi.getWRChampions({ lang: blog.lang ? blog.lang : 'vi' })
      if (response.data.items) {
        const options = response.data.items.map((champion: any) => ({
          ...champion,
          value: champion._id,
          label: champion.name,
          imageUrl: champion.imageUrl
        }))
        setChampions(options)
      }
    }
  })
  const [championSelected, setChampionSelected] = useState<any>(null)
  useEffect(() => {
    if (blog) {
      setChampionSelected(champions.find((champion) => champion._id === blog._id))
    }
  }, [blog, champions])

  const { data: build } = useQuery({
    queryKey: ['wr-build', blog._id],
    queryFn: async () => {
      const response = await buildApi.getWRBuilds(blog._id)
      return response.data
    }
  })

  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    buildType: z.string().min(1, 'Chọn loại build'),
    sourceUrl: z.string().min(1, 'Nhập link source')
  })

  type FormData = z.infer<typeof createTourSchema>

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(createTourSchema),
    defaultValues: {
      buildType: '',
      sourceUrl: ''
    }
  })
  useEffect(() => {
    if (build) {
      reset({
        buildType: build.buildType || '',
        sourceUrl: build.sourceUrl || ''
      })
    }
  }, [build, reset])

  const createBuildMutation = useMutation({
    mutationFn: (data: any) => {
      return buildApi.postWRBuild(data)
    },
    onSuccess: () => {
      toast.success('Tạo build thành công!')
      reset()
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi tạo build!')
      console.log(err)
    }
  })

  const editBuildMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = build._id
      return buildApi.editWRBuild(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa build thành công!')
    },
    onError: (error) => {
      console.error('Edit error:', error)
      toast.error('Có lỗi xảy ra khi sửa!')
    }
  })
  const [buildData, setBuildData] = useState<any>(build)
  useEffect(() => {
    if (build) {
      setBuildData(build)
    }
  }, [build])

  const onSubmit = handleSubmit((data) => {
    // Đảm bảo dữ liệu đúng định dạng
    const blogData = {
      ...data,
      championId: championSelected?.value,
      buildType: data.buildType,
      sourceUrl: data.sourceUrl,
      startingItems: buildData?.startingItems,
      coreItems: buildData?.coreItems,
      finalBuildItems: buildData?.finalBuildItems,
      boots: buildData?.boots,
      enchantments: buildData?.enchantments,
      situationalItems: buildData?.situationalItems,
      spells: buildData?.spells,
      runes: buildData?.runes,
      situationalRunes: buildData?.situationalRunes,
      skillOrder: buildData?.skillOrder
    }
    console.log(blogData)
    if (blog) {
      editBuildMutation.mutate(blogData)
    } else {
      createBuildMutation.mutate(blogData)
    }
  })

  const handleChange = (section: string, index: number, field: string, value: string) => {
    setBuildData((prev: any) => {
      const newSection = [...prev[section]]
      if (typeof newSection[index] === 'string') {
        newSection[index] = value
      } else {
        newSection[index] = {
          ...newSection[index],
          [field]: value
        }
      }
      return {
        ...prev,
        [section]: newSection
      }
    })
  }
  const renderSection = (sectionName: string, displayName: string) => {
    const section = buildData?.[sectionName]

    return (
      <AccordionItem
        key={sectionName}
        title={<div className='block text-sm font-medium text-gray-700 mb-4 mt-4'>{displayName}</div>}
      >
        <div style={{ marginBottom: '20px' }}>
          {section?.map((item: any, index: number) => (
            <div key={index}>
              {typeof item === 'string' ? (
                <>
                  <Input
                    label='Value'
                    value={item}
                    onChange={(e) => handleChange(sectionName, index, 'value', e.target.value)}
                    className='mb-4'
                  />
                </>
              ) : (
                <div>
                  <div className='flex items-center gap-4'>
                    <div>
                      <img src={item.imageUrl} alt={item.name} className='w-20 h-20 rounded-full border' />
                    </div>
                    <div className='flex-1'>
                      {'skill' in item ? (
                        <>
                          <Input
                            label='Skill'
                            value={item.skill}
                            onChange={(e) => handleChange(sectionName, index, 'skill', e.target.value)}
                            className='mb-4'
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            label='Tên'
                            value={item.name}
                            onChange={(e) => handleChange(sectionName, index, 'name', e.target.value)}
                            className='mb-4'
                          />
                        </>
                      )}
                      <Input
                        label='Image URL'
                        value={item.imageUrl}
                        onChange={(e) => handleChange(sectionName, index, 'imageUrl', e.target.value)}
                        className='mb-4'
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </AccordionItem>
    )
  }
  return (
    <>
      <div className='p-6 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>{blog ? 'Chỉnh sửa build' : 'Tạo build mới'}</h1>
        <form onSubmit={onSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Chọn tướng</label>
            <AutocompleteSelect
              options={champions}
              defaultValue={championSelected || null}
              value={championSelected || null}
              onChange={setChampionSelected}
              placeholder='Chọn tướng...'
            />
          </div>
          <Controller
            name='buildType'
            control={control}
            render={({ field }) => <Input {...field} label='Loại build' errorMessage={errors.buildType?.message} />}
          />
          {errors.buildType && <p className='text-red-500 text-sm '>{errors.buildType?.message}</p>}
          <Controller
            name='sourceUrl'
            control={control}
            render={({ field }) => <Input {...field} label='Link source' errorMessage={errors.sourceUrl?.message} />}
          />
          {errors.sourceUrl && <p className='text-red-500 text-sm '>{errors.sourceUrl?.message}</p>}
          <Accordion>
            {renderSection('startingItems', 'Starting Items')}
            {renderSection('coreItems', 'Core Items')}
            {renderSection('finalBuildItems', 'Final Build Items')}
            {renderSection('boots', 'Boots')}
            {renderSection('enchantments', 'Enchantments')}
            {renderSection('situationalItems', 'Situational Items')}
            {renderSection('spells', 'Spells')}
            {renderSection('runes', 'Runes')}
            {renderSection('situationalRunes', 'Situational Runes')}
            {renderSection('skillOrder', 'Skill Order')}
          </Accordion>
          {blog ? (
            <Button type='submit' color='primary' className='mt-6 w-full' isLoading={editBuildMutation.isPending}>
              Chỉnh sửa
            </Button>
          ) : (
            <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBuildMutation.isPending}>
              Tạo build
            </Button>
          )}
        </form>
      </div>
    </>
  )
}

export default CreateWRBuild
