/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import '~/styles/index.css'
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Accordion,
  AccordionItem
} from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import MultiSelectChampion from '~/components/Autocompleted'
import { championApi } from '~/apis/champion.api'
import RuneSelector from '~/components/RuneSelected'
import ItemBuildComponent from '~/components/ItemSelected'

const CreateChampion = () => {
  const location = useLocation()
  const blog = location.state
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState<string[]>(blog ? [blog?.imageUrl] : [])
  const [splashImageUrl, setSplashImageUrl] = useState<string[]>(blog ? [blog?.splashImageUrl] : [])
  const [countersSelected, setCountersSelected] = useState<any[]>([])
  const [strongAgainstSelected, setStrongAgainstSelected] = useState<any[]>([])
  const [runesSelected, setRunesSelected] = useState<any[]>([])
  const [itemsSelected, setItemsSelected] = useState<any[]>([])
  const [langSelected, setLangSelected] = useState<string>('vi')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [champions, setChampions] = useState<any>([])

  const [skill, setSkill] = useState<{
    name: string
    description: string
    image: string
    skill: 'q' | 'w' | 'e' | 'r' | 'passive'
    index?: number
  }>({
    name: '',
    description: '',
    image: '',
    skill: 'passive',
    index: 4
  })
  const [skillList, setSkillList] = useState<
    { index: number; name: string; image: string; skill: 'q' | 'w' | 'e' | 'r' | 'passive'; description: string }[]
  >([
    {
      index: 0,
      name: '',
      image: '',
      skill: 'passive',
      description: ''
    },
    {
      index: 1,
      name: '',
      image: '',
      skill: 'q',
      description: ''
    },
    {
      index: 2,
      name: '',
      image: '',
      skill: 'w',
      description: ''
    },
    {
      index: 3,
      name: '',
      image: '',
      skill: 'e',
      description: ''
    },
    {
      index: 4,
      name: '',
      image: '',
      skill: 'r',
      description: ''
    }
  ])

  const handleOpen = (
    name: string,
    image: string,
    skill: 'q' | 'w' | 'e' | 'r' | 'passive',
    description: string,
    index: number
  ) => {
    setSkill({ name, image, skill, index, description })
    setSkillList((prev) => {
      const updatedList = [...prev]
      updatedList[index] = { ...updatedList[index], name, image, skill, description, index }
      return updatedList
    })
    onOpen()
  }

  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên tướng'),
    title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
    tags: z.string().min(1, 'Vui lòng nhập ít nhất 1 chủ đề'),
    counters: z.string().min(1, 'Vui lòng nhập ít nhất 1 tướng khắc chế'),
    strongAgainst: z.string().min(1, 'Vui lòng nhập ít nhất 1 tướng mạnh hơn khi đối đầu'),
    lang: z.string().min(1, 'Vui lòng chọn ngôn ngữ')
  })

  type FormData = z.infer<typeof createTourSchema>

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(createTourSchema),
    defaultValues: {
      title: blog ? blog.title : '',
      name: blog ? blog.name : '',
      tags: blog ? blog.tags.join(',') : ' ',
      counters: blog ? blog.counters.join(',') : ' ',
      strongAgainst: blog ? blog.strongAgainst.join(',') : ' ',
      lang: blog ? blog.lang : ''
    }
  })
  const languages = [
    {
      code: 'vi',
      name: 'Tiếng Việt'
    },
    {
      code: 'en',
      name: 'Tiếng Anh'
    }
  ]

  useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const response = await championApi.getChampions({})
      if (response.data.data) {
        setChampions(response.data.data)
      }
    }
  })
  const [runes, setRunes] = useState<any[]>([]) // Thêm state để lưu trữ danh sách ngọc
  const fetchRunes = async (lang: string) => {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/15.9.1/data/${lang === 'vi' ? 'vi_VN' : 'en_US'}/runesReforged.json`
      )
      const data = await response.json()
      setRunes(data) // Lưu trữ danh sách ngọc vào state
    } catch (error) {
      console.error('Error fetching runes:', error)
    }
  }

  useEffect(() => {
    fetchRunes('vi')
  }, [])

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return championApi.postChampion(data)
    },
    onSuccess: () => {
      toast.success('Tạo tướng thành công!')
      reset()
      setImageUrl([])
      setSplashImageUrl([])
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi tạo tướng!')
      console.log(err)
    }
  })

  const editTourMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = blog.slug
      return championApi.editChampion(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa thành công!')
      navigate('/champions')
    },
    onError: (error) => {
      console.error('Edit error:', error)
      toast.error('Có lỗi xảy ra khi sửa!')
    }
  })

  const onSubmit = handleSubmit((data) => {
    // Đảm bảo dữ liệu đúng định dạng
    const blogData = {
      ...data,
      title: data.title,
      name: data.name,
      imageUrl: imageUrl[0],
      splashUrl: splashImageUrl[0],
      id: data.name,
      stats: {},
      abilities: skillList.map((skill) => ({
        name: skill.name,
        description: skill.description,
        imageUrl: skill.image
      })),
      tags: data.tags.split(',').map((tag) => tag.trim()),
      counters: countersSelected,
      strongAgainst: strongAgainstSelected,
      recommendedRunes: runesSelected,
      recommendedItems: itemsSelected
    }
    console.log(blogData)
    if (blog) {
      editTourMutation.mutate(blogData)
    } else {
      createBlogMutation.mutate(blogData)
    }
  })

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'imageUrl' | 'splashImageUrl' | 'q' | 'w' | 'e' | 'r' | 'passive',
    index?: number,
    name?: string,
    description?: string
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'dulich')

      const response = await fetch('https://api.cloudinary.com/v1_1/dps8fcvlv/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      if (type === 'imageUrl') {
        setImageUrl((prev) => [...prev, data.secure_url])
      } else if (type === 'splashImageUrl') {
        setSplashImageUrl((prev) => [...prev, data.secure_url])
      } else if (
        index !== undefined &&
        name &&
        description &&
        (type === 'q' || type === 'w' || type === 'e' || type === 'r' || type === 'passive')
      ) {
        setSkillList((prev) => {
          const updatedList = [...prev]
          updatedList[index] = {
            ...updatedList[index],
            image: data.secure_url,
            name: name,
            description: description,
            skill: skillList[index].skill,
            index
          }
          return updatedList
        })
        setSkill({
          ...skill,
          image: data.secure_url,
          index,
          name: skillList[index].name,
          description: skillList[index].description,
          skill: skillList[index].skill
        })
      }
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      toast.error('Có lỗi khi upload ảnh!')
    }
  }

  return (
    <>
      <div className='p-6 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>{blog ? 'Chỉnh sửa tướng' : 'Tạo Tướng Mới'}</h1>

        <form onSubmit={onSubmit} className='space-y-6'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} label='Tên tướng' errorMessage={errors.name?.message} />}
          />
          {errors.name && <p className='text-red-500 text-sm '>{errors.name?.message}</p>}

          <Controller
            name='title'
            control={control}
            render={({ field }) => <Input {...field} label='Title' errorMessage={errors.title?.message} />}
          />
          {errors.title && <p className='text-red-500 text-sm '>{errors.title?.message}</p>}
          <div className='grid grid-cols-5 gap-4'>
            {skillList.map((skill, index) => (
              <div key={index}>
                <p className='text-sm font-medium text-gray-700 mb-2 '>
                  {skill.skill === 'passive' ? '' : 'Kỹ năng'}{' '}
                  <span className='uppercase'>{skill.skill === 'passive' ? 'Nội tại' : skill.skill}</span>
                </p>
                <div
                  onClick={() =>
                    handleOpen(
                      skill.name,
                      skill.image,
                      skill.skill as 'q' | 'w' | 'e' | 'r' | 'passive',
                      skill.description,
                      skill.index
                    )
                  }
                  className='border relative rounded flex items-center justify-center h-24 w-24 hover:bg-gray-100 transition-all cursor-pointer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                  </svg>
                  {skill.image && (
                    <img
                      src={skill.image}
                      alt={`Skill ${skill.name}`}
                      className='w-full aspect-square object-cover rounded absolute top-0 left-0'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Hình ảnh tướng</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageUpload(e, 'imageUrl')}
                className='w-full'
              />
              {imageUrl.length > 0 && (
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  {imageUrl.map((image, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={image}
                        alt={`Tour ${index + 1}`}
                        className='w-full aspect-square object-cover rounded'
                      />
                      <button
                        type='button'
                        onClick={() => setImageUrl((prev) => prev.filter((_, i) => i !== index))}
                        className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Ảnh Splash</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageUpload(e, 'splashImageUrl')}
                className='w-full'
              />
              {splashImageUrl.length > 0 && (
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  {splashImageUrl.map((image, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={image}
                        alt={`Tour ${index + 1}`}
                        className='w-full aspect-square object-cover rounded'
                      />
                      <button
                        type='button'
                        onClick={() => setSplashImageUrl((prev) => prev.filter((_, i) => i !== index))}
                        className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Controller
            name='tags'
            control={control}
            render={({ field }) => <Input {...field} label='Phân loại' errorMessage={errors.tags?.message} />}
          />
          {errors.tags && <p className='text-red-500 text-sm '>{errors.tags?.message}</p>}
          {/* <Controller
            name='counters'
            control={control}
            render={({ field }) => <Input {...field} label='Tướng khắc chế' errorMessage={errors.counters?.message} />}
          /> */}
          <Controller
            name='lang'
            control={control}
            render={({ field }) => (
              <Select
                label='Ngôn ngữ'
                selectedKeys={field.value ? [field.value] : ['vi']}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]?.toString()
                  field.onChange(selectedKey)
                  fetchRunes(selectedKey)
                  setLangSelected(selectedKey)
                }}
                errorMessage={errors.lang?.message}
              >
                {languages.map((language: any) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          {errors.lang && <p className='text-red-500 text-sm '>{errors.lang.message}</p>}
          <div className='grid grid-cols-2 gap-4'>
            <MultiSelectChampion
              label='Chọn tướng khắc chế'
              options={champions}
              defaultValues={blog?.counters.length > 0 ? blog.counters : []}
              onChange={(val) => setCountersSelected(val)}
            />
            <MultiSelectChampion
              label='Tướng mạnh hơn khi đối đầu'
              options={champions}
              defaultValues={blog?.strongAgainst.length > 0 ? blog.strongAgainst : []}
              onChange={(val) => setStrongAgainstSelected(val)}
            />
          </div>
          <Accordion>
            <AccordionItem
              key='1'
              aria-label='Accordion 1'
              title={<div className='text-sm font-medium text-gray-700 mb-2 py-5'>Bảng ngọc đề xuất</div>}
            >
              <RuneSelector
                defaultValues={blog?.recommendedRunes.length > 0 ? blog.recommendedRunes : []}
                runeData={runes}
                onChange={(val) => setRunesSelected(val)}
              />
            </AccordionItem>
            <AccordionItem
              key='2'
              aria-label='Accordion 2'
              title={<div className='text-sm font-medium text-gray-700 mb-2 py-5'>Trang bị đề xuất</div>}
            >
              <ItemBuildComponent langSelected={langSelected} onChange={(val) => setItemsSelected(val)} />
            </AccordionItem>
          </Accordion>

          <button type='submit' className='mt-6 w-full bg-blue-500 text-white p-2 rounded-md'>
            Tạo Tướng
          </button>
          {/* {blog ? (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={editTourMutation.isPending}>
            Chỉnh sửa
          </Button>
        ) : (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBlogMutation.isPending}>
            Tạo Tướng
          </Button>
        )} */}
        </form>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex  gap-1'>
                {skill.name === 'passive' ? '' : 'Kỹ năng'}{' '}
                {skill.name === 'passive' ? 'Nội tại' : <span className='uppercase'>{skill.name}</span>}
              </ModalHeader>
              <ModalBody>
                <Input
                  label='Tên kỹ năng'
                  type='text'
                  value={skill.name}
                  onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                />
                <Input
                  label='Mô tả'
                  type='text'
                  value={skill.description}
                  onChange={(e) => setSkill({ ...skill, description: e.target.value })}
                />
                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2 '>Hình ảnh</p>
                  <label
                    htmlFor={`image-${skill.name}`}
                    className='border rounded flex items-center relative justify-center aspect-square hover:bg-gray-100 transition-all cursor-pointer'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                    {skill.image && (
                      <img
                        src={skill.image}
                        alt={`Skill ${skill.name}`}
                        className='w-full aspect-square object-cover rounded absolute top-0 left-0'
                      />
                    )}
                    <input
                      type='file'
                      id={`image-${skill.name}`}
                      className='hidden'
                      onChange={(e) =>
                        handleImageUpload(
                          e,
                          skill.skill as 'q' | 'w' | 'e' | 'r' | 'passive',
                          skill.index,
                          skill.name,
                          skill.description
                        )
                      }
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Đóng
                </Button>
                <Button color='primary' onPress={onClose}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateChampion
