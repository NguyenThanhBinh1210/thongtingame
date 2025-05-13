// import { Avatar, IconButton } from '@material-tailwind/react'
// import { Popover, PopoverHandler, PopoverContent } from '@material-tailwind/react'
import {
  Button,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure
} from '@nextui-org/react'
import { useContext } from 'react'
import { Link, } from 'react-router-dom'
import BaseModal from '~/components/modals/BaseModal'
import { AppContext } from '~/contexts/app.context'
import { Profile } from '~/types/auth.type'
import { clearLS, setDarkModeFromLS, setProfileFromLS } from '~/utils/auth'

const TopBar = ({ onShow }: { onShow: () => void }) => {
  const { isDark, setDark } = useContext(AppContext)
  // const navigate = useNavigate()
  const { isOpen, onOpenChange } = useDisclosure()
  const handleLogout = () => {
    clearLS()
    setProfileFromLS({} as Profile)
    alert('Logout successfully')
    window.location.href = '/login'

  }
  return (
    <>
      <header style={{ zIndex: 19 }} className='sticky top-0 !transition-all duration-500 bg-white dark:bg-black'>
        <div className='py-1 px-3 border-b border-foreground-100 flex justify-between items-center'>
          <div className='flex items-center gap-x-2'>
            <Button isIconOnly variant='light' onClick={onShow}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5' />
              </svg>
            </Button>
          </div>
          <div className='flex items-center gap-x-2 justify-end flex-1'>
            <Button
              isIconOnly
              variant='light'
              onClick={() => {
                setDarkModeFromLS(!isDark)
                setDark(!isDark)
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                <path d='M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z' />
              </svg>
            </Button>
            <Button isIconOnly variant='light' onClick={handleLogout}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6 rotate-180'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
                />
              </svg>
            </Button>
          </div>
        </div>
        <div className='py-1 px-3 border-b border-foreground-100 flex items-center'>
          <div className='w-[40px]'>
            <Link to={'/'}>
              <Button isIconOnly variant='light'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='size-4 text-foreground'
                >
                  <path d='M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z' />
                  <path d='m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z' />
                </svg>
              </Button>
            </Link>
          </div>

        </div>
      </header>
      <BaseModal isOpen={isOpen} onOpenChange={onOpenChange} title='Help us improve'>
        <ModalBody className=''>
          <Textarea
            labelPlacement='outside'
            label="We'd love to hear from you. How are we doing?"
            variant='bordered'
            placeholder='What functions can be improved? What functions are lacking?'
            disableAnimation
            disableAutosize
            className='w-full '
            classNames={{
              input: 'resize-y min-h-[40px]'
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onClick={onOpenChange}>
            Later
          </Button>
          <Button color='primary' onClick={onOpenChange}>
            Submit
          </Button>
        </ModalFooter>
      </BaseModal>
    </>
  )
}

export default TopBar
