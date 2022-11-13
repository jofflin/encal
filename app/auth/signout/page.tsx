import { logger } from '@lib/logger'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function logout() {
  const callbackUrl = process.env.NEXTAUTH_URL || '/'
  logger.debug(`callbackUrl`)
  logger.debug(callbackUrl)
  signOut({ callbackUrl })
  return <div></div>
}
