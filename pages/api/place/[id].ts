import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { deletePlace, getPlaceById, updatePlace } from '@lib/place'
import { Place } from '@prisma/client'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const placeId: string = req.query.id as string

  if (req.method === 'GET') {
    await handleGET(placeId, res)
  } else if (req.method === 'DELETE') {
    await handleDELETE(placeId, res)
  } else if (req.method === 'PUT') {
    await handlePUT(placeId, res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/user/:id
async function handleGET(placeId: string, res: NextApiResponse) {
  try {
    const place: Place = await getPlaceById(placeId)
    res.json(place)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// GET /api/user/:id
async function handlePUT(
  placeId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const place: Place = await updatePlace(placeId, req.body)
    res.json(place)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// DELETE /api/user/:id
async function handleDELETE(placeId: string, res: NextApiResponse) {
  try {
    const place: Place = await deletePlace(placeId)
    res.json(place)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
