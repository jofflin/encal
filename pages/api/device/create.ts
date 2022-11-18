import type { NextApiRequest, NextApiResponse } from 'next'
import { createDevice } from '@lib/device'

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
  const {
    name,
    roomId,
    deviceType,
  }: { name: string; deviceType: string; roomId: string } = req.body
  if (!name || !roomId || !deviceType) {
    res
      .status(400)
      .json({ message: 'Name, deviceType and roomId are required' })
    return
  }

  const device = await createDevice(name, roomId, deviceType)
  res.json(device)
}
