/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '~/styles/index.css'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import { roles } from './Counters'
import MultiSelectChampion from '~/components/Autocompleted'
import { counterApi } from '~/apis/counter.api'

const CreateCounter = () => {
  const location = useLocation()
  const blog = location.state
  const formattedContent = blog?.formattedContent
  const weaknessesContent = blog?.weaknessesContent
  const counterItemsContent = blog?.counterItemsContent
  const strategiesContent = blog?.strategiesContent
  const additionalTipsContent = blog?.additionalTipsContent
  const [strongAgainst, setStrongAgainst] = useState<any[]>([])
  const [weakAgainst, setWeakAgainst] = useState<any[]>([])
  const [bestLaneCounters, setBestLaneCounters] = useState<any[]>([])
  const [worstLaneCounters, setWorstLaneCounters] = useState<any[]>([])
  const navigate = useNavigate()
  // Tạo schema động dựa vào việc có đang chỉnh sửa tour hay không
  const createTourSchema = z.object({
    championName: z.string().min(1, 'Vui lòng nhập tên tướng'),
    role: z.string().min(1, 'Vui lòng nhập vị trí'),
    overallWinRate: z.string().min(1, 'Vui lòng nhập tỷ lệ win'),
    pickRate: z.string().min(1, 'Vui lòng nhập tỷ lệ pick'),
    banRate: z.string().min(1, 'Vui lòng nhập tỷ lệ ban'),
    patch: z.string().min(1, 'Vui lòng nhập phiên bản'),
    formattedContent: z.string().min(1, 'Vui lòng nhập nội dung'),
    weaknessesContent: z.string().min(1, 'Vui lòng nhập nội dung'),
    counterItemsContent: z.string().min(1, 'Vui lòng nhập nội dung'),
    strategiesContent: z.string().min(1, 'Vui lòng nhập nội dung'),
    additionalTipsContent: z.string().min(1, 'Vui lòng nhập nội dung')
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
      championName: blog ? blog.championName : '',
      role: blog ? blog.role : '',
      overallWinRate: blog ? String(blog.overallWinRate) : '',
      pickRate: blog ? String(blog.pickRate) : '',
      banRate: blog ? String(blog.banRate) : '',
      patch: blog ? blog.patch : '',
      formattedContent: blog
        ? Array.isArray(blog.formattedContent)
          ? blog.formattedContent[0]
          : blog.formattedContent
        : '',
      weaknessesContent: blog
        ? Array.isArray(blog.weaknessesContent)
          ? blog.weaknessesContent[0]
          : blog.weaknessesContent
        : '',
      counterItemsContent: blog
        ? Array.isArray(blog.counterItemsContent)
          ? blog.counterItemsContent[0]
          : blog.counterItemsContent
        : '',
      strategiesContent: blog
        ? Array.isArray(blog.strategiesContent)
          ? blog.strategiesContent[0]
          : blog.strategiesContent
        : '',
      additionalTipsContent: blog
        ? Array.isArray(blog.additionalTipsContent)
          ? blog.additionalTipsContent[0]
          : blog.additionalTipsContent
        : ''
    }
  })


  const createBlogMutation = useMutation({
    mutationFn: (data: any) => {
      return counterApi.postCounter(data)
    },
    onSuccess: () => {
      toast.success('Tạo counter thành công!')
      reset()
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi tạo counter!')
      console.log(err)
    }
  })

  const editTourMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = blog._id
      return counterApi.editCounter(slug, data)
    },
    onSuccess: () => {
      toast.success('Sửa thành công!')
      navigate('/counters')
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
      championName: data.championName,
      championId: data.championName,
      role: data.role,
      overallWinRate: Number(data.overallWinRate),
      pickRate: Number(data.pickRate),
      banRate: Number(data.banRate),
      patch: data.patch,
      strongAgainst: strongAgainst.map((item) => {
        return {
          championId: String(item.name || item.championName),
          championName: String(item.name || item.championName),
          winRate: 0,
          counterRating: 0,
          gameCount: 0,
          goldDifferentialAt15: 0,
          difficulty: 'Easy',
          tips: '',
          patch: data.patch,
          rank: 'Emerald+',
          imageUrl: item.imageUrl
        }
      }),
      weakAgainst: weakAgainst.map((item) => {
        return {
          championId: String(item.name || item.championName),
          championName: String(item.name || item.championName),
          winRate: 0,
          counterRating: 0,
          gameCount: 0,
          goldDifferentialAt15: 0,
          difficulty: 'Easy',
          tips: '',
          patch: data.patch,
          rank: 'Emerald+',
          imageUrl: item.imageUrl
        }
      }),
      bestLaneCounters: bestLaneCounters.map((item) => {
        return {
          championId: String(item.name || item.championName),
          championName: String(item.name || item.championName),
          winRate: 0,
          counterRating: 0,
          gameCount: 0,
          goldDifferentialAt15: 0,
          difficulty: 'Easy',
          tips: '',
          patch: data.patch,
          rank: 'Emerald+',
          imageUrl: item.imageUrl
        }
      }),
      worstLaneCounters: worstLaneCounters.map((item) => {
        return {
          championId: String(item.name || item.championName),
          championName: String(item.name || item.championName),
          winRate: 0,
          counterRating: 0,
          gameCount: 0,
          goldDifferentialAt15: 0,
          difficulty: 'Easy',
          tips: '',
          patch: data.patch,
          rank: 'Emerald+',
          imageUrl: item.imageUrl
        }
      }),
      formattedContent: data.formattedContent,
      weaknessesContent: data.weaknessesContent,
      counterItemsContent: data.counterItemsContent,
      strategiesContent: data.strategiesContent,
      additionalTipsContent: data.additionalTipsContent,
      rank: 'Emerald+'
    }

    if (blog) {
      console.log('Editing blog with ID:', blog)
      editTourMutation.mutate(blogData)
    } else {
      console.log('Creating new blog')
      createBlogMutation.mutate(blogData)
    }
  })

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>{blog ? 'Chỉnh sửa Counter' : 'Tạo Counter Mới'}</h1>

      <form onSubmit={onSubmit} className='space-y-6'>
        <Controller
          name='championName'
          control={control}
          render={({ field }) => <Input {...field} label='Tên tướng' errorMessage={errors.championName?.message} />}
        />
        {errors.championName && <p className='text-red-500 text-sm '>{errors.championName.message}</p>}
        <div className='grid md:grid-cols-3 gap-4'>
          <div>
            <Controller
              name='overallWinRate'
              control={control}
              render={({ field }) => <Input  {...field} label='Tỷ lệ win' errorMessage={errors.overallWinRate?.message} />}
            />
            {errors.overallWinRate && <p className='text-red-500 text-sm '>{errors.overallWinRate.message}</p>}
          </div>
          <div>
            <Controller
              name='pickRate'
              control={control}
              render={({ field }) => <Input  {...field} label='Tỷ lệ pick' errorMessage={errors.pickRate?.message} />}
            />
            {errors.pickRate && <p className='text-red-500 text-sm '>{errors.pickRate.message}</p>}
          </div>
          <div>
            <Controller
              name='banRate'
              control={control}
              render={({ field }) => <Input  {...field} label='Tỷ lệ ban' errorMessage={errors.banRate?.message} />}
            />
            {errors.banRate && <p className='text-red-500 text-sm '>{errors.banRate.message}</p>}
          </div>
        </div>
        <div className='grid md:grid-cols-2 gap-4'>
          <MultiSelectChampion
            className='z-[54]'
            label='Tướng mạnh hơn'
            defaultValues={blog?.strongAgainst?.length > 0 ? blog.strongAgainst : []}
            onChange={(val) => setStrongAgainst(val)}
          />
          <MultiSelectChampion
            className='z-[54]'
            label='Tướng khắc chế'
            defaultValues={blog?.weakAgainst?.length > 0 ? blog.weakAgainst : []}
            onChange={(val) => setWeakAgainst(val)}
          />
          <MultiSelectChampion
            className='z-[50]'
            label='Tướng mạnh hơn khi đi đường'
            defaultValues={blog?.bestLaneCounters?.length > 0 ? blog.bestLaneCounters : []}
            onChange={(val) => setBestLaneCounters(val)}
          />
          <MultiSelectChampion
            className='z-[50]'
            label='Tướng yếu hơn khi đi đường'
            defaultValues={blog?.worstLaneCounters?.length > 0 ? blog.worstLaneCounters : []}
            onChange={(val) => setWorstLaneCounters(val)}
          />
        </div>
        <Controller
          name='patch'
          control={control}
          render={({ field }) => <Input {...field} label='Phiên bản' errorMessage={errors.patch?.message} />}
        />
        {errors.patch && <p className='text-red-500 text-sm '>{errors.patch.message}</p>}
        <Controller
          name='role'
          control={control}
          render={({ field }) => (
            <Select
              label='Vị trí'
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString()
                field.onChange(selectedKey)
              }}
              errorMessage={errors.role?.message}
            >
              {roles.map((role: any) => (
                <SelectItem key={role.code} value={role.code}>
                  {role.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        {errors.role && <p className='text-red-500 text-sm '>{errors.role.message}</p>}

        <Controller
          name='formattedContent'
          control={control}
          render={({ field }) => <ContentEditor field={field} valuesContent={formattedContent} label='Nội dung tổng quan' />}
        />
        {errors.formattedContent && <p className='text-red-500 text-sm mt-1'>{errors.formattedContent.message}</p>}
        <Controller
          name='weaknessesContent'
          control={control}
          render={({ field }) => <ContentEditor field={field} valuesContent={weaknessesContent} label='Nội dung khuyết điểm' />}
        />
        <Controller
          name='counterItemsContent'
          control={control}
          render={({ field }) => <ContentEditor field={field} valuesContent={counterItemsContent} label='Nội dung đối thủ' />}
        />
        <Controller
          name='strategiesContent'
          control={control}
          render={({ field }) => <ContentEditor field={field} valuesContent={strategiesContent} label='Nội dung chiến thuật' />}
        />
        <Controller
          name='additionalTipsContent'
          control={control}
          render={({ field }) => <ContentEditor field={field} valuesContent={additionalTipsContent} label='Nội dung thủ thuật' />}
        />
        {errors.weaknessesContent && <p className='text-red-500 text-sm mt-1'>{errors.weaknessesContent.message}</p>}
        {blog ? (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={editTourMutation.isPending}>
            Chỉnh sửa
          </Button>
        ) : (
          <Button type='submit' color='primary' className='mt-6 w-full' isLoading={createBlogMutation.isPending}>
            Tạo Counter
          </Button>
        )}
      </form>
    </div>
  )
}

const ContentEditor = ({ field, valuesContent, label }: { field: any; valuesContent: any, label: string }) => {
  const editorRef = useRef<any>(null)

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
    <div>
      <label className='block mb-2'>{label}</label>
      <Editor
        apiKey='ywl69cdufov43p0iduwnewjh5sl1w99pz6uuess6an747i6k'
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
          height: 200,
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
          fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 42pt 48pt 56pt 64pt 72pt',
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
    </div>
  )
}

export default CreateCounter
