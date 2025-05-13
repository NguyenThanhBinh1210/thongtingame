import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionItem, Avatar, Button, Input } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod'

const TabProfileSetting = () => {
  const createTourSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên'),
    email: z.string().min(1, 'Vui lòng nhập email'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),

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
      email: '',
      password: ''
    }
  })
  const onSubmit = handleSubmit((data) => {
    console.log('Form data:', data)


  })
  return (
    <Accordion variant='splitted' selectionMode='multiple' defaultExpandedKeys={['1', '2']}>

      <AccordionItem
        className='rounded bg-foreground-50 dark:bg-foreground-100'
        key='2'
        aria-label='Accordion 2'
        title={<div className='py-2 uppercase text-sm font-medium border-b border-foreground-200'>Ảnh đại diện</div>}
      >
        <div className='text-sm'>
          <div className='flex items-center gap-4 p-2'>
            <Avatar
              isBordered
              alt='Argentina'
              className='w-[160px] h-[160px]'
              src='https://flagcdn.com/ar.svg'
            ></Avatar>
            <Button variant='bordered' className='rounded'>
              Chọn ảnh trong thiết bị của bạn
            </Button>
          </div>
          <div className='flex gap-3 mt-4'>
            <Button className='rounded' color='primary'>
              Submit
            </Button>
            <Button className='rounded' color='warning'>
              Reset
            </Button>
          </div>
        </div>
      </AccordionItem>
      <AccordionItem
        className='rounded bg-foreground-50 dark:bg-foreground-100'
        key='1'
        aria-label='Accordion 1'
        title={<div className='py-2 uppercase text-sm font-medium border-b border-foreground-200'>Thông tin tài khoản</div>}
      >
        <div className='text-sm'>
          <div className='flex items-center gap-4 p-2'>
            <form onSubmit={onSubmit} className='space-y-6'>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input className=' w-[500px]' {...field} label='Tên' errorMessage={errors.name?.message} />}
              />



              <Controller
                name='email'
                control={control}
                render={({ field }) => <Input className=' w-[500px]' {...field} label='Email' errorMessage={errors.email?.message} />}
              />
              <Controller
                name='password'
                control={control}
                render={({ field }) => <Input className=' w-[500px]' {...field} label='Mật khẩu' errorMessage={errors.password?.message} />}
              />
            </form>
          </div>
          <div className='flex gap-3 mt-4'>
            <Button className='rounded' color='primary'>
              Submit
            </Button>
            <Button className='rounded' color='warning'>
              Reset
            </Button>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default TabProfileSetting
