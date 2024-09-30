import { useContext } from "react"
import { BreadcrumbContext } from "./breadcrumb-context"

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within an BreadcrumbProvider")
  }
  return context
}
