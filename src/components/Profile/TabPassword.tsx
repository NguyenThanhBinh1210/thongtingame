import { Button, Checkbox, Input } from '@nextui-org/react'

const TabPassword = () => {
  return (
    <div className='grid md:grid-cols-2'>
      <div className='bg-white p-3 dark:bg-foreground-100 border border-foreground-200 rounded-md'>
        <Input
          className='mb-8'
          autoFocus
          labelPlacement='outside'
          label='Old Password'
          placeholder=' '
          variant='bordered'
        />
        <Input
          className='mb-8'
          labelPlacement='outside'
          label='New Password'
          placeholder=' '
          type='password'
          variant='bordered'
        />
        <Input
          className='mb-2'
          labelPlacement='outside'
          label='Confirm Password'
          placeholder=' '
          type='password'
          variant='bordered'
        />
        <div className='flex py-2 px-1 justify-between'>
          <Checkbox
            classNames={{
              label: 'text-small'
            }}
          >
            Show password
          </Checkbox>
        </div>
        <div className='flex gap-2'>
          <Button type='submit' className='mt-2' color='primary'>
            Submit
          </Button>
          <Button type='button' className='mt-2' color='warning'>
            Reset
          </Button>
        </div>
      </div>
      <div className='md:col-span-2 mt-3 text-sm space-y-1'>
        <p>Password must be at least 8 characters without white-space and contain at least 3 of the following:</p>
        <p>- Uppercase letter [A-Z]</p>
        <p>- Lowercase letter [a-z]</p>
        <p>- Numeric [0-9]</p>
        <p>- Special character (!,,#,etc..)</p>
        <p>
          <span className='font-medium'>For example:</span> 59D7!4$h, 493abcDE
        </p>
        <p>
          <span className='font-medium'>Note:</span> your password is cAsE sEnSiTiVe
        </p>
      </div>
    </div>
  )
}

export default TabPassword
