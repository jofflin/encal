import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'prisma/prisma-client'
import { deleteUser, getUserById, updateUser } from '@lib/user'
import { omitPassword } from '@lib/auth/passwordUtils'
import { logger } from '@lib/logger'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId: string = req.query.id as string

  if (req.method === 'GET') {
    await handleGET(userId, res)
  } else if (req.method === 'POST') {
    await handlePOST(userId, res, req)
  } else if (req.method === 'DELETE') {
    await handleDELETE(userId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/user/:id
async function handleGET(userId: string, res: NextApiResponse) {
  try {
    const user: User = await getUserById(userId)
    omitPassword(user)
    res.json(user)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// GET /api/user/:id
async function handlePOST(
  userId: string,
  res: NextApiResponse,
  req: NextApiRequest
) {
  try {
    const user: User = await updateUser(userId, req.body)
    omitPassword(user)
    res.json(user)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}

// DELETE /api/user/:id
async function handleDELETE(userId: string, res: NextApiResponse) {
  try {
    const user: User = await deleteUser(userId)
    omitPassword(user)
    res.json(user)
  } catch (e: any) {
    logger.error(e)
    res.status(500).json({ message: e.message })
  }
}
