/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '~/styles/index.css'
import { Input, Button } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import { blogApi } from '~/apis/blog.api'

const AddBlog = () => {
  const location = useLocation()
  const blog = location.state
  const valuesContent = blog?.content
  const navigate = useNavigate()
  const editorRef = useRef<any>(null)
  const [images, setImages] = useState<string[]>(blog ? [blog?.imageUrl] : [])



  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
    content: z.string().min(1, 'Vui lòng nhập nội dung'),
    summary: z.string().min(1, 'Vui lòng nhập mô tả'),
    tags: z.string().min(1, 'Vui lòng nhập ít nhất 1 chủ đề')
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
      content: blog ? (Array.isArray(blog.content) ? blog.content[0] : blog.content) : '',
      tags: blog ? blog.tags.join(',') : ' ',
      summary: blog ? blog.summary : ' ',
    }
  })

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return blogApi.createBlog(data)
    },
    onSuccess: () => {
      toast.success('Tạo blog thành công!')
      reset()
      setImages([])
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi tạo blog!')
      console.log(err)
    }
  })

  const editTourMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = blog.slug
      return blogApi.editBlog(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa thành công!')
      navigate('/blogs')
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
      imageUrl: images[0],
      title: data.title,
      content: [data.content],
      isPublished: true,
      description: data.summary,
      tags: data.tags.split(',').map(tag => tag.trim()),
    }

    console.log('Blog data to submit:', blogData)

    if (blog) {
      console.log('Editing blog with ID:', blog)
      editTourMutation.mutate(blogData)
    } else {
      console.log('Creating new blog')
      createBlogMutation.mutate(blogData)
    }
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setImages((prev) => [...prev, data.secure_url])

      toast.success('Upload ảnh thành công!')
    } catch (error) {
      toast.error('Có lỗi khi upload ảnh!')
    }
  }

  const handleEditorImageUpload = async (blobInfo: any) => {
    try {
      const formData = new FormData()
      formData.append('file', blobInfo.blob())
      formData.append('upload_preset', 'dulich')

      const response = await fetch('https://api.cloudinary.com/v1_1/dps8fcvlv/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>{blog ? 'Chỉnh sửa Blog' : 'Tạo Blog Mới'}</h1>

      <form onSubmit={onSubmit} className='space-y-6'>
        <Controller
          name='title'
          control={control}
          render={({ field }) => <Input {...field} label='Tiêu đề' errorMessage={errors.title?.message} />}
        />
        {errors.title && <p className='text-red-500 text-sm '>{errors.title.message}</p>}
        <Controller
          name='summary'
          control={control}
          render={({ field }) => <Input {...field} label='Mô tả' errorMessage={errors.summary?.message} />}
        />
        {errors.summary && <p className='text-red-500 text-sm '>{errors.summary.message}</p>}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Ảnh blog</label>
          <input type='file' accept='image/*' onChange={handleImageUpload} className='w-full' />

          {images.length > 0 && (
            <div className='grid grid-cols-4 gap-4 mt-4'>
              {images.map((image, index) => (
                <div key={index} className='relative group'>
                  <img src={image} alt={`Tour ${index + 1}`} className='w-full aspect-square object-cover rounded' />
                  <button
                    type='button'
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
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
        <Controller
          name='tags'
          control={control}
          render={({ field }) => <Input {...field} label='Chủ đề' errorMessage={errors.tags?.message} />}
        />
        {errors.tags && <p className='text-red-500 text-sm '>{errors.tags.message}</p>}

        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block mb-2'>Nội dung</label>
              <Editor
                apiKey='jh49do00vb82towfawrulptots9frojd930x4hmxm0d4rdjw'
                onInit={(_: any, editor: any) => {
                  editorRef.current = editor

                  // Đăng ký các định dạng highlight sau khi editor đã được khởi tạo
                  editor.formatter.register('highlight-yellow', {
                    inline: 'span',
                    classes: 'highlight-yellow',
                    remove: 'all'
                  })
                  editor.formatter.register('highlight-green', {
                    inline: 'span',
                    classes: 'highlight-green',
                    remove: 'all'
                  })
                  editor.formatter.register('highlight-blue', {
                    inline: 'span',
                    classes: 'highlight-blue',
                    remove: 'all'
                  })
                  editor.formatter.register('highlight-pink', {
                    inline: 'span',
                    classes: 'highlight-pink',
                    remove: 'all'
                  })
                }}
                value={field.value || valuesContent || ''}
                onEditorChange={(content: string) => field.onChange(content)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic underline | fontfamily fontsize | forecolor backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'image link | table | highlight | removeformat',
                  formats: {
                    fontsize: {
                      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,span',
                      styles: { fontSize: '%value' }
                    },
                    fontfamily: {
                      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,span',
                      styles: { fontFamily: '%value' }
                    }
                  },
                  fontsize_formats:
                    '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 42pt 48pt 56pt 64pt 72pt',
                  font_formats:
                    'Andale Mono=andale mono,times;' +
                    'Arial=arial,helvetica,sans-serif;' +
                    'Arial Black=arial black,avant garde;' +
                    'Book Antiqua=book antiqua,palatino;' +
                    'Comic Sans MS=comic sans ms,sans-serif;' +
                    'Courier New=courier new,courier;' +
                    'Georgia=georgia,palatino;' +
                    'Helvetica=helvetica;' +
                    'Impact=impact,chicago;' +
                    'Roboto=roboto,sans-serif;' +
                    'Symbol=symbol;' +
                    'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                    'Terminal=terminal,monaco;' +
                    'Times New Roman=times new roman,times;' +
                    'Trebuchet MS=trebuchet ms,geneva;' +
                    'Verdana=verdana,geneva;' +
                    'Webdings=webdings;' +
                    'Wingdings=wingdings,zapf dingbats',
                  content_style: `
                    body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                    table td, table th { border: 1px solid #ccc; padding: 8px; }
                    table th { background-color: #f2f2f2; }
                    .highlight-yellow { background-color: #ffff00; }
                    .highlight-green { background-color: #00ff00; }
                    .highlight-blue { background-color: #00ffff; }
                    .highlight-pink { background-color: #ff00ff; }
                  `,
                  setup: function (editor: any) {
                    editor.ui.registry.addMenuButton('highlight', {
                      text: 'Highlight',
                      fetch: function (callback: any) {
                        const items = [
                          {
                            type: 'menuitem',
                            text: 'Yellow',
                            onAction: function () {
                              editor.execCommand('mceToggleFormat', false, 'highlight-yellow')
                            }
                          },
                          {
                            type: 'menuitem',
                            text: 'Green',
                            onAction: function () {
                              editor.execCommand('mceToggleFormat', false, 'highlight-green')
                            }
                          },
                          {
                            type: 'menuitem',
                            text: 'Blue',
                            onAction: function () {
                              editor.execCommand('mceToggleFormat', false, 'highlight-blue')
                            }
                          },
                          {
                            type: 'menuitem',
                            text: 'Pink',
                            onAction: function () {
                              editor.execCommand('mceToggleFormat', false, 'highlight-pink')
                            }
                          },
                          {
                            type: 'menuitem',
                            text: 'Remove Highlight',
                            onAction: function () {
                              editor.execCommand('removeFormat')
                            }
                          }
                        ]
                        callback(items)
                      }
                    })
                  },
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  file_picker_callback: function (cb: any) {
                    const input = document.createElement('input')
                    input.setAttribute('type', 'file')
                    input.setAttribute('accept', 'image/*')

                    input.onchange = function () {
                      const fileInput = input as HTMLInputElement
                      const file = fileInput.files?.[0]
                      if (!file) return

                      const reader = new FileReader()
                      reader.onload = function () {
                        const id = 'blobid' + new Date().getTime()
                        const editorInstance = editorRef.current
                        const blobCache = editorInstance.editorUpload.blobCache
                        const result = reader.result as string
                        const base64 = result.split(',')[1]
                        const blobInfo = blobCache.create(id, file, base64)
                        blobCache.add(blobInfo)

                        cb(blobInfo.blobUri(), { title: file.name })
                      }
                      reader.readAsDataURL(file)
                    }

                    input.click()
                  },
                  images_upload_handler: handleEditorImageUpload,
                  language: 'vi',
                  branding: false,
                  promotion: false,
                  images_upload_credentials: true,
                  convert_urls: false,
                  relative_urls: false,
                  remove_script_host: false
                }}
              />
              {errors.content && <p className='text-red-500 text-sm '>{errors.content.message}</p>}
            </div>
          )}
        />
        {errors.content && <p className='text-red-500 text-sm mt-1'>{errors.content.message}</p>}
        {blog ? (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={editTourMutation.isPending}>
            Chỉnh sửa
          </Button>
        ) : (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBlogMutation.isPending}>
            Tạo Blog
          </Button>
        )}
      </form>
    </div>
  )
}

export default AddBlog
