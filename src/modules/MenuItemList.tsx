/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import Dropdown from './Dropdown'

import { Link } from 'react-router-dom'

const MenuItemList = ({ items, depthLevel }: any) => {
  const [dropdown, setDropdown] = useState(false)

  const ref: any = useRef()

  useEffect(() => {
    const handler = (event: any) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdown])

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true)
  }

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false)
  }

  const closeDropdown = () => {
    dropdown && setDropdown(false)
  }

  return (
    <li
      className='menu-items relative'
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {items.url && items.submenu ? (
        <>
          <button
            className='flex text-left  items-center text-current border-none bg-transparent cursor-pointer w-full'
            type='button'
            aria-haspopup='menu'
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {window.innerWidth < 960 && depthLevel === 0 ? (
              items.title
            ) : (
              <Link className='block text-base text-current no-underline text-left ' to={items.url}>
                {items.title}
              </Link>
            )}

            {depthLevel > 0 && window.innerWidth < 960 ? null : depthLevel > 0 && window.innerWidth > 960 ? (
              <span className='ml-[3px]'>&raquo;</span>
            ) : (
              <span className='ml-[3px] arrow' />
            )}
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown} />
        </>
      ) : !items.url && items.submenu ? (
        <>
          <button
            className='flex items-center text-left  text-current border-none bg-transparent cursor-pointer w-full'
            type='button'
            aria-haspopup='menu'
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{' '}
            {depthLevel > 0 ? <span className='ml-[3px]'>&raquo;</span> : <span className='ml-[3px] arrow' />}
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown} />
        </>
      ) : (
        <Link className='block text-left  text-base text-current no-underline' to={items.url}>
          {items.title}
        </Link>
      )}
    </li>
  )
}

export default MenuItemList
