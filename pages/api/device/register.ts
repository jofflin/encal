import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { Device } from '@prisma/client'
import { findDeviceWithOneTimeCode } from '@lib/device'
import prisma from '@lib/prisma'

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

// GET /api/device/register
async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  try {
    const message: {
      oneTimeCode: string
    } = req.body

    const device: Device | null = await findDeviceWithOneTimeCode(
      message.oneTimeCode
    )

    if (device === null) {
      res.status(403).json({ message: 'Invalid one time code' })
      return
    }

    const oneTimeCode = Math.random().toString(36).substring(7)
    await prisma.device.update({
      where: {
        id: device.id,
      },
      data: {
        oneTimeCode,
        deviceRegistered: true,
      },
    })

    res.json({
      status: 200,
      message: {
        secret: device.secret,
        id: device.id,
        messageText: 'Device registered successfully',
      },
    })

    res.json(device)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
