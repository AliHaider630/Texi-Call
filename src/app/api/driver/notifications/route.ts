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
    const notifications = await prisma.notification.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return NextResponse.json({ notifications })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const driver = await prisma.driver.findUnique({ where: { email: session.user.email } })
    if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.notification.updateMany({ where: { driverId: driver.id, read: false }, data: { read: true } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
