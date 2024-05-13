import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'

export type ActionButtonProps = {
  href?: string
  newTab?: boolean
  icon?: JSX.Element
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const ActionButton: FC<ActionButtonProps> = ({
  children,
  href,
  newTab,
  className,
  icon,
  ...props
}) =>
  href ? (
    <Link href={href} target={newTab ? '_blank' : '_self'}>
      <button
        {...props}
        className={
          `h-14 w-auto cursor-pointer ` +
          `inline-flex flex-row gap-3 items-center font-bold text-decoration-none relative ` +
          `after:content-[""] after:block after:absolute after:h-1 after:left-0 after:right-0 after:bottom-2 after:bg-primary after:transition-left ` +
          `hover:text-primary hover:after:left-full ` +
          className
        }
      >
        {children}
        {icon ?? <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </Link>
  ) : (
    <button
      {...props}
      className={
        `h-14 w-auto cursor-pointer ` +
        `inline-flex flex-row gap-3 items-center font-bold text-decoration-none relative ` +
        `after:content-[""] after:block after:absolute after:h-1 after:left-0 after:right-0 after:bottom-2 after:bg-primary after:transition-left ` +
        `hover:text-primary hover:after:left-full ` +
        className
      }
    >
      {children}
      {icon ?? <ArrowRightIcon className="h-4 w-4" />}
    </button>
  )

export default ActionButton
