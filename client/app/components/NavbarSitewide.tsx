'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
} from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { default as NextLink } from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import GoogleIcon from './GoogleIcon'
import Logo from './Logo'

export default function NavbarSitewide() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false)
  const { setTheme, theme } = useTheme()
  const { data: session } = useSession()

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMenuOpen])

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        {/* 
          * There's no need for a menu toggle button in this case
        
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        /> */}
        <NavbarBrand>
          <NextLink aria-label="Home button" href="/">
            <Logo style={{ height: '1.5rem' }} hasTitle />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/** There's no inside menus right now */}
      </NavbarContent>

      <NavbarContent className="flex gap-2" justify="end">
        <NavbarItem className="flex h-full items-center">
          {session && session.user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  radius="md"
                  size="md"
                  showFallback
                  src={session.user.image ?? undefined}
                  imgProps={{ referrerPolicy: 'no-referrer' }}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                disabledKeys={['profile']}
                variant="flat"
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">
                    {session.user.email ?? 'unknown email'}
                  </p>
                </DropdownItem>
                <DropdownItem as={NextLink} href="/albums" key="myAlbums">
                  Your albums
                </DropdownItem>
                <DropdownItem
                  onClick={() => signOut()}
                  key="logout"
                  color="danger"
                >
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              variant="flat"
              className="text-md"
              aria-label="Login button"
              endContent={<GoogleIcon className="h-4 w-4" />}
              onPress={() => signIn('google')}
            >
              Log in
            </Button>
          )}
        </NavbarItem>
        <NavbarItem className="flex h-full items-center">
          <Button
            isIconOnly
            aria-label="Switch theme"
            className="p-0"
            variant="flat"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Suspense fallback={null}>
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Suspense>
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="flex gap-4 pt-4 bg-background bg-opacity-70">
        {/** There's no inside menus right now */}
      </NavbarMenu>
    </Navbar>
  )
}
