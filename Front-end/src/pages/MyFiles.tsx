import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Tabs } from '../components/Tabs'
import type { FileFilter } from '../components/Tabs'
import {
  CloudUploadIcon,
  CloseIcon,
  DownloadIcon,
  FileIcon,
  MenuIcon,
  TrashIcon,
  UserIcon,
} from '../components/icons'
import { deleteFile, listFiles } from '../api/files'
import type { ShareFile } from '../api/types'
import { useAuth } from '../context/useAuth'
import { formatBytes, formatExpiry, truncateMiddle } from '../lib/format'
import './myfiles.css'

export function MyFiles() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  const [files, setFiles] = useState<ShareFile[]>([])
  const [filter, setFilter] = useState<FileFilter>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, navigate])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    listFiles(user.id).then((data) => {
      if (!cancelled) setFiles(data)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading || !user) return null

  const visible = files.filter((file) => {
    if (filter === 'active') return file.status === 'active'
    if (filter === 'expired') return file.status === 'expired'
    return true
  })

  const handleDelete = async (file: ShareFile) => {
    await deleteFile(user.id, file.id)
    setFiles((current) => current.filter((f) => f.id !== file.id))
  }

  const handleDownload = (file: ShareFile) => {
    navigate(`/share/${file.shareToken}`)
  }

  return (
    <div className="files">
      {/* ------ Barre latérale (desktop) / tiroir (mobile) ------ */}
      <aside className={`files__sidebar ${drawerOpen ? 'files__sidebar--open' : ''}`}>
        <button
          type="button"
          className="files__sidebar-close"
          aria-label="Fermer le menu"
          onClick={() => setDrawerOpen(false)}
        >
          <CloseIcon size={18} />
        </button>

        <Link to="/" className="files__logo">
          DataShare
        </Link>

        <nav className="files__nav" aria-label="Navigation de l'espace">
          <span className="files__nav-item files__nav-item--active">Mes fichiers</span>
        </nav>

        <div className="files__sidebar-footer">
          <span className="files__user" title={user.email}>
            <UserIcon size={16} />
            <span>
              <strong>{user.name ?? user.email}</strong>
              <small>{user.email}</small>
            </span>
          </span>
          <button type="button" className="files__logout" onClick={signOut}>
            Se déconnecter
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div
          className="files__overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* ------ Zone principale ------ */}
      <div className="files__main">
        <header className="files__topbar">
          <div className="files__topbar-mobile">
            <button
              type="button"
              className="files__burger"
              aria-label="Ouvrir le menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon size={20} />
            </button>
            <span className="files__user-chip">
              <UserIcon size={16} />
              {user.name ?? user.email}
            </span>
          </div>
          <div className="files__topbar-actions">
            <Button variant="dark" size="sm" onClick={() => navigate('/upload')}>
              Ajouter des fichiers
            </Button>
          </div>
        </header>

        <main className="files__content">
          <h1 className="files__title">Mes fichiers</h1>

          <Tabs value={filter} onChange={setFilter} />

          {visible.length === 0 ? (
            <div className="files__empty">
              <CloudUploadIcon size={28} />
              <p>Aucun fichier {filter === 'all' ? '' : 'dans cette catégorie'} pour le moment.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/upload')}>
                Ajouter un fichier
              </Button>
            </div>
          ) : (
            <ul className="files__list">
              {visible.map((file) => (
                <li key={file.id} className={`filerow ${file.status === 'expired' ? 'filerow--expired' : ''}`}>
                  <span className="filerow__icon">
                    <FileIcon size={18} />
                  </span>
                  <span className="filerow__meta">
                    <span className="filerow__name" title={file.name}>
                      {truncateMiddle(file.name, 40)}
                    </span>
                    <span className="filerow__sub">
                      {formatBytes(file.sizeBytes)} · {formatExpiry(file.expiresAt)}
                    </span>
                  </span>

                  {file.status === 'expired' ? (
                    <span className="filerow__expired-note">
                      Jeter le fichier, il n'est plus stocké chez nous.
                    </span>
                  ) : (
                    <span className="filerow__actions">
                      <button
                        type="button"
                        className="filerow__action"
                        aria-label="Télécharger"
                        onClick={() => handleDownload(file)}
                      >
                        <DownloadIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="filerow__action filerow__action--danger"
                        aria-label="Supprimer"
                        onClick={() => handleDelete(file)}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="files__copyright">Copyright DataShare® 2025</footer>
      </div>
    </div>
  )
}
