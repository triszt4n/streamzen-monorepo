'use client'

import { signIn } from 'next-auth/react'
import ActionButton from './ActionButton'
import GoogleIcon from './GoogleIcon'

export default function GoogleButton() {
  return (
    <ActionButton
      onClick={() => signIn('google')}
      icon={<GoogleIcon className="h-4 w-4" />}
      className="flex-row-reverse"
    >
      Log in with Google
    </ActionButton>
  )
}
