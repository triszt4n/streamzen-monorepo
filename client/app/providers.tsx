'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{}>

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <ThemeProvider
          themes={['dark', 'light']}
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}
