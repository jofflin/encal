import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { Room } from '@prisma/client'
import { deleteRoom, getRoomById, updateRoom } from '@lib/room'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const roomId: string = req.query.id as string

  if (req.method === 'GET') {
    await handleGET(roomId, res)
  } else if (req.method === 'DELETE') {
    await handleDELETE(roomId, res)
  } else if (req.method === 'PUT') {
    await handlePUT(roomId, res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/user/:id
async function handleGET(roomId: string, res: NextApiResponse) {
  try {
    const room: Room = await getRoomById(roomId)
    res.json(room)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// GET /api/user/:id
async function handlePUT(
  roomId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const room: Room = await updateRoom(roomId, req.body)
    res.json(room)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// DELETE /api/user/:id
async function handleDELETE(roomId: string, res: NextApiResponse) {
  try {
    const room: Room = await deleteRoom(roomId)
    res.json(room)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
