import prisma from '@lib/prisma'
import { Room } from '@prisma/client'

export async function getRoomsForPlace(placeId: string): Promise<Room[]> {
  return await prisma.room.findMany({
    where: {
      placeId,
    },
  })
}

export async function getRoomById(roomId: string): Promise<Room> {
  const room: Room | null = await prisma.room.findUnique({
    where: { id: roomId },
  })

  if (!room) {
    throw new Error('Room not found')
  }

  return room
}

export async function updateRoom(
  placeId: string,
  { name }: { name: string }
): Promise<Room> {
  const room: Room = await prisma.room.update({
    where: { id: placeId },
    data: {
      name,
    },
  })

  return room
}

export async function deleteRoom(roomId: string): Promise<Room> {
  const room: Room = await prisma.room.delete({
    where: { id: roomId },
  })

  return room
}

export async function createRoom(name: string, placeId: string): Promise<Room> {
  const room: Room = await prisma.room.create({
    data: { name, placeId },
  })
  return room
}
