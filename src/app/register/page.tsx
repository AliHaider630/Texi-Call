'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Account created! Please login.')
        router.push('/login')
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch(e) { toast.error('Something went wrong') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px' }}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Create Account</div>
          <p style={{ color: '#666' }}>Join Barcelona Premium Transfers</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '40px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label>Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="John Smith" required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Email Address *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+34 600 000 000" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Password *</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="At least 6 characters" required />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label>Confirm Password *</label>
            <input type="password" value={form.confirm} onChange={e => setForm(p => ({...p, confirm: e.target.value}))} placeholder="Repeat password" required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '14px' }}>
            Already registered? <Link href="/login" style={{ color: '#c9a84c' }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '12px', color: '#444', fontSize: '13px' }}>
            Want to drive? <Link href="/driver/register" style={{ color: '#888' }}>Apply as driver →</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
