'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'all' | 'notifications'>('upcoming')

  const user = session?.user as any

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/driver/login')
    if (status === 'authenticated' && user?.role !== 'DRIVER') router.push('/')
    if (status === 'authenticated' && user?.role === 'DRIVER') {
      Promise.all([
        fetch('/api/driver/bookings').then(r => r.json()),
        fetch('/api/driver/notifications').then(r => r.json()).catch(() => ({ notifications: [] })),
      ]).then(([b, n]) => {
        setBookings(b.bookings || [])
        setNotifications(n.notifications || [])
        setLoading(false)
      })
    }
  }, [status, user?.role])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingBookings = bookings.filter(b => {
    const d = new Date(b.pickupDate)
    return d >= today && b.status !== 'CANCELLED' && b.status !== 'COMPLETED'
  })
  const allBookings = bookings

  const totalEarnings = bookings.filter(b => b.status === 'COMPLETED').reduce((s, b) => s + b.price, 0)
  const todayRides = bookings.filter(b => {
    const d = new Date(b.pickupDate)
    d.setHours(0,0,0,0)
    return d.getTime() === today.getTime()
  }).length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '18px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '60px', animation: 'float 2s ease-in-out infinite', marginBottom: '16px' }}>🚗</div>
        <div>Loading Driver Panel...</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', padding: '6px 16px', marginBottom: '16px' }}>
            <span style={{ width: '6px', height: '6px', background: '#4caf50', borderRadius: '50%', animation: 'pulse-gold 2s infinite' }} />
            <span style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>Driver Panel · Active</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300' }}>
            Welcome, <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>{session?.user?.name}</span>
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: "Today's Rides", value: todayRides, icon: '📅', highlight: todayRides > 0 },
            { label: 'Upcoming', value: upcomingBookings.length, icon: '🗓️', highlight: upcomingBookings.length > 0 },
            { label: 'Total Rides', value: bookings.length, icon: '🚗' },
            { label: 'Total Earned', value: `€${Math.round(totalEarnings)}`, icon: '💰', highlight: totalEarnings > 0 },
          ].map(s => (
            <div key={s.label} style={{ background: '#0e0e0e', border: s.highlight ? '1px solid rgba(201,168,76,0.4)' : '1px solid #1e1e1e', padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              {s.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, #f0d080)' }} />}
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: s.highlight ? '#c9a84c' : '#e8e8e8', fontWeight: '700' }}>{s.value}</div>
              <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { id: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
            { id: 'all', label: `All Rides (${allBookings.length})` },
            { id: 'notifications', label: `Notifications` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ background: tab === t.id ? 'rgba(201,168,76,0.15)' : '#0e0e0e', border: tab === t.id ? '1px solid #c9a84c' : '1px solid #1e1e1e', color: tab === t.id ? '#c9a84c' : '#888', padding: '12px 24px', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', transition: 'all 0.3s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Upcoming Bookings */}
        {(tab === 'upcoming' || tab === 'all') && (() => {
          const list = tab === 'upcoming' ? upcomingBookings : allBookings
          return (
            <div style={{ display: 'grid', gap: '16px' }}>
              {list.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', background: '#0e0e0e', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>🗓️</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', color: '#888', marginBottom: '12px' }}>
                    {tab === 'upcoming' ? 'No upcoming rides' : 'No rides yet'}
                  </h3>
                  <p style={{ color: '#555' }}>Rides assigned by admin will appear here</p>
                </div>
              ) : list.map(b => (
                <div key={b.id} style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  {b.status === 'CONFIRMED' && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', bottom: 0, background: '#c9a84c' }} />}
                  {b.status === 'IN_PROGRESS' && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', bottom: 0, background: '#4caf50' }} />}
                  {b.status === 'COMPLETED' && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', bottom: 0, background: '#2196f3' }} />}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ color: '#555', fontSize: '12px' }}>#{b.id.slice(-6).toUpperCase()}</span>
                        <span className={`status-badge status-${b.status}`}>{b.status}</span>
                      </div>

                      {/* Passenger Info */}
                      <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '24px' }}>👤</div>
                        <div>
                          <div style={{ color: '#e8e8e8', fontWeight: '600' }}>{b.user?.name}</div>
                          <div style={{ color: '#888', fontSize: '13px' }}>{b.user?.phone || b.user?.email}</div>
                        </div>
                      </div>

                      {/* Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Pickup</div>
                          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{b.pickupLocation}</div>
                        </div>
                        <div style={{ color: '#c9a84c', fontSize: '20px' }}>→</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Drop-off</div>
                          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>{b.dropoffLocation}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#888', fontSize: '13px' }}>
                          📅 {new Date(b.pickupDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <span style={{ color: '#888', fontSize: '13px' }}>
                          🕐 {new Date(b.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{ color: '#888', fontSize: '13px' }}>👥 {b.passengers} pax</span>
                        <span style={{ color: '#888', fontSize: '13px' }}>🚗 {b.fleetType?.replace(/_/g, ' ')}</span>
                        {b.flightNumber && <span style={{ color: '#c9a84c', fontSize: '13px' }}>✈️ {b.flightNumber}</span>}
                      </div>

                      {b.specialNotes && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', fontSize: '13px', color: '#888' }}>
                          📝 {b.specialNotes}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: '#c9a84c', fontWeight: '700' }}>€{b.price}</div>
                      <div style={{ color: '#555', fontSize: '12px' }}>Fixed price</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Notifications */}
        {tab === 'notifications' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', background: '#0e0e0e', border: '1px solid #1e1e1e', color: '#555' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : notifications.map((n: any) => (
              <div key={n.id} style={{ background: n.read ? '#0e0e0e' : 'rgba(201,168,76,0.05)', border: n.read ? '1px solid #1e1e1e' : '1px solid rgba(201,168,76,0.3)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {!n.read && <div style={{ width: '8px', height: '8px', background: '#c9a84c', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />}
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
