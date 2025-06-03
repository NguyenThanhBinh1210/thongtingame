/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '~/styles/index.css'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import { itemApi } from '~/apis/item.api'

const TFTItemCreate = () => {
  const location = useLocation()
  const blog = location.state
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState<string[]>(blog ? [blog?.imageUrl] : [])



  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên tướng'),
    lang: z.string().min(1, 'Vui lòng chọn ngôn ngữ'),
    description: z.string().min(1, 'Vui lòng nhập mô tả'),
    patch: z.string().min(1, 'Vui lòng nhập phiên bản'),
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
      description: blog ? blog.description : '',
      patch: blog ? blog.patch : '',
      lang: blog ? blog.lang : '',
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

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return itemApi.postTFTItem(data)
    },
    onSuccess: () => {
      toast.success('Tạo trang bị thành công!')
      reset()
      setImageUrl([])
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi tạo trang bị!')
      console.log(err)
    }
  })

  const editTourMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = blog._id
      return itemApi.editTFTItem(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa thành công!')
      navigate('/tft-items')
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
      patch: data.patch,
      description: data.description,
      isBasic: false
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
      }
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      toast.error('Có lỗi khi upload ảnh!')
    }
  }

  return (
    <>
      <div className='p-6 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>{blog ? 'Chỉnh sửa trang bị' : 'Tạo trang bị mới'}</h1>

        <form onSubmit={onSubmit} className='space-y-6'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} label='Tên trang bị' errorMessage={errors.name?.message} />}
          />
          {errors.name && <p className='text-red-500 text-sm '>{errors.name?.message}</p>}
          <Controller
            name='description'
            control={control}
            render={({ field }) => <Input {...field} label='Mô tả' errorMessage={errors.description?.message} />}
          />
          {errors.name && <p className='text-red-500 text-sm '>{errors.name?.message}</p>}

          <Controller
            name='patch'
            control={control}
            render={({ field }) => <Input {...field} label='Phiên bản' errorMessage={errors.patch?.message} />}
          />
          {errors.patch && <p className='text-red-500 text-sm '>{errors.patch?.message}</p>}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Hình ảnh trang bị</label>
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
          </div>

          <Controller
            name='lang'
            control={control}
            render={({ field }) => (
              <Select
                label='Ngôn ngữ'
                selectedKeys={field.value ? [field.value] : [blog ? blog.lang : '']}
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
          {errors.lang && <p className='text-red-500 text-sm '>{errors.lang.message}</p>}

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
      </div >
    </>
  )
}

export default TFTItemCreate
