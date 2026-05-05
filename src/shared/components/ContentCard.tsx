import { ButtonLink } from "./ButtonLink"
import { LinkComponentProps } from "@tanstack/react-router"

export interface Content {
  title: string
  description: string,
  date: string,
  linkProps: LinkComponentProps,
  btnLabel: string
}

export function ContentCard({ title, description, linkProps, btnLabel }: Content) {
  return (
    <div className="flex flex-col gap-4 border border-primary/20 bg-surface p-4 h-full">
      <h2 className="font-display text-sm tracking-widest uppercase text-text">{title}</h2>
      <p className="text-sm text-muted flex-1">{description}</p>
      <ButtonLink linkProps={linkProps} label={btnLabel} />
    </div>
  )
}