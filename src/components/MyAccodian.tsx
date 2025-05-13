/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionItem } from '@nextui-org/react'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MyAccordion = ({ item }: any) => {
  const location = useLocation()

  // Memorize subMenu rendering logic
  const subMenuItems = useMemo(() => {
    return item?.subMenu?.map((itemx: any, indexx: any) => (
      <Link
        className={`${location.pathname === itemx.path && 'text-blue-500'} block hover:text-foreground-500`}
        key={indexx}
        to={itemx.path}
      >
        {itemx.title}
      </Link>
    ))
  }, [item?.subMenu, location.pathname]) // Only recalculate when subMenu or path changes

  return (
    <Accordion className='!px-0'>
      <AccordionItem
        className='!py-2 rounded px-2'
        key='theme'
        aria-label='Theme'
        title={<div className='text-sm uppercase'>{item.title}</div>}
        startContent={item.icon}
      >
        <div className='space-y-2 pl-5'>
          {subMenuItems} {/* Use the memoized subMenu items */}
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default MyAccordion
