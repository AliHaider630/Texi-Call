'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { calculatePrice, estimateDistance, FLEET_TYPES, FAMOUS_ROUTES } from '@/lib/pricing'

const EXTRAS = [
  { id: 'child_seat', label: 'Child Seat', price: 10 },
  { id: 'baby_seat', label: 'Baby Seat', price: 10 },
  { id: 'meet_greet', label: 'Meet & Greet Sign', price: 15 },
  { id: 'wheelchair', label: 'Wheelchair Access', price: 0 },
  { id: 'extra_stops', label: 'Extra Stop (1)', price: 20 },
  { id: 'pet', label: 'Pet Transport', price: 15 },
]

function BookingForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingType, setBookingType] = useState(searchParams.get('type') || 'airport')
  const [pickup, setPickup] = useState(searchParams.get('from') || '')
  const [dropoff, setDropoff] = useState(searchParams.get('to') || '')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [passengers, setPassengers] = useState(1)
  const [fleet, setFleet] = useState(searchParams.get('fleet') || 'economy_sedan')
  const [hours, setHours] = useState(3)
  const [extras, setExtras] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [price, setPrice] = useState(0)
  const [distance, setDistance] = useState(18)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Calculate price when inputs change
  useEffect(() => {
    const selectedRoute = FAMOUS_ROUTES.find(r => 
      (r.from.toLowerCase().includes(pickup.toLowerCase()) || pickup.toLowerCase().includes('airport')) &&
      r.to.toLowerCase().includes(dropoff.toLowerCase())
    )
    
    let dist = selectedRoute?.distance || distance
    if (bookingType === 'city') dist = 15
    if (bookingType === 'airport') dist = 18
    
    setDistance(dist)
    
    const basePrice = calculatePrice(dist, fleet, bookingType === 'hourly' ? hours : undefined)
    const extrasPrice = extras.reduce((sum, e) => sum + (EXTRAS.find(ex => ex.id === e)?.price || 0), 0)
    setPrice(Math.round((basePrice + extrasPrice) * 100) / 100)
  }, [fleet, distance, extras, bookingType, hours, pickup, dropoff])

  const handleBooking = async () => {
    if (!session) { router.push('/login?redirect=/booking'); return }
    if (!pickup || !dropoff || !pickupDate) { toast.error('Please fill all required fields'); return }
    
    setLoading(true)
    try {
      const datetime = new Date(`${pickupDate}T${pickupTime}`)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType: bookingType.toUpperCase(),
          pickupLocation: pickup, dropoffLocation: dropoff,
          pickupDate: datetime.toISOString(),
          passengers, fleetType: fleet,
          price, distance,
          hours: bookingType === 'hourly' ? hours : undefined,
          extras, specialNotes: notes, flightNumber
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Booking confirmed! Check your email.')
        router.push('/user/bookings')
      } else {
        toast.error(data.error || 'Booking failed')
      }
    } catch(e) {
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  const fleetInfo = FLEET_TYPES[fleet as keyof typeof FLEET_TYPES]

  return (
    <div style={{ minHeight: '100vh', background: '#050505', paddingTop: '80px' }}>
      <Navbar />

      {/* Hero bar */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e0e, #161616)', borderBottom: '1px solid #1e1e1e', padding: '40px 0' }}>
        <div className="container">
          <p style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Instant Booking</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '300' }}>
            Book Your <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Transfer</span>
          </h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          
          {/* BOOKING FORM */}
          <div>
            {/* Step 1 - Transfer Type */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '24px', color: '#c9a84c' }}>1. Select Transfer Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { id: 'airport', label: 'Airport Transfer', icon: '✈️', desc: 'To/From BCN Airport' },
                  { id: 'city', label: 'City Transfer', icon: '🏙️', desc: 'Within Barcelona' },
                  { id: 'intercity', label: 'Intercity', icon: '🗺️', desc: 'Between cities' },
                  { id: 'hourly', label: 'By the Hour', icon: '⏰', desc: 'Flexible booking' },
                ].map(t => (
                  <button key={t.id} onClick={() => setBookingType(t.id)} style={{
                    background: bookingType === t.id ? 'rgba(201,168,76,0.15)' : '#111',
                    border: bookingType === t.id ? '1px solid #c9a84c' : '1px solid #1e1e1e',
                    padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{t.icon}</div>
                    <div style={{ color: bookingType === t.id ? '#c9a84c' : '#e8e8e8', fontWeight: '600', fontSize: '14px' }}>{t.label}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 - Locations */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '24px', color: '#c9a84c' }}>2. Journey Details</h3>
              
              {/* Famous routes quick select */}
              <div style={{ marginBottom: '24px' }}>
                <label>Quick Select Route</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {FAMOUS_ROUTES.map(r => (
                    <button key={r.to} onClick={() => { setPickup(r.from); setDropoff(r.to); setDistance(r.distance); }}
                      style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#888', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.3s', borderRadius: '2px' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#c9a84c'; (e.target as HTMLElement).style.color = '#c9a84c'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#2a2a2a'; (e.target as HTMLElement).style.color = '#888'; }}>
                      → {r.to}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label>Pickup Location *</label>
                  <input value={pickup} onChange={e => setPickup(e.target.value)}
                    placeholder={bookingType === 'airport' ? 'Barcelona Airport (BCN)' : 'Enter pickup address'} />
                </div>
                <div>
                  <label>Drop-off Location *</label>
                  <input value={dropoff} onChange={e => setDropoff(e.target.value)}
                    placeholder={bookingType === 'airport' ? 'Your hotel or address' : 'Enter destination'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label>Date *</label>
                  <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label>Time *</label>
                  <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
                </div>
                <div>
                  <label>Passengers *</label>
                  <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {bookingType === 'hourly' && (
                <div style={{ marginBottom: '16px' }}>
                  <label>Number of Hours</label>
                  <select value={hours} onChange={e => setHours(Number(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,10,12].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              )}

              {bookingType === 'airport' && (
                <div>
                  <label>Flight Number (optional)</label>
                  <input value={flightNumber} onChange={e => setFlightNumber(e.target.value)} placeholder="e.g. VY1234" />
                </div>
              )}
            </div>

            {/* Step 3 - Fleet Selection */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '24px', color: '#c9a84c' }}>3. Choose Your Vehicle</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {Object.entries(FLEET_TYPES).filter(([_, f]) => f.passengers >= passengers).map(([id, f]) => {
                  const p = calculatePrice(distance, id, bookingType === 'hourly' ? hours : undefined)
                  return (
                    <button key={id} onClick={() => setFleet(id)} style={{
                      background: fleet === id ? 'rgba(201,168,76,0.1)' : '#111',
                      border: fleet === id ? '1px solid #c9a84c' : '1px solid #1e1e1e',
                      padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '28px' }}>{f.emoji}</span>
                        <div>
                          <div style={{ color: fleet === id ? '#c9a84c' : '#e8e8e8', fontWeight: '600' }}>{f.name}</div>
                          <div style={{ color: '#666', fontSize: '13px' }}>Up to {f.passengers} passengers • {f.luggage} bags</div>
                        </div>
                      </div>
                      <div style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond', fontSize: '22px', fontWeight: '700' }}>€{p}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4 - Extras */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '24px', color: '#c9a84c' }}>4. Extras & Notes</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {EXTRAS.map(ex => (
                  <label key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: extras.includes(ex.id) ? 'rgba(201,168,76,0.08)' : '#111', border: extras.includes(ex.id) ? '1px solid rgba(201,168,76,0.4)' : '1px solid #1e1e1e', padding: '12px', textTransform: 'none', fontSize: '14px', letterSpacing: 0, fontWeight: '400', color: '#e8e8e8', transition: 'all 0.3s' }}>
                    <input type="checkbox" checked={extras.includes(ex.id)}
                      onChange={e => setExtras(prev => e.target.checked ? [...prev, ex.id] : prev.filter(x => x !== ex.id))}
                      style={{ width: 'auto', accentColor: '#c9a84c' }} />
                    {ex.label} {ex.price > 0 && <span style={{ color: '#c9a84c', marginLeft: 'auto' }}>+€{ex.price}</span>}
                  </label>
                ))}
              </div>
              <div>
                <label>Special Instructions (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requirements, dietary needs, accessibility requirements..." rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>

            {/* Map Preview */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '16px', color: '#c9a84c' }}>Route Preview</h3>
              <div style={{ height: '300px', background: '#111', border: '1px solid #1e1e1e', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=1.8,41.2,2.4,41.6&layer=mapnik&marker=41.3851,2.1734`}
                  style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                  title="Route Map"
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(5,5,5,0.9)', border: '1px solid #c9a84c', padding: '8px 12px', fontSize: '12px', color: '#c9a84c' }}>
                  📍 {pickup || 'Pickup'} → {dropoff || 'Destination'}
                </div>
              </div>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: '#0e0e0e', border: '1px solid #c9a84c', padding: '32px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', marginBottom: '24px', color: '#c9a84c' }}>Price Summary</h3>
              
              {pickup && dropoff ? (
                <>
                  <div style={{ borderBottom: '1px solid #1e1e1e', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '14px' }}>Route</span>
                      <span style={{ fontSize: '13px', textAlign: 'right', maxWidth: '150px' }}>{pickup.slice(0,20)} → {dropoff.slice(0,20)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '14px' }}>Vehicle</span>
                      <span style={{ fontSize: '13px' }}>{fleetInfo?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '14px' }}>Distance</span>
                      <span style={{ fontSize: '13px' }}>{distance}km</span>
                    </div>
                    {extras.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888', fontSize: '14px' }}>Extras</span>
                        <span style={{ fontSize: '13px' }}>+€{extras.reduce((s, e) => s + (EXTRAS.find(ex => ex.id === e)?.price || 0), 0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '16px', color: '#888' }}>Total Price</span>
                    <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '3rem', color: '#c9a84c', fontWeight: '700' }}>€{price}</span>
                  </div>
                  
                  <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', padding: '12px', marginBottom: '24px', fontSize: '13px', color: '#666' }}>
                    ✓ Free cancellation up to 24h before<br />
                    ✓ No hidden fees or surcharges<br />
                    ✓ Fixed price — guaranteed
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
                  <p>Enter your pickup and destination to see the price</p>
                </div>
              )}
              
              {!session ? (
                <div>
                  <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Create an account to book</p>
                    <Link href="/register" style={{ color: '#c9a84c', fontSize: '14px' }}>Create Free Account →</Link>
                  </div>
                  <Link href="/login?redirect=/booking" className="btn-gold" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%' }}>Login to Book</Link>
                </div>
              ) : (
                <button onClick={handleBooking} disabled={loading || !pickup || !dropoff || !pickupDate}
                  className="btn-gold" style={{ width: '100%', opacity: (!pickup || !dropoff || !pickupDate) ? 0.5 : 1 }}>
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              )}
              
              <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>🔒 Secure booking • Instant email confirmation</p>
            </div>

            {/* Contact box */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', padding: '20px', marginTop: '16px' }}>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>Need help booking?</p>
              <p style={{ color: '#c9a84c', fontSize: '16px', fontWeight: '600' }}>📞 +34 XXX XXX XXX</p>
              <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>Available 24/7 · English & Spanish</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.booking-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

export default function BookingPage() {
  return <Suspense fallback={<div style={{color:'#c9a84c',padding:'100px',textAlign:'center'}}>Loading...</div>}>
    <BookingForm />
  </Suspense>
}
