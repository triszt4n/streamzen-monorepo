import prisma from '../lib/prisma'

export async function getUsers() {
  const data = await prisma.user.findMany()
  return data
}
