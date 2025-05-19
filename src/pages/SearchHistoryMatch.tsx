/* eslint-disable @typescript-eslint/no-explicit-any */
import '~/styles/index.css'
import { Input, Button } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { pcApi } from '~/apis/pc.api'

const SearchHistoryMatch = () => {

  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập acc người chơi'),
    tag: z.string().min(1, 'Tag server hoặc mã định danh'),
  })

  type FormData = z.infer<typeof createTourSchema>

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createTourSchema),
    defaultValues: {
      name: '',
      tag: ""
    }
  })

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return pcApi.getHistoryMatch(data)
    },
    onSuccess: (data) => {
      window.open(`${data.data.data.url}`, '_blank')
      console.log(data.data.data.url)
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tìm lịch sử đấu!')
    }
  })



  const onSubmit = handleSubmit((data) => {

    // Đảm bảo dữ liệu đúng định dạng
    const blogData = {
      ...data,
      name: data.name,
      tag: String(data.tag),
    }
    createBlogMutation.mutate(blogData)
    console.log('Blog data to submit:', blogData)
  })

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Tìm kiếm lịch sử đấu</h1>

      <form onSubmit={onSubmit} className='space-y-6'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <Input {...field} label='Tiêu đề' errorMessage={errors.name?.message} />}
        />
        <Controller
          name='tag'
          control={control}
          render={({ field }) => <Input {...field} label='Tag (ví dụ: vn2)' errorMessage={errors.tag?.message} />}
        />
        <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBlogMutation.isPending}>
          Tìm kiếm
        </Button>
      </form>
    </div>
  )
}

export default SearchHistoryMatch
