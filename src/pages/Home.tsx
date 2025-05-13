const Home = () => {
  return (
    <div className='grid md:grid-cols-2 gap-4 '>
      <div className='bg-white dark:bg-black dark:bg-opacity-50 p-3 border border-foreground-100'>
        <div className='flex items-center gap-2 font-medium mb-3'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
            <path d='M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z' />
          </svg>
          <span className='uppercase'>Balance</span>
        </div>
        <div className='text-sm space-y-1'>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Master</p>
            <p className='font-medium'>U4W00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Currency</p>
            <p className='font-medium'>UT</p>
          </div>
          <div className='flex items-center justify-between  py-1'>
            <p className='font-medium uppercase border-b border-foreground-200 w-full pb-2'>Balance</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Cash</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Yesterday Cash</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Total</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Yesterday Total</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>3rd Party Pending Transfer</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between  py-1'>
            <p className='font-medium uppercase border-b border-foreground-200 w-full pb-2'>Win Loss</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Today Win Loss (09/20/2024)</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Yesterday (09/19/2024)</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between  py-1'>
            <p className='font-medium uppercase border-b border-foreground-200 w-full pb-2'>Credit</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Master Given</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Total Agent</p>
            <p className='font-medium'>0.00</p>
          </div>
        </div>
      </div>
      <div className='bg-white dark:bg-black dark:bg-opacity-50 p-3 border border-foreground-100'>
        <div className='flex items-center gap-2 font-medium mb-3'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
            <path
              fillRule='evenodd'
              d='M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z'
              clipRule='evenodd'
            />
            <path
              fillRule='evenodd'
              d='M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z'
              clipRule='evenodd'
            />
          </svg>

          <span className='uppercase'>Statistics</span>
        </div>
        <div className='text-sm space-y-2'>
          <div className='flex items-center justify-between  py-1'>
            <p className='font-medium uppercase border-b border-foreground-200 w-full pb-2'>Outstanding</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Master</p>
            <p className='font-medium'>0.00</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Total Outstanding</p>
            <p className='font-medium'>0.00</p>
          </div>

          <div className='flex items-center justify-between  py-1'>
            <p className='font-medium uppercase border-b border-foreground-200 w-full pb-2'>Member Info</p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Agent</p>
            <p className='font-medium'>
              <span className='text-blue-600'>0</span> | <span className='text-red-600'>0</span> |{' '}
              <span className='text-orange-600'>0</span>
            </p>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <p>Member</p>
            <p className='font-medium'>
              <span className='text-blue-600'>0</span> | <span className='text-red-600'>0</span> |{' '}
              <span className='text-orange-600'>0</span>
            </p>
          </div>

          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <div className='flex items-center gap-2'>
              Top 10 winning members of the month{' '}
              <button>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
                  <path
                    fillRule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <div className='flex items-center gap-2'>
              Highest turnover members of the month{' '}
              <button>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
                  <path
                    fillRule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between hover:bg-foreground-200 px-1 transition-all duration-300 py-1'>
            <div className='flex items-center gap-2'>
              New members of the month: 0{' '}
              <button>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
                  <path
                    fillRule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
