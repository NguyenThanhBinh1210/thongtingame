/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '~/styles/index.css'
import { Button, Input } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import { championApi } from '~/apis/champion.api'

const CreateWRChampion = () => {
  const location = useLocation()
  const blog = location.state
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState<string[]>(blog ? [blog?.imageUrl] : [])
  const [splashImageUrl, setSplashImageUrl] = useState<string[]>(blog ? [blog?.splashUrl] : [])
  console.log(blog)
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

  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên tướng'),
    // lang: z.string().min(1, 'Vui lòng chọn ngôn ngữ'),
    roles: z.string().min(1, 'Vui lòng nhập ít nhất 1 vai trò'),
    patch: z.string().min(1, 'Vui lòng nhập phiên bản'),
    title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
    description: z.string().min(1, 'Vui lòng nhập mô tả'),
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
      name: blog ? blog.name : '',
      roles: blog ? blog.roles.join(',') : ' ',
      patch: blog ? blog.patch : '',
      // lang: blog ? blog.lang : '',
      title: blog ? blog.title : '',
      description: blog ? blog.description : '',
    }
  })
  // const languages = [
  //   {
  //     code: 'vi',
  //     name: 'Tiếng Việt'
  //   },
  //   {
  //     code: 'en',
  //     name: 'Tiếng Anh'
  //   }
  // ]

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return championApi.postTFTChampion(data)
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
      const slug = blog._id
      return championApi.editTFTChampion(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa thành công!')
      navigate('/tft-champions')
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
      name: data.name,
      imageUrl: imageUrl[0],
      splashUrl: splashImageUrl[0],
      stats: {},
      roles: data.roles.split(',').map((role: string) => role.trim()),
      patch: data.patch,
      recommendedItems: [
        "Giáp Lưng Rồng",
        "Áo Choàng Lửa",
        "Giáp Máu Warmog"
      ],
      recommendedItemsData: [
        {
          name: 'Giáp Thạch Quỷ',
          imageUrl: 'https://sunderarmor.com/items/GargoyleStoneplate.png'
        },
        {
          name: 'Áo Choàng Lửa Mặt Trời',
          imageUrl: 'https://sunderarmor.com/items/SunfireCape.png'
        },
        {
          name: 'Giáp Warmog',
          imageUrl: 'https://sunderarmor.com/items/WarmogsArmor.png'
        }
      ],
      ability: {
        name: 'Gilded Endurance',
        description: 'Mô tả kỹ năng của Alistar (cần cập nhật thực tế)',
        mana: '30 / 100'
      },
      setNumber: 14
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
            render={({ field }) => <Input {...field} label='Tiêu đề' errorMessage={errors.title?.message} />}
          />
          {errors.title && <p className='text-red-500 text-sm '>{errors.title?.message}</p>}
          <Controller
            name='description'
            control={control}
            render={({ field }) => <Input {...field} label='Mô tả' errorMessage={errors.description?.message} />}
          />
          {errors.description && <p className='text-red-500 text-sm '>{errors.description?.message}</p>}


          <Controller
            name='patch'
            control={control}
            render={({ field }) => <Input {...field} label='Phiên bản' errorMessage={errors.patch?.message} />}
          />
          {errors.patch && <p className='text-red-500 text-sm '>{errors.patch?.message}</p>}

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
            name='roles'
            control={control}
            render={({ field }) => <Input {...field} label='Vai trò' errorMessage={errors.roles?.message} />}
          />
          {errors.roles && <p className='text-red-500 text-sm '>{errors.roles?.message}</p>}
          {/* <Controller
            name='lang'
            control={control}
            render={({ field }) => (
              <Select
                label='Ngôn ngữ'
                selectedKeys={field.value ? [field.value] : ['vi']}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]?.toString()
                  field.onChange(selectedKey)
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
          {errors.lang && <p className='text-red-500 text-sm '>{errors.lang.message}</p>} */}

          {blog ? (
            <Button type='submit' color='primary' className='mt-6 w-full' isLoading={editTourMutation.isPending}>
              Chỉnh sửa
            </Button>
          ) : (
            <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBlogMutation.isPending}>
              Tạo Tướng
            </Button>
          )}
        </form>
      </div>
    </>
  )
}

export default CreateWRChampion
