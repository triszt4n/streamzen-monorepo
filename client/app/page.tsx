'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Role } from '@prisma/client'
import { useEffect, useState } from 'react'
import ActionButton from './components/ActionButton'
import Container from './components/Container'
import LogoFullAnimated from './components/LogoFullAnimated'
import AlbumCard from './components/album-components/AlbumCard'
import SearchBarForm from './components/album-components/SearchBarForm'
import { AlbumFull } from './types/album.types'

async function getData(
  sortingType: string = 'createdAt_desc',
): Promise<{ error: { message: string } } | AlbumFull[]> {
  const response = await fetch(`/api/albums?sortby=${sortingType}`, {
    method: 'GET',
  })
  const data = await response.json()
  if (!response.ok) {
    return { error: data }
  }
  return data
}

export default function Home() {
  const [data, setData] = useState<
    { error: { message: string } } | AlbumFull[] | undefined
  >(undefined)

  useEffect(() => {
    getData().then((data) => setData(data))
  }, [])

  const onSortChanged = (newType: string) => {
    if (!data || 'error' in data) return

    let newData
    switch (newType) {
      case 'createdAt_desc':
        newData = [
          ...data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        ]
        break
      case 'createdAt_asc':
        newData = [
          ...data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        ]
        break
      case 'name_desc':
        newData = [...data.sort((a, b) => b.name.localeCompare(a.name))]
        break
      case 'name_asc':
        newData = [...data.sort((a, b) => a.name.localeCompare(b.name))]
        break
      default:
        newData = data
        break
    }
    setData(newData)
  }

  return (
    <>
      <section className="flex flex-col items-center h-[90vh] sm:h-[92vh] justify-center gap-6 px-6 sm:px-0 pb-8">
        <h1 className="my-6 text-3xl font-extrabold leading-none tracking-tight">
          Welcome to
        </h1>
        <LogoFullAnimated className="h-20 w-full" />
        <div className="h-[50vh] flex flex-col justify-end items-center gap-6">
          <p className="text-sm">Browse public albums</p>
          <ChevronDownIcon className="h-6 w-6 animate-bounce" />
        </div>
      </section>
      <section>
        {!data ? (
          <div className="flex justify-center">Loading</div>
        ) : 'error' in data ? (
          <div>
            <h3 className="mb-4 text-2xl font-semibold">
              An error occured while fetching your data
            </h3>
            <p>{data.error.message}</p>
          </div>
        ) : (
          <Container>
            <div className="flex flex-col md:flex-row gap-8 mb-12 justify-between">
              <SearchBarForm onChangeSelected={onSortChanged} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {data.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={{
                    ...album,
                    author: album?.users?.find((u) => u.role === Role.ADMIN)
                      ?.user,
                  }}
                  firstPhoto={album.photos[0]}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mt-12">
              <div></div>
              <div></div>
              {/* <Pagination
                classNames={{ base: 'justify-self-center' }}
                isCompact
                showControls
                total={10}
                initialPage={1}
              /> */}
              <div className="justify-self-end">
                <ActionButton href="/albums">
                  Create your own album
                </ActionButton>
              </div>
            </div>
          </Container>
        )}
      </section>
    </>
  )
}
