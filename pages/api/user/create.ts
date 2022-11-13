import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@lib/logger'
import { encryptPassword } from '@lib/auth/passwordUtils'
import { createUser } from '@lib/user'

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
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password are required' })
    return
  }
  const passwordHash = await encryptPassword(password)
  logger.debug('creating user', {
    ...req.body,
    password: passwordHash,
  })

  const user = await createUser({
    name,
    email,
    password: passwordHash,
  })
  res.json(user)
}
