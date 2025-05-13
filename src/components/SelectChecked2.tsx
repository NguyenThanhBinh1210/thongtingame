/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

interface Option {
  label: string
  value: string
  children?: Option[]
}

const optionsList: Option[] = [
  {
    label: 'Option 1',
    value: 'option1',
    children: [
      { label: 'Sub-option 1.1', value: 'suboption1.1' },
      { label: 'Sub-option 1.2', value: 'suboption1.2' }
    ]
  },
  {
    label: 'Option 2',
    value: 'option2',
    children: [
      { label: 'Sub-option 2.1', value: 'suboption2.1' },
      { label: 'Sub-option 2.2', value: 'suboption2.2' }
    ]
  },
  {
    label: 'Option 3',
    value: 'option3',
    children: []
  }
]

const SelectChecke2 = () => {
  const [checkedValues, setCheckedValues] = useState<string[]>([])

  // Thêm hàm để lấy tất cả các giá trị có thể check
  const getAllValues = (options: Option[]): string[] => {
    return options.reduce((acc: string[], option) => {
      if (option.children && option.children.length > 0) {
        return [...acc, ...option.children.map((child) => child.value)]
      }
      return [...acc, option.value]
    }, [])
  }

  // Thêm hàm xử lý check all
  const handleCheckAll = () => {
    const allValues = getAllValues(optionsList)
    setCheckedValues((prev) => {
      // Nếu tất cả đã được check, uncheck tất cả
      if (allValues.every((value) => prev.includes(value))) {
        return []
      }
      // Ngược lại, check tất cả
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
        // Nếu tất cả con đã được check, uncheck tất cả
        return prev.filter((v) => !childValues.includes(v))
      } else {
        // Nếu chưa check hết, check tất cả con
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

    return (
      <div key={option.value} className='option-item'>
        {hasChildren ? (
          <div>
            <label>
              <input
                type='checkbox'
                onChange={() => handleParentCheck(option)}
                checked={option.children?.every((child) => checkedValues.includes(child.value))}
              />
              {option.label}
            </label>
            <div className='children-options' style={{ marginLeft: '20px' }}>
              {option.children?.map((child) => (
                <div key={child.value}>
                  <label>
                    <input
                      type='checkbox'
                      checked={checkedValues.includes(child.value)}
                      onChange={() => handleCheck(child.value)}
                    />
                    {child.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <label>
            <input
              type='checkbox'
              checked={checkedValues.includes(option.value)}
              onChange={() => handleCheck(option.value)}
            />
            {option.label}
          </label>
        )}
      </div>
    )
  }

  // Thêm button vào phần return
  return (
    <div className='select-checked'>
      <div className='check-all-option'>
        <label>
          <input
            type='checkbox'
            onChange={handleCheckAll}
            checked={getAllValues(optionsList).every((value) => checkedValues.includes(value))}
          />
          {getAllValues(optionsList).every((value) => checkedValues.includes(value)) ? 'Uncheck All' : 'Check All'}
        </label>
      </div>
      {optionsList.map((option) => renderOption(option))}
    </div>
  )
}

export default SelectChecke2
