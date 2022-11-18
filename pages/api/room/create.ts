import type { NextApiRequest, NextApiResponse } from 'next'
import { createRoom } from '@lib/room'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await handlePOST(res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// POST /api/user
async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  const { name, placeId }: { name: string; placeId: string } = req.body
  if (!name || !placeId) {
    res.status(400).json({ message: 'Name and placeId are required' })
    return
  }

  const place = await createRoom(name, placeId)
  res.json(place)
}
