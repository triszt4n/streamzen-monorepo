'use client'

import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Spinner } from '@nextui-org/react'
import { useState } from 'react'
import revalidatePhotosAction from '../../actions/revalidatePhotos'
import ActionButton from '../ActionButton'

type Props = {
  albumId: string
  headers: HeadersInit
}

export default function RefreshButton({ albumId, headers }: Props) {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle')

  const handleRefresh = async () => {
    setSubmitStatus('loading')

    const response = await fetch(`/api/albums/${albumId}/refresh`, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      setSubmitStatus('error')
      const data = await response?.json()
      console.error(data?.message)
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 1000)
      return
    }

    setSubmitStatus('success')
    setTimeout(() => {
      setSubmitStatus('idle')
    }, 5000)

    revalidatePhotosAction()
  }

  return (
    <ActionButton
      onClick={handleRefresh}
      className={
        submitStatus === 'success'
          ? 'text-success'
          : submitStatus === 'error'
            ? 'text-danger'
            : ''
      }
      icon={
        submitStatus === 'loading' ? (
          <Spinner size="sm" />
        ) : submitStatus === 'success' ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <ArrowPathIcon className="h-4 w-4" />
        )
      }
    >
      {submitStatus === 'loading'
        ? 'Refreshing...'
        : submitStatus === 'success'
          ? 'Success'
          : 'Refresh ACLs'}
    </ActionButton>
  )
}
