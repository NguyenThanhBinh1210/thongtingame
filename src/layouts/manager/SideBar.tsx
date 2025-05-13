/* eslint-disable @typescript-eslint/no-explicit-any */

import { Accordion, AccordionItem, Avatar } from '@nextui-org/react'
import { Link, useLocation } from 'react-router-dom'
import { menuCMS } from '~/constants/renaral.const'
import { Tabs, Tab } from '@nextui-org/react'
import { useContext, memo, useState, useEffect } from 'react'
import { AppContext } from '~/contexts/app.context'

interface MenuItem {
  icon: JSX.Element;
  title: string;
  path?: string;
  subMenu?: { title: string; path: string; }[];
}

const SideBar = memo(({ isShow }: { isShow: boolean }) => {
  const { profile } = useContext(AppContext)
  const location = useLocation().pathname
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('openAccordions')
    return new Set(saved ? JSON.parse(saved) : [])
  })

  useEffect(() => {
    localStorage.setItem('openAccordions', JSON.stringify(Array.from(openAccordions)))
  }, [openAccordions])
  console.log(profile)
  return (
    <div
      style={{ zIndex: 21 }}
      className={`${isShow ? '' : ' overflow-hidden  opacity-0 invisible -translate-x-full '
        }  no-scrollbar border-r border-foreground-100 fixed  left-0 overflow-auto h-screen  transition-all  `}
    >
      <div className={`w-[264px] py-4 h-full bg-background  overflow-hidden transition-all `}>
        <div className='px-2 flex py-2 gap-x-4 items-center'>
          <Link to={'/profile'}>
            <Avatar className='flex-shrink-0' isBordered src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
          </Link>
          <div className=' '>
            <p className='text-xs uppercase'>{profile?.name || "Nguyễn Thanh Bình"}</p>
            <p className='text-xs'>{profile?.email || 'admin@admin.com'}</p>
          </div>
        </div>
        <div className=' flex w-full items-center flex-col pt-3 overflow-y-auto h-[100%] no-scrollbar'>
          <Tabs aria-label='Options flex items-center'>
            <Tab key='main' title='MAIN MENU' className='font-medium text-[13px]  w-full px-4'>
              <div>
                {menuCMS.map((item: MenuItem, index) => (
                  <div key={index}>
                    {item.path ? (
                      <Link to={`/${item.path}`} className='flex px-2 rounded  justify-between items-center  py-2.5'>
                        <div className='flex items-center gap-x-1.5'>
                          {item.icon}
                          <p className='text-sm uppercase'>{item.title}</p>
                        </div>
                        {item.title === 'Đơn hàng' && (
                          <div className='text-white font-normal text-xs bg-black  w-5 h-5 rounded flex items-center justify-center'>
                            5
                          </div>
                        )}
                      </Link>
                    ) : (
                      <Accordion
                        className='!px-0'
                        selectedKeys={openAccordions}
                        onSelectionChange={(keys) => setOpenAccordions(keys as Set<string>)}
                      >
                        <AccordionItem
                          key={item.title}
                          aria-label={item.title}
                          className='!py-2 rounded px-2'
                          title={<div className='text-sm uppercase'>{item.title}</div>}
                          startContent={item.icon}
                        >
                          <div className='space-y-2 pl-5'>
                            {item.subMenu?.map((itemx, indexx) => (
                              <Link
                                className={`${location === itemx.path && 'text-blue-500'} block hover:text-foreground-500`}
                                key={indexx}
                                to={itemx.path}
                              >
                                {itemx.title}
                              </Link>
                            ))}
                          </div>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                ))}

              </div>

            </Tab>

          </Tabs>
        </div>
      </div>
    </div>
  )
})

export const SearchIcon = memo((props: any) => (
  <svg
    aria-hidden='true'
    fill='none'
    focusable='false'
    height='1em'
    role='presentation'
    viewBox='0 0 24 24'
    width='1em'
    {...props}
  >
    <path
      d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
    <path d='M22 22L20 20' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
  </svg>
))

SearchIcon.displayName = 'SearchIcon'
SideBar.displayName = 'SideBar'

export default SideBar
