'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useEffect } from 'react'

type Props = {
  shouldOpen: boolean
  message?: string
  onClose?: () => void
}

export default function ErrorModal({
  shouldOpen,
  message,
  onClose: onOutsideClose,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (shouldOpen) {
      onOpen()
    }
  }, [shouldOpen])

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Error occured
            </ModalHeader>
            <ModalBody>
              <p>An error occured while processing your request.</p>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  onClose()
                  onOutsideClose?.()
                }}
              >
                I understand
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
