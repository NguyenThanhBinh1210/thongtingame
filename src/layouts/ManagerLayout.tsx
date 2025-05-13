import { useEffect, useState } from 'react'
import SideBar from './manager/SideBar'
import TopBar from './manager/TopBar'
import { LayoutPropsInterface } from '~/types/base.type'

const ManagerLayout = ({ children }: LayoutPropsInterface) => {
  const [showSideBar, setShowSideBar] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowSideBar(false)
      } else {
        setShowSideBar(true)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <div className='flex'>
      <SideBar isShow={showSideBar} />
      <div
        onClick={() => setShowSideBar(false)}
        style={{ zIndex: 20 }}
        className={`transition-all ${
          showSideBar ? 'bg-opacity-20 visible' : 'bg-opacity-0 invisible'
        } fixed top-0 left-0 w-full h-full bg-black  md:hidden`}
      ></div>
      <div
        className={`${
          showSideBar ? 'md:translate-x-[264px] md:w-[calc(100%-264px)] ' : ' md:w-full'
        } w-full transition-all `}
      >
        <TopBar onShow={() => setShowSideBar(!showSideBar)} />
        <div className=''>
          <div className='pt-3 pb-5 px-3  min-h-[calc(100vh-125.6px)] bg-foreground-50'>{children}</div>
          <div className='border-t border-foreground-100 text-sm text-center py-4'>© Created by Catalina 2024</div>
        </div>
      </div>
    </div>
  )
}

export default ManagerLayout
