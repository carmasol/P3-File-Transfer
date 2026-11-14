import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Home } from './pages/Home'
import { Upload } from './pages/Upload'
import { Download } from './pages/Download'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { MyFiles } from './pages/MyFiles'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/share/:token" element={<DownloadRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mes-fichiers" element={<MyFiles />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

/** Remonte la page à chaque changement de token de partage. */
function DownloadRoute() {
  const { token = '' } = useParams<{ token: string }>()
  return <Download key={token} />
}
