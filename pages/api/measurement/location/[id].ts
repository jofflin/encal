import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { getPlaceById } from '@lib/place'
import prisma from '@lib/prisma'
import { Place } from '@prisma/client'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locationId: string = req.query.id as string

  if (req.method === 'POST') {
    await handlePOST(locationId, res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/measurement/location/:id
async function handlePOST(
  locationId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const message: {
      startTime: number
      endTime: number
      unit: string
      consumption: number
    } = req.body

    const place: Place = await getPlaceById(locationId)
    if (message.unit === 'Wh') {
      message.consumption = message.consumption / 1000
    }
    await prisma.placeMeasurement.create({
      data: {
        createdAt: new Date(message.startTime),
        placeId: locationId,
        value: message.consumption,
        duration: message.endTime - message.startTime,
        costs: (message.consumption * place.kwhPrice) / 100,
      },
    })
    res.json({ status: 200, message: 'OK' })
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
