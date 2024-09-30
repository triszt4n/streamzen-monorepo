import { createContext, PropsWithChildren, useState } from "react"

export interface BreadcrumbProps {
  key: string
  label: string
  href: string
}

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbProps[]
  add: (breadcrumbProps: BreadcrumbProps) => void
  remove: (key: string) => void
  clear: () => void
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: PropsWithChildren) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbProps[]>([])

  const add = (breadcrumbProps: BreadcrumbProps) => {
    setBreadcrumbs([...breadcrumbs, breadcrumbProps])
  }

  const remove = (key: string) => {
    setBreadcrumbs(breadcrumbs.filter((breadcrumb) => breadcrumb.key !== key))
  }

  const clear = () => {
    setBreadcrumbs([])
  }

  const value = {
    breadcrumbs,
    add,
    remove,
    clear,
  }

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}
