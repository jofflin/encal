import prisma from '@lib/prisma'
import { Place } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth'

export async function getMyPlaces(): Promise<Place[]> {
  const session = await unstable_getServerSession()
  if (!session || !session.user) {
    throw new Error('You must be signed in to view your places.')
  }
  const placeIds = await prisma.userPlaceConnection.findMany({
    where: {
      userId: session.user.email as string,
    },
  })
  return await prisma.place.findMany({
    where: {
      id: {
        in: placeIds.map((place) => place.placeId),
      },
    },
  })
}

export async function getPlaceById(placeId: string): Promise<Place> {
  const place: Place | null = await prisma.place.findUnique({
    where: { id: placeId },
  })

  if (!place) {
    throw new Error('User not found')
  }

  return place
}

export async function updatePlace(
  placeId: string,
  {
    name,
    kwhPrice,
    basePrice,
  }: { name: string; kwhPrice: string; basePrice: string }
): Promise<Place> {
  const place: Place = await prisma.place.update({
    where: { id: placeId },
    data: {
      name,
      kwhPrice: parseInt(kwhPrice),
      basePrice: parseInt(basePrice),
    },
  })

  return place
}

export async function deletePlace(placeId: string): Promise<Place> {
  const place: Place = await prisma.place.delete({
    where: { id: placeId },
  })

  return place
}

export async function createPlace(
  name: string,
  basePrice: number,
  kwhPrice: number
): Promise<Place> {
  const place: Place = await prisma.place.create({
    data: { name, basePrice, kwhPrice },
  })

  return place
}

export async function createPlaceBinding(
  placeId: string,
  userId: string
): Promise<void> {
  await prisma.userPlaceConnection.create({
    data: {
      isOwner: true,
      userId,
      placeId,
    },
  })
}
