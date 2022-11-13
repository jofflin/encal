import prisma from '@lib/prisma'
import { User } from 'prisma/prisma-client'
import { encryptPassword } from '@lib/auth/passwordUtils'

export async function getUserById(userId: string): Promise<User> {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export async function getUserByEmail(email: string): Promise<User> {
  const user: User | null = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export async function updateUser(userId: string, data: any): Promise<User> {
  // encrypt password if it is being updated
  if (data.password) {
    data.password = await encryptPassword(data.password)
  }
  const user: User = await prisma.user.update({
    where: { id: userId },
    data: { ...data },
  })

  return user
}

export async function deleteUser(userId: string): Promise<User> {
  const user: User = await prisma.user.delete({
    where: { id: userId },
  })

  return user
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}): Promise<User> {
  const user: User = await prisma.user.create({
    data: { ...data },
  })

  return user
}
