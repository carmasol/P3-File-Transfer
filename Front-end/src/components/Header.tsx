import { Link, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { MenuIcon, UserIcon } from './icons'
import { useAuth } from '../context/useAuth'
import './header.css'

type HeaderProps = {
  /** Menu hamburger affiché sur mobile (espace privé) */
  onMenu?: () => void
  /** Masque le bouton d'action (utilisé sur les sous-vues mobiles) */
  hideAction?: boolean
}

export function Header({ onMenu, hideAction = false }: HeaderProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__inner">
        {user && onMenu && (
          <button
            type="button"
            className="header__burger"
            aria-label="Ouvrir le menu"
            onClick={onMenu}
          >
            <MenuIcon size={20} />
          </button>
        )}

        <Link to="/" className="header__logo">
          DataShare
        </Link>

        {!hideAction && (
          <div className="header__actions">
            {user ? (
              <>
                <span className="header__user" title={user.email}>
                  <UserIcon size={16} />
                  {user.name ?? user.email.split('@')[0]}
                </span>
                <Button variant="dark" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button variant="dark" size="sm" onClick={() => navigate('/login')}>
                Se connecter
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
