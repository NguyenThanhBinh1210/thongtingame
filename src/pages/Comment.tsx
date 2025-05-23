/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Input } from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import debounce from 'lodash/debounce'

import { commentApi } from '~/apis/comment.api'
import { useLocation } from 'react-router-dom'

// Thêm interface cho Tour
interface Tour {
  _id: string

  name: string
  imageUrl: string
  title: string
  tags: string[]
  authorName: string
  content: string
}

// Add Language interface


const Comment = () => {
  const localtionComments = useLocation().state.comments
  const [comments, setComments] = useState<any[]>(localtionComments || [])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  // const pages = Math.ceil(blogs?.length / rowsPerPage)
  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

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
    const filtered = comments?.filter((comment: any) => {
      const matchesSearch =
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filtered?.slice(start, end)
  }, [comments, page, rowsPerPage, searchTerm])

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
            (comments?.filter(
              (comment: any) =>
                comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.authorName.toLowerCase().includes(searchTerm.toLowerCase())

            ).length || 0) / rowsPerPage
          )}
          variant='light'
          onChange={setPage}
        />
      </div>
    )
  }, [page, rowsPerPage, searchTerm, comments])



  // Update blogs query to include language

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await commentApi.deleteComment(id)
      return id
    },
    onSuccess: (id: string) => {
      setComments(prevComments => prevComments.filter((comment: any) => comment._id !== id))
      toast.success('Xoá bình luận thành công!')
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
            placeholder='Tìm kiếm theo nội dung bình luận hoặc tên tác giả...'
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
          <TableColumn className='w-[50px]'>Mã bình luận</TableColumn>
          <TableColumn className='min-w-[300px]'>Nội dung</TableColumn>
          <TableColumn className='min-w-[300px]'>Tác giả</TableColumn>
          <TableColumn className='text-center'> </TableColumn>
        </TableHeader>
        {comments?.length === 0 ? (
          <TableBody emptyContent={'No information is available'}>{[]}</TableBody>
        ) : (
          <TableBody>
            {filteredItems?.map((item: Tour, index: number) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>


                <TableCell className='uppercase'>{item.content}</TableCell>
                <TableCell className='uppercase'>{item.authorName}</TableCell>



                <TableCell>
                  <div className=' uppercase flex gap-x-2 items-center'>
                    <Button
                      onClick={() => {
                        mutation.mutate(item._id)
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

export default Comment
