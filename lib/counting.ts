import prisma from '@lib/prisma'
import { unstable_getServerSession } from 'next-auth'

export async function countPlacesForUser(userId: string): Promise<any> {
  const session = await unstable_getServerSession()
  console.log('sss', session)
  // get all place ids for user
  const placeIds = await prisma.place.findMany({
    where: { id: userId },
    select: { id: true },
  })

  // get all rooms for each place
  const rooms = await prisma.room.findMany({
    where: { placeId: { in: placeIds.map((place) => place.id) } },
    select: { id: true },
  })

  // get all devices for each room
  const devices = await prisma.device.findMany({
    where: { roomId: { in: rooms.map((room) => room.id) } },
    select: { id: true },
  })
  console.log(placeIds, rooms, devices)

  return devices
}

export async function countDevicesForRoom(roomId: string): Promise<number> {
  return await prisma.device.count({
    where: { roomId: roomId },
  })
}

export async function countDevicesAndRoomsForPlace(
  placeId: string
): Promise<{ devicesAmount: number; roomsAmount: number }> {
  // get all rooms for the place
  const rooms = await prisma.room.findMany({
    where: { placeId },
    select: { id: true },
  })

  // get all devices for each room
  const devicesAmount = await prisma.device.count({
    where: { roomId: { in: rooms.map((room) => room.id) } },
  })

  return { devicesAmount, roomsAmount: rooms.length }
}
