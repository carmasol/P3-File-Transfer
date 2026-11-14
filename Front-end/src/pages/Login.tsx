import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Input } from '../components/Form'
import { useAuth } from '../context/useAuth'
import './auth.css'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/mes-fichiers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-gradient">
      <Header />

      <main className="app-gradient__body">
        <form className="card auth__card" onSubmit={handleSubmit}>
          <h1 className="card__title">Connexion</h1>

          <Input
            id="login-email"
            label="Email"
            type="email"
            placeholder="Saisissez votre email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="login-password"
            label="Mot de passe"
            type="password"
            placeholder="Saisissez votre mot de passe"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Callout tone="error">{error}</Callout>}

          <div className="card__footer auth__footer">
            <Link className="card__link" to="/signup">
              Créer un compte
            </Link>
            <Button type="submit" block loading={busy}>
              Connexion
            </Button>
          </div>
        </form>
      </main>

      <footer className="copyright">Copyright DataShare® 2025</footer>
    </div>
  )
}
