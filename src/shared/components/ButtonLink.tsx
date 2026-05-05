import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import { Button } from './Button'
import { LinkComponentProps } from '@tanstack/react-router'

interface ButtonLinkProps {
  label: string
  linkProps: LinkComponentProps
}

export function ButtonLink({ label, linkProps }: ButtonLinkProps) {
  return (
    <Link {...linkProps}>
      <Button label={label} />
    </Link>
  )
}
