import { Button } from './Button'

interface ButtonHyperlinkProps {
  label: string
  href: string
  newTab?: boolean
}

export function ButtonHyperlink({ label, href, newTab = true }: ButtonHyperlinkProps) {
  return (
    <a href={href} target={newTab ? '_blank' : '_self'} rel={newTab ? 'noopener noreferrer' : undefined}>
      <Button label={label} />
    </a>
  )
}
