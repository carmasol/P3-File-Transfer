import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import './form.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ label, id, className = '', ...rest }: InputProps) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className="field__input" {...rest} />
    </div>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export function Select({ label, id, className = '', children, ...rest }: SelectProps) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className="field__select" {...rest}>
        {children}
      </select>
    </div>
  )
}
