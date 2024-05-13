'use server'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react'
import { PropsWithChildren } from 'react'
import ActionButton, { ActionButtonProps } from './ActionButton'

interface Props {
  title: string
  actionButtonProps: Omit<ActionButtonProps, 'children'> & { text: string }
  okButtonProps: { text: string; submitPressed: () => void }
  actionMessage?: {
    status: 'loading' | 'error' | 'success' | 'idle'
    message?: string
  }
}

export default async function ModalWithActionButton({
  actionButtonProps,
  okButtonProps,
  title,
  children,
  actionMessage,
}: PropsWithChildren<Props>) {
  let isOpen = false
  const onOpen = () => {
    isOpen = true
  }
  const onClose = () => {
    isOpen = false
  }

  return (
    <>
      <ActionButton {...actionButtonProps} onClick={onOpen}>
        {actionButtonProps.text}
      </ActionButton>
      <Modal isOpen={isOpen} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={okButtonProps.submitPressed}>
              {okButtonProps.text}
            </Button>
          </ModalFooter>
          {actionMessage && (
            <ModalFooter
              className={`pt-0 text-sm ${actionMessage.status === 'error' ? 'text-danger' : ''}`}
            >
              {actionMessage.status === 'loading' ? (
                <Spinner color="primary" size="sm"></Spinner>
              ) : (
                actionMessage.message
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
