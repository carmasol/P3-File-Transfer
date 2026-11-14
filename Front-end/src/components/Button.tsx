import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './button.css'

type Variant = 'primary' | 'dark' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  block?: boolean
  icon?: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden /> : icon}
      {children && <span>{children}</span>}
    </button>
  )
}
