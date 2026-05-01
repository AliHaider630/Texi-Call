'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const user = session?.user as any

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(5,5,5,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : 'none',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🚗</div>
              <div>
                <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '20px', fontWeight: '700', lineHeight: 1 }}>BARCELONA</div>
                <div style={{ color: '#888', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>PREMIUM TRANSFERS</div>
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {['Services', 'Fleet', 'Routes', 'About'].map(item => (
              <Link key={item} href={`/#${item.toLowerCase()}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color 0.3s', fontWeight: '500' }}
                onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#c9a84c'}
                onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#aaa'}>
                {item}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {session ? (
              <>
                {user?.role === 'ADMIN' && <Link href="/admin" style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin</Link>}
                {user?.role === 'DRIVER' && <Link href="/driver/dashboard" style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Driver Panel</Link>}
                {user?.role !== 'ADMIN' && user?.role !== 'DRIVER' && <Link href="/user/bookings" style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>My Bookings</Link>}
                <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: 'transparent', border: '1px solid #444', color: '#888', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px', letterSpacing: '1px' }}>Login</Link>
                <Link href="/booking" style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#000', textDecoration: 'none', padding: '10px 24px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>Book Now</Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#c9a84c', fontSize: '24px', cursor: 'pointer' }} className="menu-btn">☰</button>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .menu-btn { display: block !important; }
        }
      `}</style>

      {menuOpen && (
        <div style={{ position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0, background: 'rgba(5,5,5,0.98)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          {['Services', 'Fleet', 'Routes', 'About'].map(item => (
            <Link key={item} href={`/#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: '#e8e8e8', textDecoration: 'none', fontSize: '28px', fontFamily: 'Cormorant Garamond', letterSpacing: '2px' }}>{item}</Link>
          ))}
          <Link href="/booking" onClick={() => setMenuOpen(false)} style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#000', textDecoration: 'none', padding: '16px 48px', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700', marginTop: '20px' }}>BOOK NOW</Link>
        </div>
      )}
    </>
  )
}
