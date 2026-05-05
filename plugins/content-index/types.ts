import type { ComponentType } from 'react'

export type ContentMeta = {
    title?: string,
    description?: string,
    date?: string,
    slug: string,
    path: string,
    component: () => Promise<{ default: ComponentType }>
}