/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { AppContext } from '~/contexts/app.context'

interface OptionsType {
  label: string
  value: string
}
interface ClassNamesType {
  dropdown?: string
  trigger?: string
  menu?: string

}
interface PropsType {
  options: OptionsType[]
  onChange?: (value: any) => void
  classNames?: ClassNamesType
  variant?: 'solid' | 'bordered'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
}

export default function SingleSelection({ options, classNames, variant = 'solid', color = 'primary', onChange }: PropsType) {
  const [selectedKeys, setSelectedKeys] = React.useState([options[0].value])
  const { isDark } = useContext(AppContext)
  const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(', ').replace(/_/g, ' '), [selectedKeys])
  const handleChange = (value: string) => {
    onChange && onChange(value)
  }
  return (
    <Dropdown className={`bg-foreground-100 text-foreground ${isDark && 'dark'} ${classNames?.dropdown}`}>
      <DropdownTrigger>
        <Button variant={variant} color={color} size='sm' className={`capitalize ${classNames?.trigger}`}>
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        className={`${classNames?.menu}`}
        onSelectionChange={(keys: any) => {
          setSelectedKeys(keys)
          handleChange(keys.anchorKey)
        }}
      >
        {options.map((option) => (
          <DropdownItem key={option.value}>{option.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
