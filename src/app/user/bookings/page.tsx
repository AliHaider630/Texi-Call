'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function UserBookings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bookings' | 'notifications'>('bookings')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json())
      ]).then(([b, n]) => {
        setBookings(b.bookings || [])
        setNotifications(n.notifications || [])
        setLoading(false)
      })
    }
  }, [status])

  const markRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({...n, read: true})))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '18px' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>My Account</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300' }}>
            Welcome, <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>{session?.user?.name}</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'bookings', label: `My Bookings (${bookings.length})` },
            { id: 'notifications', label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` }
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id as any); if (t.id === 'notifications') markRead(); }}
              style={{ background: tab === t.id ? 'rgba(201,168,76,0.15)' : '#0e0e0e', border: tab === t.id ? '1px solid #c9a84c' : '1px solid #1e1e1e', color: tab === t.id ? '#c9a84c' : '#888', padding: '12px 24px', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600', transition: 'all 0.3s' }}>
              {t.label}
            </button>
          ))}
          <Link href="/booking" className="btn-gold" style={{ textDecoration: 'none', marginLeft: 'auto' }}>+ New Booking</Link>
        </div>

        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', background: '#0e0e0e', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚗</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', marginBottom: '12px', color: '#888' }}>No bookings yet</h3>
                <p style={{ color: '#555', marginBottom: '32px' }}>Book your first premium transfer</p>
                <Link href="/booking" className="btn-gold" style={{ textDecoration: 'none' }}>Book Now</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '24px', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <span style={{ color: '#555', fontSize: '12px' }}>#{b.id.slice(-8).toUpperCase()}</span>
                          <span className={`status-badge status-${b.status}`}>{b.status}</span>
                          <span style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{b.bookingType}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div>
                            <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>From</div>
                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{b.pickupLocation}</div>
                          </div>
                          <div style={{ color: '#c9a84c', fontSize: '18px' }}>→</div>
                          <div>
                            <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>To</div>
                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{b.dropoffLocation}</div>
                          </div>
                        </div>
                        <div style={{ color: '#666', fontSize: '13px' }}>
                          📅 {new Date(b.pickupDate).toLocaleDateString()} at {new Date(b.pickupDate).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · 
                          👤 {b.passengers} pax · 
                          🚗 {b.fleetType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: '#c9a84c', fontWeight: '700' }}>€{b.price}</div>
                        <div style={{ color: '#555', fontSize: '12px' }}>Fixed price</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'notifications' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', background: '#0e0e0e', border: '1px solid #1e1e1e', color: '#555' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} style={{ background: n.read ? '#0e0e0e' : 'rgba(201,168,76,0.05)', border: n.read ? '1px solid #1e1e1e' : '1px solid rgba(201,168,76,0.3)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {!n.read && <div style={{ width: '8px', height: '8px', background: '#c9a84c', borderRadius: '50%', marginTop: '6px', flexShrink: 0, animation: 'pulse-gold 2s infinite' }} />}
                <div>
                  <div style={{ color: '#e8e8e8', fontWeight: '600', marginBottom: '4px' }}>{n.title}</div>
                  <div style={{ color: '#888', fontSize: '14px' }}>{n.message}</div>
                  <div style={{ color: '#444', fontSize: '12px', marginTop: '8px' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
