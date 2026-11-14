import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  }
}

/** Nuage avec flèche montante (upload) */
export function CloudUploadIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M4.4 14.9A5 5 0 0 1 7 5.6a6 6 0 0 1 11.3 1.9 4.5 4.5 0 0 1 1.3 8.4" />
      <path d="M12 12v8" />
      <path d="m8.5 15.5 3.5-3.5 3.5 3.5" />
    </svg>
  )
}

/** Nuage avec flèche descendante (download) */
export function CloudDownloadIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M4.4 14.9A5 5 0 0 1 7 5.6a6 6 0 0 1 11.3 1.9 4.5 4.5 0 0 1 1.3 8.4" />
      <path d="M12 20v-8" />
      <path d="m8.5 16.5 3.5 3.5 3.5-3.5" />
    </svg>
  )
}

export function FileIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
    </svg>
  )
}

export function TrashIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

export function DownloadIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

export function ClockIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function InfoIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 11v5" />
    </svg>
  )
}

export function WarningIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

export function AlertIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

export function CopyIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function MenuIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function UserIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function LockIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
