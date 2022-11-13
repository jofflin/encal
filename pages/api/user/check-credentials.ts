import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { getUserByEmail } from '@lib/user'
import { omitPassword, verifyPassword } from '@lib/auth/passwordUtils'
import { User } from 'prisma/prisma-client'

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
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  const user: User = await getUserByEmail(email)

  const verified = await verifyPassword(user.password, password)
  if (verified) {
    logger.debug('password correct')
    omitPassword(user)
    res.json(user)
  } else {
    logger.debug('incorrect credentials')
    res.status(400).end('Invalid credentials')
  }
}
