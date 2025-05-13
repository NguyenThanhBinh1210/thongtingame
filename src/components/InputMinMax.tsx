import { Tooltip } from '@nextui-org/react'
import { useState } from 'react'

interface Props {
  defaultValue: number | string
  isMin?: boolean
  type: string
}
const InputMinMax = ({ defaultValue = '3', isMin, type }: Props) => {
  const formatNumber = (num: string | number) => {
    const cleaned = String(num).replace(/\D/g, '')
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const [value, setValue] = useState<string | number>(formatNumber(defaultValue))
  const [error, setError] = useState<boolean>(false)
  const [errorShow, setErrorShow] = useState<string>('')

  const parseFormattedNumber = (formattedNum: string | number) => {
    return String(formattedNum).replace(/,/g, '')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const parsedValue = parseFormattedNumber(inputValue)
    const numericValue = parseInt(parsedValue, 10)
    if (isMin === true) {
      if (numericValue < Number(defaultValue) || !numericValue) {
        setError(true)
        setErrorShow(`${type} must be greater than or equal to ${formatNumber(defaultValue)}`)
      } else {
        setError(false)
        setErrorShow('')
      }
      const formattedValue = formatNumber(inputValue)
      setValue(formattedValue)
    } else if (numericValue > Number(defaultValue) || !numericValue || numericValue === 0) {
      setError(true)
      setErrorShow(`${type} must be less than or equal to ${formatNumber(defaultValue)}`)
    } else {
      setError(false)
      setErrorShow('')
    }
    const formattedValue = formatNumber(inputValue)
    setValue(formattedValue)
  }
  return (
    <div className='flex items-center gap-2 justify-between'>
      <Tooltip className='max-w-44' size='sm' showArrow color='danger' isOpen={error} content={errorShow}>
        <input
          value={value}
          onChange={handleChange}
          type='text'
          className={`rounded border text-end border-foreground-300 px-2 py-1 w-[48%] ${
            error && 'border-red-500 bg-red-100 dark:bg-red-950'
          }`}
        />
      </Tooltip>
      <div>{isMin ? '>=' : '<='}</div>
      <div className='w-[48%]'>{formatNumber(defaultValue)}</div>
    </div>
  )
}

export default InputMinMax
