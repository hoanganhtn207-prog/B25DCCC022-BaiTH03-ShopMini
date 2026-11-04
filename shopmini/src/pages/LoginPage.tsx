import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const ok = await login(username, password)
    setSubmitting(false)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('Tên đăng nhập trống hoặc mật khẩu không đúng.')
    }
  }

  return (
    <section className="form-card">
      <h1>Đăng nhập</h1>
      {from !== '/' && <p className="muted">Bạn cần đăng nhập để vào trang này.</p>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Tên đăng nhập
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--lg" disabled={submitting}>
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <p className="muted">Tài khoản thử nghiệm: tên bất kỳ, mật khẩu 123456.</p>
      </form>
    </section>
  )
}
