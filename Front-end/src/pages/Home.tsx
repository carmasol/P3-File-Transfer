import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { CloudUploadIcon } from '../components/icons'
import { useAuth } from '../context/useAuth'
import './home.css'

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const go = () => navigate(user ? '/upload' : '/upload')

  return (
    <div className="app-gradient">
      <Header />
      <main className="app-gradient__body home">
        <h1 className="hero-title home__title">Tu veux partager un fichier&nbsp;?</h1>
        <button
          type="button"
          className="home__cloud"
          aria-label="Partager un fichier"
          onClick={go}
        >
          <span className="home__cloud-halo" aria-hidden />
          <CloudUploadIcon size={26} />
        </button>
      </main>
      <footer className="copyright">Copyright DataShare® 2025</footer>
    </div>
  )
}
