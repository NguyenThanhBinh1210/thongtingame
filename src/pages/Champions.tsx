/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Input, Chip, } from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import debounce from 'lodash/debounce'
import { championApi } from '~/apis/champion.api'
import { commentApi } from '~/apis/comment.api'
import { useNavigate } from 'react-router-dom'

// Thêm interface cho Tour
interface Tour {
  _id: string
  name: string
  imageUrl: string
  title: string
  tags: string[]
}

// Add Language interface


const Champions = () => {
  const [champions, setChampions] = useState<Tour[]>([])
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
        champion.tags.map(tag => tag.toLowerCase()).includes(searchTerm.toLowerCase())
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
                champion.tags.map(tag => tag.toLowerCase()).includes(searchTerm.toLowerCase())
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
    queryKey: ['champions'],
    queryFn: async () => {
      const response = await championApi.getChampions({})
      if (response.data.data) {
        setChampions(response.data.data)
      }
    }
  })


  const mutation = useMutation({
    mutationFn: (id: string) => {
      return commentApi.getCommentsChampion(id)
    },
    onSuccess: (data) => {
      console.log(data.data.data.comments);
      navigate(`/champions/comments`, {
        state: {
          comments: data.data.data.comments
        }
      })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra')
    }
  })

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div></div>
        <div className='flex gap-4 items-center'>


          <Input
            className='w-[300px]'
            placeholder='Tìm kiếm theo tên tướng hoặc tags...'
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
          <TableColumn className='min-w-[300px]'>Chi tiết</TableColumn>
          <TableColumn className='min-w-[300px]'>Tags</TableColumn>
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
                <TableCell className='uppercase'>{item.title}</TableCell>

                <TableCell className='uppercase'><div className='flex flex-wrap gap-2'>
                  {item.tags.map((items, indexs) => (
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
                        navigate(`/champions/edit/${item._id}`, {
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

export default Champions
