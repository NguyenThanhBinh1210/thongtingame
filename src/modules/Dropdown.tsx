/* eslint-disable @typescript-eslint/no-explicit-any */
import MenuItemList from '~/modules/MenuItemList'

const Dropdown = ({ submenus, dropdown, depthLevel }: any) => {
  depthLevel = depthLevel + 1
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : ''
  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? 'show' : ''}`}>
      {submenus.map((submenu: any, index: any) => (
        <MenuItemList items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  )
}

export default Dropdown
