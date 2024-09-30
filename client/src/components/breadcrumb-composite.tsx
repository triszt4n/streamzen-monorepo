import { useBreadcrumb } from "@/hooks/use-breadcrumb.hook"
import { Link } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"

export const BreadcrumbComposite = () => {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs?.map(({ key, label, href }, index) => (
          <Fragment key={key}>
            <BreadcrumbItem>
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={href} onClick={() => {}}>
                    {label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
