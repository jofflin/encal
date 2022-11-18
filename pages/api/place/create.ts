import type { NextApiRequest, NextApiResponse } from 'next'
import { createPlace, createPlaceBinding } from '@lib/place'

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
    kwhPrice,
    basePrice,
    userId,
  }: { name: string; kwhPrice: string; basePrice: string; userId: string } =
    req.body
  if (!name || !kwhPrice || !basePrice) {
    res
      .status(400)
      .json({ message: 'Name, kwhPrice and basePrice are required' })
    return
  }
  console.log(name, typeof kwhPrice, typeof basePrice)

  const place = await createPlace(name, parseInt(kwhPrice), parseInt(basePrice))

  await createPlaceBinding(place.id, userId)
  res.json(place)
}
