import prisma from '@lib/prisma'
import { Device } from '@prisma/client'

export async function getDevicesForRoom(roomId: string): Promise<Device[]> {
  return await prisma.device.findMany({
    where: {
      roomId,
    },
  })
}

export async function getDeviceById(deviceId: string): Promise<Device> {
  const device: Device | null = await prisma.device.findUnique({
    where: { id: deviceId },
  })

  if (!device) {
    throw new Error('Device not found')
  }

  return device
}

export async function updateDevice(
  deviceId: string,
  { name }: { name: string }
): Promise<Device> {
  const device: Device = await prisma.device.update({
    where: { id: deviceId },
    data: {
      name,
    },
  })

  return device
}

export async function deleteDevice(deviceId: string): Promise<Device> {
  const device: Device = await prisma.device.delete({
    where: { id: deviceId },
  })

  return device
}

export async function createDevice(
  name: string,
  roomId: string,
  type: string
): Promise<Device> {
  const device: Device = await prisma.device.create({
    data: { name, roomId, deviceType: type },
  })
  return device
}

export async function getDeviceTypes(): Promise<string[]> {
  // const deviceTypes: string[] = await prisma.deviceType.findMany({
  //   select: { name: true },
  // })
  return [
    'light',
    'fan',
    'tv',
    'ac',
    'heater',
    'curtain',
    'door',
    'window',
    'switch',
    'socket',
    'camera',
    'thermostat',
    'lock',
    'speaker',
    'microphone',
    'refrigerator',
    'oven',
    'dishwasher',
    'washer',
    'dryer',
    'robot',
    'air purifier',
    'water purifier',
    'water heater',
    'water dispenser',
    'coffee maker',
    'toaster',
    'blender',
    'microwave',
    'air conditioner',
    'dehumidifier',
    'humidifier',
    'air fryer',
    'air cooler',
    'air purifier',
    'air humidifier',
    'air dehumidifier',
    'air sterilizer',
    'air cleaner',
    'other',
  ].sort((a, b) => a.localeCompare(b))
}
