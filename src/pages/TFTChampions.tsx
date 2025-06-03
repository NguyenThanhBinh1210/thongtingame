/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Input, Chip, SelectItem, Select, } from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import debounce from 'lodash/debounce'
import { championApi } from '~/apis/champion.api'
import { commentApi } from '~/apis/comment.api'
import { Link, useNavigate } from 'react-router-dom'

// Thêm interface cho Tour
interface Tour {
  _id: string
  name: string
  imageUrl: string
  title: string
  traits: string[]
}

// Add Language interface

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
const TFTChampions = () => {
  const [champions, setChampions] = useState<Tour[]>([])
  const [lang, setLang] = useState<string>('vi')

  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  // const pages = Math.ceil(blogs?.length / rowsPerPage)
  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
    }, 300),
    []
  )

  // const handleChangeStatus = (id: string) => {
  //   console.log(id)
  // }

  const filteredItems = useMemo(() => {
    const filtered = champions?.filter((champion) => {
      const matchesSearch =
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.traits.map(tag => tag.toLowerCase()).includes(searchTerm.toLowerCase())
      return matchesSearch
    })

    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filtered?.slice(start, end)
  }, [champions, page, rowsPerPage, searchTerm])

  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <Pagination
          showControls
          size='sm'
          classNames={{
            cursor: 'bg-foreground text-background'
          }}
          color='default'
          page={page}
          total={Math.ceil(
            (champions?.filter(
              (champion) =>
                champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                champion.traits.map(tag => tag.toLowerCase()).includes(searchTerm.toLowerCase())
            ).length || 0) / rowsPerPage
          )}
          variant='light'
          onChange={setPage}
        />
      </div>
    )
  }, [page, rowsPerPage, searchTerm, champions])



  // Update blogs query to include language
  useQuery({
    queryKey: ['tft-champions'],
    queryFn: async () => {
      const response = await championApi.getTFTChampions({})
      if (response.data) {
        console.log(response.data)
        setChampions(response.data)
      }
    }
  })


  const mutation = useMutation({
    mutationFn: (id: string) => {
      return commentApi.getCommentsChampion(id)
    },
    onSuccess: (data) => {
      console.log(data.data.data.comments);
      navigate(`/tft-champions/comments`, {
        state: {
          comments: data.data.data.comments
        }
      })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra')
    }
  })
  const queryClient = useQueryClient()
  const mutationDelete = useMutation({
    mutationFn: (id: string) => {
      return championApi.deleteTFTChampion(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tft-champions'] })
      toast.success('Xoá tướng thành công!')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra')
    }
  })
  const langMutation = useMutation({
    mutationFn: (lang: string) => {
      return championApi.getTFTChampions({ lang })
    },
    onSuccess: (data) => {
      setChampions(data.data)
    },
    onError: () => {
      toast.error('Có lỗi xảy ra')
    },

  })
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-4 items-center'>
          <Link to='/tft-champions/create'>
            <Button size='sm' color='primary'>
              Tạo tướng
            </Button>
          </Link>

          <Select
            className='w-[150px]'
            label=''
            size='sm'
            selectedKeys={lang ? [lang] : ['vi']}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]?.toString()
              setLang(selectedKey)
              langMutation.mutate(selectedKey)
            }}
          >
            {languages.map((language: any) => (
              <SelectItem key={language.code} value={language.code}>
                {language.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='flex gap-4 items-center'>


          <Input
            className='w-[300px]'
            placeholder='Tìm kiếm theo tên tướng hoặc traits...'
            onChange={(e) => debouncedSearch(e.target.value)}
            startContent={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4 h-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                />
              </svg>
            }
          />
        </div>
      </div>

      <Table className='mt-4' isHeaderSticky isStriped aria-label='table'>
        <TableHeader>
          <TableColumn className='w-[50px]'>Mã tướng</TableColumn>
          <TableColumn className='min-w-[300px]'>Hình ảnh</TableColumn>
          <TableColumn className='min-w-[300px]'>Tên</TableColumn>
          <TableColumn className='min-w-[300px]'>Traits</TableColumn>
          <TableColumn className='text-center'> </TableColumn>
        </TableHeader>
        {champions?.length === 0 ? (
          <TableBody emptyContent={'No information is available'}>{[]}</TableBody>
        ) : (
          <TableBody>
            {filteredItems?.map((item: Tour, index: number) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>

                <TableCell className='uppercase'>
                  <img src={item.imageUrl} alt={item.name} className='w-[100px] h-[100px] object-cover' />
                </TableCell>
                <TableCell className='uppercase'>{item.name}</TableCell>

                <TableCell className='uppercase'><div className='flex flex-wrap gap-2'>
                  {item.traits.map((items, indexs) => (
                    <Chip color='primary' size='sm' key={indexs}>{items}</Chip>
                  ))}
                </div></TableCell>

                <TableCell>
                  <div className=' uppercase flex gap-x-2 items-center'>
                    <Button
                      onClick={() => {
                        mutation.mutate(item._id)
                      }}
                      size='sm'
                      isIconOnly
                      aria-label='Like'
                      color='success'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-foreground-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>

                    </Button>
                    <Button
                      onClick={() => {
                        navigate(`/tft-champions/edit/${item._id}`, {
                          state: item
                        })
                      }}
                      size='sm'
                      isIconOnly
                      aria-label='Like'
                      color='primary'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                        />
                      </svg>
                    </Button>
                    <Button
                      onClick={() => {
                        mutationDelete.mutate(item._id)
                      }}
                      size='sm'
                      isIconOnly
                      aria-label='Like'
                      color='danger'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                        />
                      </svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className='flex items-center gap-4 mt-4 flex-wrap'>
        <label className='flex items-center text-default-400 text-small'>
          <select
            className='bg-transparent px-2 py-1.5 border outline-none text-default-400 text-small'
            onChange={onRowsPerPageChange}
          >
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='40'>40</option>
          </select>
        </label>
        <div>{bottomContent}</div>
      </div>
    </div>
  )
}

export default TFTChampions
