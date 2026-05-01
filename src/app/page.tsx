'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const FLEET = [
  { id: 'economy_sedan', name: 'Economy Sedan', desc: 'Comfortable & affordable', passengers: 4, luggage: 2, features: ['A/C', 'WiFi', 'Water'], price: 'From €35', emoji: '🚗' },
  { id: 'luxury_sedan', name: 'Luxury Sedan', desc: 'Premium executive car', passengers: 4, luggage: 3, features: ['Leather Seats', 'WiFi', 'Champagne'], price: 'From €65', emoji: '🏎️' },
  { id: 'economy_van', name: 'Economy Van', desc: 'Perfect for groups', passengers: 8, luggage: 6, features: ['Extra Space', 'A/C', 'WiFi'], price: 'From €55', emoji: '🚐' },
  { id: 'luxury_van', name: 'Luxury Van', desc: 'Premium group travel', passengers: 8, luggage: 8, features: ['Leather', 'Entertainment', 'Minibar'], price: 'From €95', emoji: '✨' },
  { id: 'minibus', name: 'Minibus', desc: 'Large group solution', passengers: 16, luggage: 16, features: ['Full Luggage', 'A/C', 'USB Ports'], price: 'From €120', emoji: '🚌' },
]

const ROUTES = [
  { from: 'Barcelona Airport', to: 'Barcelona City', distance: '18km', time: '25 min', price: '€35', popular: true },
  { from: 'Barcelona', to: 'Girona', distance: '101km', time: '1h 5min', price: '€120', popular: true },
  { from: 'Barcelona', to: 'Valencia', distance: '355km', time: '3h 30min', price: '€350', popular: false },
  { from: 'Barcelona', to: 'Andorra', distance: '210km', time: '2h 30min', price: '€240', popular: true },
  { from: 'Barcelona', to: 'Sitges', distance: '42km', time: '40 min', price: '€65', popular: false },
  { from: 'Barcelona', to: 'Tarragona', distance: '102km', time: '1h 10min', price: '€130', popular: false },
  { from: 'Barcelona', to: 'Costa Brava', distance: '125km', time: '1h 30min', price: '€155', popular: true },
]

