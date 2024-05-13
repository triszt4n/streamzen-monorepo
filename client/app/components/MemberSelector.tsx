'use client'

import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { User } from '@prisma/client'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type MemberSelectorProps = {
  users: User[]
}

const MemberSelector: FC<MemberSelectorProps> = ({ users }) => {
  const { setValue, register } = useFormContext()

  return (
    <Autocomplete
      label="Add member"
      variant="underlined"
      size="sm"
      onSelectionChange={(selected) => setValue('id', selected as string)}
    >
      {users.map((user) => (
        <AutocompleteItem key={user.id} value={user.id}>
          {user.email}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export default MemberSelector
