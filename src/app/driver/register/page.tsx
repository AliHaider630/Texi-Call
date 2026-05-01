'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function DriverRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', licenseNum: '', carModel: '', carPlate: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, licenseNum: form.licenseNum, carModel: form.carModel, carPlate: form.carPlate })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch { toast.error('Something went wrong') }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <Navbar />
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🎉</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '36px', color: '#c9a84c', marginBottom: '16px' }}>Application Submitted!</h2>
        <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
          Thank you for applying to drive with Barcelona Premium Transfers. Our admin team will review your application and send you an email within 24 hours.
        </p>
        <div style={{ background: '#0e0e0e', border: '1px solid rgba(201,168,76,0.3)', padding: '24px', marginBottom: '32px' }}>
          <p style={{ color: '#c9a84c', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>What happens next?</p>
          <p style={{ color: '#666', fontSize: '13px' }}>1. Admin reviews your documents<br />2. You receive approval email<br />3. Login and start accepting rides</p>
        </div>
        <Link href="/" style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '14px' }}>← Back to home</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '100px 24px 60px' }}>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Become a Driver</div>
          <p style={{ color: '#666' }}>Apply to join our professional team</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, #f0d080, transparent)' }} />

          <div style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '700' }}>Personal Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required />
            </div>
            <div>
              <label>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+34 600 000 000" required />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
          </div>

          <div style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '700' }}>Vehicle & License</div>
          <div style={{ marginBottom: '16px' }}>
            <label>Driver's License Number *</label>
            <input value={form.licenseNum} onChange={e => set('licenseNum', e.target.value)} placeholder="License number" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label>Car Model</label>
              <input value={form.carModel} onChange={e => set('carModel', e.target.value)} placeholder="e.g. Mercedes E-Class" />
            </div>
            <div>
              <label>Car Plate</label>
              <input value={form.carPlate} onChange={e => set('carPlate', e.target.value)} placeholder="e.g. 1234 ABC" />
            </div>
          </div>

          <div style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '700' }}>Security</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label>Password *</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div>
              <label>Confirm Password *</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" required />
            </div>
          </div>

          <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', padding: '16px', marginBottom: '24px', fontSize: '13px', color: '#666' }}>
            ⚠️ Your application will be reviewed by our admin team before activation. You will receive an email confirmation.
          </div>

          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Submitting Application...' : 'Submit Driver Application'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
            Already approved? <Link href="/driver/login" style={{ color: '#c9a84c' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
