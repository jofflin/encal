import argon2 from 'argon2'
import { User } from 'prisma/prisma-client'

export async function encryptPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password)
}

export function omitPassword(user: User): User {
  user.password = ''
  return user
}
