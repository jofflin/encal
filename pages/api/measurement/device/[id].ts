import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { Device } from '@prisma/client'
import { getDeviceById } from '@lib/device'
import prisma from '@lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deviceId: string = req.query.id as string

  if (req.method === 'POST') {
    await handlePOST(deviceId, res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/measurement/device/:id
async function handlePOST(
  deviceId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const message: {
      secret: string
      startTime: number
      endTime: number
      unit: string
      consumption: number
    } = req.body

    const device: Device = await getDeviceById(deviceId)
    if (device.secret !== message.secret) {
      res.status(403).json({ message: 'Invalid secret' })
      return
    }

    if (message.unit === 'Wh') {
      message.consumption = message.consumption / 1000
    }
    await prisma.deviceMeasurement.create({
      data: {
        createdAt: new Date(message.startTime),
        deviceId,
        value: message.consumption,
        duration: message.endTime - message.startTime,
      },
    })
    res.json({ status: 200, message: 'OK' })

    res.json(device)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
