import { Button } from "@/components/ui/button"
import { PropsWithChildren } from "react"
import { Link } from "react-router-dom"

interface SectionProps {
  title: string
  imageSrc: string
  imageOnLeft: boolean
  button?: {
    label: string
    href: string
    variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }
}

export const AboutSection: React.FC<PropsWithChildren<SectionProps>> = ({ children, title, imageSrc, imageOnLeft, button }) => {
  return (
    <div className={`flex flex-col ${imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 py-12`}>
      <div className="w-full md:w-1/3 flex justify-center">
        <img src={imageSrc} alt="Kiegészítő fotó rólunk" className="max-h-72 object-contain shadow-sm shadow-slate-600" />
      </div>
      <div className="w-full md:w-2/3 space-y-4 text-base leading-5">
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        {children}
        {button && (
          <Link to={button.href}>
            <Button variant={button.variant}>{button.label}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
