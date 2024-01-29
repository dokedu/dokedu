import type { FunctionalComponent, SVGAttributes } from "vue"

export type PageVariables = {
  limit?: number
  order?: string
  search?: string
  sortBy?: string
  offset?: number
  nextPage?: boolean
  filter?: { [key: string]: any }
  showDeleted?: boolean
}

interface SVGProps extends Partial<SVGAttributes> {
  size?: 24 | number
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
}

export type Icon = FunctionalComponent<SVGProps>
