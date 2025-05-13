import classNames from 'classnames'
interface Props {
  page: number
  pageSize: number
  setPage: (value: number) => void
  arrowClass?: string
}
const range = 2
const Pagination = ({ page, setPage, pageSize, arrowClass }: Props) => {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= range * 2 + 1 && pageNumber > page + range && pageNumber < pageSize - range + 1) {
          return renderDotAfter(index)
        } else if (page > range * 2 + 1 && page < pageSize - range * 2) {
          if (pageNumber < page - range && pageNumber > range) {
            return renderDotBefore(index)
          } else if (pageNumber > page + range && pageNumber < pageSize - range + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - range * 2 && pageNumber > range && pageNumber < page - range) {
          return renderDotBefore(index)
        }
        return (
          <button key={index} onClick={() => setPage(pageNumber)}>
            <button
              className={classNames('w-[30px] hover:shadow-xl h-[30px] rounded-[10px] font-[600] text-[16px]', {
                'bg-blue-400': pageNumber === page,
                'bg-transparent': pageNumber !== page,
                'text-white': pageNumber === page,
                'text-black': pageNumber !== page
              })}
            >
              {pageNumber}
            </button>
          </button>
        )
      })
  }
  return (
    <div className='flex mx-auto w-full justify-center gap-x-[30px]'>
      <button
        onClick={() => {
          if (!(page === 1)) {
            setPage(page - 1)
          }
        }}
      >
        <button
          className={`flex items-center justify-center ${
            arrowClass ? arrowClass : 'w-[30px] h-[30px] rounded-[10px] font-[600] text-[16px]'
          } ${!(page === 1) && 'hover:shadow-md shadow-xl'}`}
        >
          <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M7 1L2 6L7 11' stroke='#A2A2A8' strokeWidth='1.5' />
          </svg>
        </button>
      </button>
      <div className=' flex gap-x-[30px]'>{renderPagination()}</div>
      <button
        onClick={() => {
          if (!(page === pageSize)) {
            setPage(page + 1)
          }
        }}
      >
        <button
          className={`flex items-center justify-center ${
            arrowClass ? arrowClass : 'w-[30px] h-[30px] rounded-[10px] font-[600] text-[16px]'
          } ${!(page === pageSize) && 'hover:shadow-md shadow-xl'}`}
        >
          <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M1 11L6 6L1 1' stroke='#A2A2A8' strokeWidth='1.5' />
          </svg>
        </button>
      </button>
    </div>
  )
}

export default Pagination
