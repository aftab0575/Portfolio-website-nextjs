import type { ReactNode } from 'react'

export interface CardSwapProps {
  width?: number
  height?: number
  sizeToFit?: boolean
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  dropDistance?: number
  onCardClick?: (index: number) => void
  skewAmount?: number
  easing?: string
  children: ReactNode
}

export interface CardProps extends React.PropsWithChildren {
  customClass?: string
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
}

export const Card: React.ForwardRefExoticComponent<CardProps, HTMLDivElement>
export default function CardSwap(props: CardSwapProps): JSX.Element
