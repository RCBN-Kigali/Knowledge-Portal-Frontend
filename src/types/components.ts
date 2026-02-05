import type { ReactNode, ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

export type IconProp = LucideIcon | ComponentType<{ className?: string }>
