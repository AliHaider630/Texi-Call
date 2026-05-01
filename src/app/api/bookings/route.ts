import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmationToUser, sendNewBookingToAdmin } from '@/lib/email'
import { calculatePrice } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Please login to book' }, { status: 401 })
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    const body = await req.json()
    const { pickupLocation, dropoffLocation, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupDate, passengers, fleetType, bookingType, hours, extras, specialNotes, flightNumber, distance } = body
    
    const price = calculatePrice(distance || 20, fleetType, hours)
    
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        bookingType: bookingType || 'TRANSFER',
        pickupLocation,
        dropoffLocation,
        pickupLat: pickupLat || null,
        pickupLng: pickupLng || null,
        dropoffLat: dropoffLat || null,
        dropoffLng: dropoffLng || null,
        pickupDate: new Date(pickupDate),
        passengers: parseInt(passengers) || 1,
        fleetType,
        price,
        distance: distance || 0,
        hours: hours || null,
        extras: extras ? JSON.stringify(extras) : null,
        specialNotes: specialNotes || null,
        flightNumber: flightNumber || null,
        status: 'PENDING'
      }
    })

    await prisma.notification.create({
      data: { userId: user.id, title: 'Booking Received!', message: `Your transfer from ${pickupLocation} to ${dropoffLocation} has been booked. We'll assign a driver soon.`, type: 'BOOKING' }
    })
    
    try {
      await sendBookingConfirmationToUser(booking, user)
      await sendNewBookingToAdmin(booking, user)
    } catch(e) { console.log('Email error:', e) }
    
    return NextResponse.json({ success: true, booking })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ bookings })
  } catch(e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
