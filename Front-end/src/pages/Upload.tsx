import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Input, Select } from '../components/Form'
import {
  CloudUploadIcon,
  CopyIcon,
  FileIcon,
  LockIcon,
} from '../components/icons'
import { uploadFile } from '../api/files'
import { useAuth } from '../context/useAuth'
import { copyToClipboard, formatBytes, truncateMiddle } from '../lib/format'
import './upload.css'

const MAX_SIZE = 1024 * 1024 * 1024 // 1 Go

const EXPIRY_OPTIONS = [
  { value: '1', label: 'Une journée' },
  { value: '7', label: 'Une semaine' },
  { value: '30', label: 'Un mois' },
]

type Stage = 'idle' | 'uploading' | 'success'

export function Upload() {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('7')
  const [stage, setStage] = useState<Stage>('idle')
  const [shareUrl, setShareUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const tooLarge = file !== null && file.size > MAX_SIZE
  const expiryLabel =
    EXPIRY_OPTIONS.find((o) => o.value === expiresInDays)?.label ?? 'une semaine'

  const pickFile = (selected: File | undefined) => {
    setError('')
    setStage('idle')
    setCopied(false)
    setFile(selected ?? null)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    pickFile(event.target.files?.[0])
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    pickFile(event.dataTransfer.files?.[0])
  }

  const handleSubmit = async () => {
    if (!file || tooLarge) return
    setStage('uploading')
    setError('')
    try {
      const result = await uploadFile(user?.id ?? null, file, {
        password: password || undefined,
        expiresInDays: Number(expiresInDays),
      })
      setShareUrl(result.shareUrl)
      setStage('success')
    } catch (err) {
      setStage('idle')
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    }
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="app-gradient">
      <Header />

      <main className="app-gradient__body upload">
        <h1 className="hero-title upload__hero-title">
          Tu veux partager un fichier&nbsp;?
        </h1>

        <section className="card upload__card" aria-labelledby="upload-title">
          <h2 className="card__title" id="upload-title">
            Ajouter un fichier
          </h2>

          {stage === 'success' ? (
            <>
              <p className="upload__congrats">
                Félicitations, ton fichier sera conservé chez nous pendant{' '}
                {expiryLabel === 'Une journée'
                  ? 'une journée'
                  : expiryLabel.toLowerCase()}
                &nbsp;!
              </p>
              <a className="upload__link" href={shareUrl} target="_blank" rel="noreferrer">
                {shareUrl}
              </a>
              <div className="card__footer upload__actions">
                <Button
                  block
                  onClick={handleCopy}
                  icon={<CopyIcon size={15} />}
                >
                  {copied ? 'Lien copié !' : 'Copier le lien'}
                </Button>
                <Button variant="ghost" block onClick={() => pickFile(undefined)}>
                  Partager un autre fichier
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Sélection / aperçu du fichier */}
              <input
                ref={inputRef}
                type="file"
                className="upload__input"
                onChange={onInputChange}
                aria-hidden
                tabIndex={-1}
              />

              {file ? (
                <div className="upload__file">
                  <span className="upload__file-icon">
                    <FileIcon size={18} />
                  </span>
                  <span className="upload__file-meta">
                    <span className="upload__file-name" title={file.name}>
                      {truncateMiddle(file.name, 30)}
                    </span>
                    <span className="upload__file-size">{formatBytes(file.size)}</span>
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Changer
                  </Button>
                  {tooLarge && (
                    <p className="upload__error" role="alert">
                      La taille des fichiers est limitée à 1 Go.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`upload__dropzone ${dragOver ? 'upload__dropzone--over' : ''}`}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
                  }}
                >
                  <CloudUploadIcon size={22} />
                  <span>Choisir un fichier</span>
                  <small>ou glisse-le ici — max 1 Go</small>
                </div>
              )}

              {error && <Callout tone="error">{error}</Callout>}

              <Input
                id="upload-password"
                label="Mot de passe"
                type="password"
                placeholder="Optionnel"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Select
                id="upload-expiry"
                label="Expiration"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
              >
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <div className="card__footer">
                <Button
                  block
                  icon={<CloudUploadIcon size={15} />}
                  disabled={!file || tooLarge}
                  loading={stage === 'uploading'}
                  onClick={handleSubmit}
                >
                  {stage === 'uploading' ? 'Envoi en cours…' : 'Téléverser'}
                </Button>
                <p className="upload__hint">
                  <LockIcon size={12} /> Ton fichier est protégé de bout en bout.
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="copyright">Copyright DataShare® 2025</footer>
    </div>
  )
}
