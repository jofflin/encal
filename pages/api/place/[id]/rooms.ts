import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { Room } from '@prisma/client'
import { getRoomsForPlace } from '@lib/room'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const placeId: string = req.query.id as string

  if (req.method === 'GET') {
    await handleGET(placeId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/user/:id
async function handleGET(placeId: string, res: NextApiResponse) {
  try {
    const rooms: Room[] = await getRoomsForPlace(placeId)
    res.json(rooms)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
