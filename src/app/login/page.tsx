'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('user-login', { email, password, redirect: false })
    if (res?.ok) {
      toast.success('Welcome back!')
      router.push(redirect)
    } else {
      toast.error('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px' }}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</div>
          <p style={{ color: '#666' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
          <div style={{ marginBottom: '20px' }}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '14px' }}>
            No account? <Link href="/register" style={{ color: '#c9a84c' }}>Create one free</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '12px', color: '#444', fontSize: '13px' }}>
            Driver? <Link href="/driver/login" style={{ color: '#888' }}>Driver login →</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
