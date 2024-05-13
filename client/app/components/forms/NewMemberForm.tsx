'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { Button, Spinner } from '@nextui-org/react'
import { User } from '@prisma/client'
import { useState } from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import revalidateMembersAction from '../../actions/revalidateMembers'
import MemberSelector from '../MemberSelector'
import ErrorModal from './ErrorModal'

type Props = {
  users: User[]
  albumId: string
}

export default function NewMemberForm({ users, albumId }: Props) {
  const methods = useForm<{ id: string }>()
  const { register, control } = methods
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle')
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
      <FormProvider {...methods}>
        <Form
          action={`/api/albums/${albumId}/members`}
          encType="application/json"
          control={control}
          onSubmit={({ data }) => {
            setSubmitStatus('loading')
          }}
          onSuccess={() => {
            setSubmitStatus('success')
            setTimeout(() => {
              setSubmitStatus('idle')
              revalidateMembersAction()
            }, 5000)
          }}
          onError={async ({ response, error }) => {
            setSubmitStatus('error')
            const data = await response?.json()
            setError(
              data.message ?? 'An error occured while processing your request.',
            )
            setTimeout(() => {
              setSubmitStatus('idle')
            }, 1000)
          }}
          className="flex flex-row gap-2"
        >
          <MemberSelector users={users} />
          <Button
            isIconOnly
            variant="flat"
            size="lg"
            type="submit"
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? (
              <Spinner size="sm" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
          </Button>
        </Form>
      </FormProvider>
      <ErrorModal shouldOpen={submitStatus === 'error'} message={error} />
    </>
  )
}
