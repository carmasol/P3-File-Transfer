import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Input } from '../components/Form'
import { useAuth } from '../context/useAuth'
import './auth.css'

export function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await signUp(email, password)
      navigate('/mes-fichiers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création du compte impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-gradient">
      <Header />

      <main className="app-gradient__body">
        <form className="card auth__card" onSubmit={handleSubmit}>
          <h1 className="card__title">Créer un compte</h1>

          <Input
            id="signup-email"
            label="Email"
            type="email"
            placeholder="Saisissez votre email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="signup-password"
            label="Mot de passe"
            type="password"
            placeholder="Saisissez votre mot de passe"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            id="signup-confirm"
            label="Vérification du mot de passe"
            type="password"
            placeholder="Saisissez à nouveau"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <Callout tone="error">{error}</Callout>}

          <div className="card__footer auth__footer">
            <Link className="card__link" to="/login">
              J'ai déjà un compte
            </Link>
            <Button type="submit" block loading={busy}>
              Créer mon compte
            </Button>
          </div>
        </form>
      </main>

      <footer className="copyright">Copyright DataShare® 2025</footer>
    </div>
  )
}
