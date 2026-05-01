import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const driver = await prisma.driver.findUnique({ where: { email: session.user.email } })
    if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const bookings = await prisma.booking.findMany({ where: { driverId: driver.id }, include: { user: true }, orderBy: { pickupDate: 'asc' } })
    return NextResponse.json({ bookings })
  } catch(e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
