import { User } from 'prisma/prisma-client'
import { getUserByEmail } from '@lib/user'
import { omitPassword, verifyPassword } from '@lib/auth/passwordUtils'
import { logger } from '@lib/logger'

export async function checkCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user: User = await getUserByEmail(email)
  console.log('user', user)

  const verified = await verifyPassword(user.password, password)
  if (verified) {
    logger.debug('password correct')
    omitPassword(user)
    return user
  } else {
    logger.debug('incorrect credentials')
    return null
  }
}
