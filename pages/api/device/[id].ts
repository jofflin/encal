import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { Device } from '@prisma/client'
import { deleteDevice, getDeviceById, updateDevice } from '@lib/device'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deviceId: string = req.query.id as string

  if (req.method === 'GET') {
    await handleGET(deviceId, res)
  } else if (req.method === 'DELETE') {
    await handleDELETE(deviceId, res)
  } else if (req.method === 'PUT') {
    await handlePUT(deviceId, res, req)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/user/:id
async function handleGET(deviceId: string, res: NextApiResponse) {
  try {
    const device: Device = await getDeviceById(deviceId)
    res.json(device)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// GET /api/user/:id
async function handlePUT(
  deviceId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const device: Device = await updateDevice(deviceId, req.body)
    res.json(device)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// DELETE /api/user/:id
async function handleDELETE(deviceId: string, res: NextApiResponse) {
  try {
    const device: Device = await deleteDevice(deviceId)
    res.json(device)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
