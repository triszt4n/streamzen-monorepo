'use client'

import { Avatar, Listbox, ListboxItem } from '@nextui-org/react'
import { AlbumUser, Role, User } from '@prisma/client'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = {
  users: Array<AlbumUser & { user?: User }>
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const AlbumUserList: React.FC<Props> = ({ users, ...props }) => {
  return (
    <div
      {...props}
      className={`w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 ${props.className}`}
    >
      <Listbox
        classNames={{
          list: 'max-h-[300px]',
        }}
        variant="flat"
        topContent={
          <span className="text-sm font-bold text-center py-2">
            Members in album
          </span>
        }
        label="Assigned to"
      >
        {users.map((item) => (
          <ListboxItem key={item.id} textValue={item.user?.name ?? undefined}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={item.user?.name ?? 'Unknown'}
                className="flex-shrink-0"
                size="sm"
                src={item.user?.image ?? ''}
                showFallback
                imgProps={{ referrerPolicy: 'no-referrer' }}
              />
              <div className="flex flex-col">
                <span className="text-small">
                  {item.user?.name}
                  {item.role === Role.ADMIN ? ' (owner)' : ''}
                </span>
                <span className="text-tiny text-default-400">
                  {item.user?.email}
                </span>
              </div>
            </div>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}

export default AlbumUserList