export default function Home() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.06) 0%, transparent 50%)' }} />
        
        {/* Animated grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        {/* Moving light */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', padding: '6px 16px', marginBottom: '32px', animation: 'fadeInUp 0.6s ease forwards' }}>
              <span style={{ width: '6px', height: '6px', background: '#c9a84c', borderRadius: '50%', animation: 'pulse-gold 2s infinite' }} />
              <span style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '600' }}>Available 24/7 — Barcelona & Beyond</span>
            </div>
            
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: '300', lineHeight: '1.05', marginBottom: '24px', animation: 'fadeInUp 0.8s 0.1s ease both' }}>
              Barcelona<br />
              <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Premium</span><br />
              Transfers
            </h1>
            
            <p style={{ color: '#888', fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: '1.7', marginBottom: '40px', maxWidth: '520px', animation: 'fadeInUp 0.8s 0.2s ease both' }}>
              Professional airport pickups, city transfers and intercity routes across Catalonia & Spain. Travel in style with our premium fleet and experienced local drivers.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', animation: 'fadeInUp 0.8s 0.3s ease both' }}>
              <Link href="/booking" className="btn-gold" style={{ textDecoration: 'none', fontSize: '13px', letterSpacing: '2px' }}>Book Your Transfer</Link>
              <Link href="/#routes" className="btn-outline" style={{ textDecoration: 'none', fontSize: '13px', letterSpacing: '2px' }}>View Routes</Link>
            </div>

            <div style={{ display: 'flex', gap: '40px', marginTop: '60px', animation: 'fadeInUp 0.8s 0.4s ease both', flexWrap: 'wrap' }}>
              {[['10,000+', 'Happy Clients'], ['24/7', 'Available'], ['5★', 'Rated Service'], ['€0', 'Hidden Fees']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: '700' }}>{num}</div>
                  <div style={{ color: '#666', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'float 2s ease-in-out infinite' }}>
          <span style={{ color: '#444', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #c9a84c, transparent)' }} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 0', background: '#0a0a0a' }}>
        <div className="container">
          <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>What We Offer</p>
          <h2 className="section-title">Our <span>Services</span></h2>
          <div className="divider" />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {[
              { icon: '✈️', title: 'Airport Transfer', desc: 'Direct pickups from Barcelona El Prat Airport. Flight tracking, meet & greet, free waiting time. Fixed prices, no surprises.', link: '/booking?type=airport' },
              { icon: '🏙️', title: 'City Transfer', desc: 'Efficient transfers within Barcelona. Hotels, stations, cruise terminals, events. Available around the clock.', link: '/booking?type=city' },
              { icon: '🗺️', title: 'Intercity Transfer', desc: 'Long distance routes across Catalonia and Spain. Girona, Valencia, Andorra, Costa Brava and more.', link: '/booking?type=intercity' },
              { icon: '⏰', title: 'Hourly Booking', desc: 'Book a driver by the hour. Perfect for business meetings, sightseeing or events. Flexible and convenient.', link: '/booking?type=hourly' },
            ].map(s => (
              <Link href={s.link} key={s.title} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
                  <div style={{ fontSize: '40px', marginBottom: '20px' }}>{s.icon}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', color: '#e8e8e8', marginBottom: '12px' }}>{s.title}</h3>
                  <p style={{ color: '#666', lineHeight: '1.7', fontSize: '15px' }}>{s.desc}</p>
                  <div style={{ marginTop: '20px', color: '#c9a84c', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>Book Now <span>→</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="fleet" style={{ padding: '100px 0', background: '#050505' }}>
        <div className="container">
          <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Vehicles</p>
          <h2 className="section-title">Premium <span>Fleet</span></h2>
          <div className="divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {FLEET.map((car, i) => (
              <Link href={`/booking?fleet=${car.id}`} key={car.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative', animationDelay: `${i * 0.1}s` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 30px 60px rgba(0,0,0,0.6)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  
                  {/* Car visual */}
                  <div style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', padding: '40px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
                    <div style={{ fontSize: '70px', filter: 'grayscale(30%) brightness(0.8)', animation: i % 2 === 0 ? 'float 4s ease-in-out infinite' : 'float 5s ease-in-out infinite' }}>{car.emoji}</div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '20px', background: 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)', borderRadius: '50%' }} />
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', marginBottom: '4px' }}>{car.name}</h3>
                    <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>{car.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>👤 {car.passengers} pax</span>
                      <span style={{ color: '#888', fontSize: '13px' }}>🧳 {car.luggage} bags</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {car.features.map(f => <span key={f} style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '3px 8px', fontSize: '11px', borderRadius: '2px' }}>{f}</span>)}
                    </div>
                    <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '20px', fontWeight: '700' }}>{car.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ROUTES */}
      <section id="routes" style={{ padding: '100px 0', background: '#0a0a0a' }}>
        <div className="container">
          <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>Popular Destinations</p>
          <h2 className="section-title">Famous <span>Routes</span></h2>
          <div className="divider" />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '40px' }}>
            {ROUTES.map((route, i) => (
              <Link href={`/booking?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`} key={i} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '24px', transition: 'all 0.3s ease', position: 'relative', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLElement).style.background = '#141414'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.background = '#111'; }}>
                  {route.popular && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '3px 10px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(201,168,76,0.3)' }}>Popular</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#888', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>From</div>
                      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', fontWeight: '600' }}>{route.from}</div>
                    </div>
                    <div style={{ color: '#c9a84c', fontSize: '20px' }}>→</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ color: '#888', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>To</div>
                      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', fontWeight: '600' }}>{route.to}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e1e1e', paddingTop: '16px' }}>
                    <span style={{ color: '#666', fontSize: '13px' }}>📍 {route.distance}</span>
                    <span style={{ color: '#666', fontSize: '13px' }}>⏱ {route.time}</span>
                    <span style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '20px', fontWeight: '700' }}>{route.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="about" style={{ padding: '100px 0', background: '#050505' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>Why Choose Us</p>
              <h2 className="section-title">The <span>Barcelona</span> Standard</h2>
              <div className="divider" />
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '32px' }}>
                We are local Barcelona professionals who know every street, every shortcut, and every destination. When you book with us, you're not just getting a ride — you're getting a guaranteed premium experience.
              </p>
              {[
                ['✓', 'Flight tracking & free wait time at airports'],
                ['✓', 'Fixed prices — pay what you see, always'],
                ['✓', 'Licensed, insured professional drivers'],
                ['✓', 'Free cancellation up to 24 hours before'],
                ['✓', 'Child seats available on request'],
                ['✓', 'Meet & greet service with name board'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#c9a84c', fontWeight: '700', marginTop: '2px' }}>{icon}</span>
                  <span style={{ color: '#888', fontSize: '15px' }}>{text}</span>
                </div>
              ))}
              <Link href="/booking" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '32px' }}>Start Booking</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[['⭐', '4.9/5', 'Average Rating'], ['🚗', '50+', 'Vehicles Available'], ['📍', '200+', 'Routes Covered'], ['👤', '10k+', 'Happy Clients']].map(([icon, num, label]) => (
                <div key={label} style={{ background: '#111', border: '1px solid #1e1e1e', padding: '30px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: '#c9a84c', fontWeight: '700' }}>{num}</div>
                  <div style={{ color: '#666', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0e0e0e 0%, #161616 100%)', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '300', marginBottom: '16px' }}>
            Ready to <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Travel?</span>
          </h2>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>Book your transfer in 2 minutes. Instant price. Instant confirmation.</p>
          <Link href="/booking" style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#000', textDecoration: 'none', padding: '18px 56px', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700', clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)', display: 'inline-block' }}>Book Your Transfer Now</Link>
          <p style={{ color: '#444', fontSize: '13px', marginTop: '24px' }}>No registration required for price quotes • Pay online or in cash</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030303', padding: '60px 0 30px', borderTop: '1px solid #1a1a1a' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>BARCELONA TRANSFERS</div>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>Premium transfer services across Barcelona and Catalonia. Available 24/7.</p>
              <div style={{ color: '#c9a84c', fontSize: '14px' }}>📞 +34 XXX XXX XXX</div>
              <div style={{ color: '#c9a84c', fontSize: '14px', marginTop: '4px' }}>✉️ info@barcelonatransfers.com</div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Services</div>
              {['Airport Transfer', 'City Transfer', 'Intercity Transfer', 'Hourly Booking', 'Group Transfer'].map(s => (
                <div key={s}><Link href="/booking" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#c9a84c'}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#555'}>{s}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Routes</div>
              {['Barcelona Airport', 'Girona', 'Valencia', 'Andorra', 'Sitges', 'Tarragona', 'Costa Brava'].map(r => (
                <div key={r}><Link href={`/booking?to=${r}`} style={{ color: '#555', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#c9a84c'}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#555'}>→ {r}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Account</div>
              {[['Login', '/login'], ['Register', '/register'], ['My Bookings', '/user/bookings'], ['Driver Login', '/driver/login'], ['Driver Apply', '/driver/register']].map(([label, href]) => (
                <div key={label}><Link href={href} style={{ color: '#555', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#c9a84c'}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#555'}>{label}</Link></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#444', fontSize: '13px' }}>© {new Date().getFullYear()} Barcelona Premium Transfers. All rights reserved.</p>
            <p style={{ color: '#333', fontSize: '12px' }}>Barcelona • Girona • Valencia • Andorra • Costa Brava</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
