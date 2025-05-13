/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ModalContent, ModalHeader } from '@nextui-org/react'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'

const BaseModal = ({ isOpen, onOpenChange, children, size = 'xl', title }: any) => {
  const { isDark } = useContext(AppContext)
  return (
    <Modal backdrop={'blur'} size={size} style={{ zIndex: 1000 }} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className={`!bg-foreground-50 text-foreground  ${isDark && 'dark'}`}>
        <div className={`  `}>
          <ModalHeader className='flex flex-col gap-1  '>{title}</ModalHeader>
          {children}
        </div>
      </ModalContent>
    </Modal>
  )
}

export default BaseModal
