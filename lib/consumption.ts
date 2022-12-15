import { getDevicesForRoom } from '@lib/device'
import prisma from '@lib/prisma'

export type RoomConsumption = {
  roomId: string
  consumption: number
  devices: {
    deviceId: string
    consumption: number
    percentage: number
  }[]
}

export async function getRoomConsumption(
  roomId: string
): Promise<RoomConsumption> {
  // get all devices in room
  const devices = await getDevicesForRoom(roomId)

  const roomConsumption: RoomConsumption = {
    roomId,
    consumption: 0,
    devices: [],
  }

  return roomConsumption
}

async function getDeviceConsumption(deviceId: string): Promise<number> {
  // get the sum of all measurements from the last 30 days
  const consumption = await prisma.deviceMeasurement.aggregate({
    where: {
      deviceId,
      createdAt: {
        gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      value: true,
    },
  })
  return consumption._sum.value || 0
}

export async function getRoomConsumptions(roomId: string): Promise<number> {
  // get devices in room
  const devices = await getDevicesForRoom(roomId)
  // get the sum of all measurements from the last 30 days
  const consumption = await prisma.deviceMeasurement.groupBy({
    by: ['deviceId'],
    where: {
      deviceId: {
        in: devices.map((device) => device.id),
      },
      createdAt: {
        gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      value: true,
    },
  })
  console.log(consumption)
  return 0
}
