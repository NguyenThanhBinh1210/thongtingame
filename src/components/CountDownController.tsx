import { Button, Select, SelectItem } from '@nextui-org/react'

import { useEffect, useState } from 'react'

const countNumber = [
  { key: 15, label: '15 sec' },
  { key: 30, label: '30 sec' },
  { key: 45, label: '45 sec' },
  { key: 60, label: '60 sec' },
  { key: 75, label: '75 sec' }
]
const CountDownController = () => {
  const [value, setValue] = useState<number>(15)
  const [valueCoutdown, setValueCountdown] = useState<number>(15)
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(Number(e.target.value))
    setValueCountdown(Number(e.target.value))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setValueCountdown((prevValue) => {
        if (prevValue === 0) {
          return 15
        }
        return prevValue - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [value])
  return (
    <div className='flex w-full max-w-64 gap-4 items-center '>
      <div className='w-7 flex justify-end text-sm'>{valueCoutdown} </div>
      <Select
        variant='bordered'
        size='sm'
        selectedKeys={[String(value)]}
        className='w-32 rounded-none'
        onChange={handleSelectionChange}
      >
        {countNumber.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
      <Button onClick={() => setValueCountdown(value)} isIconOnly variant='bordered' size='sm'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
          <path
            fillRule='evenodd'
            d='M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z'
            clipRule='evenodd'
          />
        </svg>
      </Button>
    </div>
  )
}

export default CountDownController
