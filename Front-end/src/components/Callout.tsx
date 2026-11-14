import type { ReactNode } from 'react'
import { AlertIcon, InfoIcon, WarningIcon } from './icons'
import './callout.css'

type Tone = 'info' | 'warning' | 'error'

const icons: Record<Tone, ReactNode> = {
  info: <InfoIcon size={15} />,
  warning: <WarningIcon size={15} />,
  error: <AlertIcon size={15} />,
}

type CalloutProps = {
  tone?: Tone
  children: ReactNode
}

export function Callout({ tone = 'info', children }: CalloutProps) {
  return (
    <div className={`callout callout--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="callout__icon">{icons[tone]}</span>
      <span>{children}</span>
    </div>
  )
}
