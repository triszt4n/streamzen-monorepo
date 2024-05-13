import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

const Container: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, ...props }) => (
  <div {...props} className={`container px-4 mx-auto ${className}`}>
    {children}
  </div>
)

export default Container
