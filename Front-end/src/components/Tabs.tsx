import './tabs.css'

export type FileFilter = 'all' | 'active' | 'expired'

const options: { value: FileFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'expired', label: 'Expiré' },
]

type TabsProps = {
  value: FileFilter
  onChange: (value: FileFilter) => void
}

export function Tabs({ value, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Filtrer les fichiers">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={`tabs__tab ${value === option.value ? 'tabs__tab--active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
