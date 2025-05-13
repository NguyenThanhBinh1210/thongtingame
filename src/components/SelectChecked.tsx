/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, Checkbox, Input } from '@nextui-org/react'
import { Button, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { useContext, useState, useEffect } from 'react'
import { Accordion, AccordionItem } from '@nextui-org/react'
import { AppContext } from '~/contexts/app.context'
import CloseIcon from './icons/CloseIcon'
interface Option {
  label: string
  value: string
  children?: Option[]
}

const optionsList: Option[] = [
  {
    label: 'Live casino',
    value: 'live-casino',
    children: [
      { label: 'FGG', value: 'fgg' },
      { label: 'Allbet', value: 'allbet' }
    ]
  },
  {
    label: 'RNG',
    value: 'rng',
    children: [
      { label: 'Funky Games', value: 'funky-games' },
      { label: 'Pragmatic Play', value: 'pragmatic-play' }
    ]
  },
  {
    label: 'Sportsbook',
    value: 'sportsbook',
    children: []
  }
]

const SelectChecked = ({ options = optionsList, isSearch = false }: { options?: Option[]; isSearch?: boolean }) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const { isDark } = useContext(AppContext)

  const getAllValues = (options: Option[]): string[] => {
    return options.reduce((acc: string[], option) => {
      if (option.children && option.children.length > 0) {
        return [...acc, ...option.children.map((child) => child.value)]
      }
      return [...acc, option.value]
    }, [])
  }

  useEffect(() => {
    const allValues = getAllValues(options)
    setCheckedValues(allValues)
  }, [])

  // Handle search
  useEffect(() => {
    const filtered = options
      .map((option) => {
        if (option.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          return option
        }
        if (option.children?.some((child) => child.label.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return {
            ...option,
            children: option.children.filter((child) => child.label.toLowerCase().includes(searchTerm.toLowerCase()))
          }
        }
        return null
      })
      .filter(Boolean) as Option[]

    setFilteredOptions(filtered)
  }, [searchTerm])

  const handleCheckAll = () => {
    const allValues = getAllValues(options)
    setCheckedValues((prev) => {
      if (allValues.every((value) => prev.includes(value))) {
        return []
      }
      return allValues
    })
  }

  const handleCheck = (value: string) => {
    setCheckedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleParentCheck = (option: Option) => {
    const childValues = option.children?.map((child) => child.value) || []

    setCheckedValues((prev) => {
      const allChildrenChecked = childValues.every((value) => prev.includes(value))

      if (allChildrenChecked) {
        return prev.filter((v) => !childValues.includes(v))
      } else {
        const newValues = [...prev]
        childValues.forEach((value) => {
          if (!newValues.includes(value)) {
            newValues.push(value)
          }
        })
        return newValues
      }
    })
  }

  const renderOption = (option: Option) => {
    const hasChildren = option.children && option.children.length > 0

    const highlightText = (text: string) => {
      if (!searchTerm) return text
      const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
      return parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className='text-blue-600'>
            {part}
          </span>
        ) : (
          part
        )
      )
    }

    return (
      <div key={option.value} className=''>
        {hasChildren ? (
          <Accordion defaultExpandedKeys={['1']} className=''>
            <AccordionItem
              key='1'
              title={
                <div className='flex items-center gap-2'>
                  <Checkbox
                    size='sm'
                    className='p-0'
                    isSelected={option.children?.every((child) => checkedValues.includes(child.value))}
                    onValueChange={() => handleParentCheck(option)}
                  />
                  <p className='text-[16px]'>{highlightText(option.label)}</p>
                </div>
              }
            >
              <div className='children-options pl-2 overflow-hidden'>
                {option.children?.map((child) => (
                  <div key={child.value}>
                    <Checkbox
                      size='sm'
                      isSelected={checkedValues.includes(child.value)}
                      onValueChange={() => handleCheck(child.value)}
                    >
                      {highlightText(child.label)}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        ) : (
          <Checkbox
            size='sm'
            isSelected={checkedValues.includes(option.value)}
            onValueChange={() => handleCheck(option.value)}
          >
            {highlightText(option.label)}
          </Checkbox>
        )}
      </div>
    )
  }

  return (
    <Popover placement='bottom-start' className={` text-foreground ${isDark && 'dark'}  `}>
      <PopoverTrigger>
        <Button size='sm' className='rounded border-2 bg-foreground-50 border-foreground-200'>
          <div className='flex justify-between gap-x-3 items-center'>
            {checkedValues.length === getAllValues(optionsList).length
              ? `All Product (${getAllValues(optionsList).length})`
              : checkedValues.length > 0
                ? `${checkedValues.length} selected`
                : 'Select options'}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-3'>
              <path
                fillRule='evenodd'
                d='M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='items-start min-w-40 bg-foreground-100 p-0 '>
        <div className='select-checked w-full p-2.5 '>
          {isSearch && (
            <Input
              endContent={<CloseIcon onClick={() => setSearchTerm('')} className='size-4 cursor-pointer' />}
              type='text'
              size='sm'
              variant='bordered'
              className='mb-2 text-foreground'
              placeholder='Search product'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {filteredOptions.length > 0 ? (
            <>
              <div className='check-all-option'>
                <Checkbox
                  size='sm'
                  onValueChange={handleCheckAll}
                  isSelected={getAllValues(optionsList).every((value) => checkedValues.includes(value))}
                >
                  Select all
                </Checkbox>
              </div>
              {filteredOptions.map((option) => renderOption(option))}
            </>
          ) : (
            <div className='text-center py-1 text-sm text-gray-500'>No product Found</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SelectChecked
