'use client'

import { Select, SelectItem } from '@nextui-org/react'
import { useState } from 'react'
import { sortingTypes } from '../../utils/sortingTypes'

type Props = {
  onChangeSelected: (key: string) => void
}

export default function SearchBarForm({ onChangeSelected }: Props) {
  const [value, setValue] = useState(new Set(['createdAt_desc']))

  return (
    <>
      {/* <Input
        type="text"
        label="Search"
        labelPlacement="outside"
        startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
        isClearable
        classNames={{ base: 'max-w-md' }}
      />
      <DateRangePicker
        label="Last updated between"
        labelPlacement="outside"
        visibleMonths={2}
      /> */}
      <div></div>
      <Select
        labelPlacement="outside"
        label="Sort by"
        placeholder="Select a sorting option"
        classNames={{ base: 'max-w-64' }}
        selectedKeys={value}
        onSelectionChange={(selected) => {
          setValue(selected as Set<string>)
          onChangeSelected((selected as Set<string>).values().next().value)
        }}
      >
        {sortingTypes.map(([k, v]) => (
          <SelectItem key={k} value={k}>
            {v}
          </SelectItem>
        ))}
      </Select>
    </>
  )
}
