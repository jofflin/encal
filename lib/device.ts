import prisma from '@lib/prisma'
import { Device } from '@prisma/client'

export async function getDevicesForRoom(roomId: string): Promise<Device[]> {
  return await prisma.device.findMany({
    where: {
      roomId,
    },
  })
}

export async function findDeviceWithOneTimeCode(
  oneTimeCode: string
): Promise<Device | null> {
  return await prisma.device.findUnique({
    where: {
      oneTimeCode,
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
  { name, serialNumber }: { name: string; serialNumber?: string }
): Promise<Device> {
  const device: Device = await prisma.device.update({
    where: { id: deviceId },
    data: {
      name,
      serialNumber,
    },
  })

  return device
}

export async function deviceRegistered(
  deviceId: string
): Promise<{ registered: boolean }> {
  const device = await prisma.device.update({
    where: { id: deviceId },
    data: {
      deviceRegistered: true,
    },
  })

  if (!device) {
    throw new Error('Device not found')
  }

  return { registered: device.deviceRegistered }
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
  type: string,
  serialNumber?: string
): Promise<Device> {
  const oneTimeCode = Math.random().toString(36).substring(7)
  const secret = Math.random().toString(36).substring(2, 13)
  const device: Device = await prisma.device.create({
    data: { name, roomId, deviceType: type, serialNumber, oneTimeCode, secret },
  })
  return device
}

export async function getDeviceTypes(): Promise<string[]> {
  // const deviceTypes: string[] = await prisma.deviceType.findMany({
  //   select: { name: true },
  // })
  return [
    'tv',
    'router',
    'oven',
    'refrigerator',
    'washer',
    'dryer',
    'ac',
    'microwave',
    // 'ac',
    // 'heater',
    // 'iron',
    // 'gaming console',
    // 'router',
    // 'curtain',
    // 'door',
    // 'window',
    // 'switch',
    // 'socket',
    // 'camera',
    // 'thermostat',
    // 'lock',
    // 'speaker',
    // 'microphone',
    // 'refrigerator',
    // 'oven',
    // 'dishwasher',
    // 'washer',
    // 'dryer',
    // 'air purifier',
    // 'water purifier',
    // 'water heater',
    // 'water dispenser',
    // 'coffee maker',
    // 'toaster',
    // 'blender',
    // 'microwave',
    // 'air conditioner',
    // 'dehumidifier',
    // 'humidifier',
    // 'air fryer',
    // 'air cooler',
    // 'air purifier',
    // 'air humidifier',
    // 'air dehumidifier',
    // 'air sterilizer',
    // 'air cleaner',
    // 'other',
  ].sort((a, b) => a.localeCompare(b))
}

export function getConsumptionForDevice(device: Device): number[] {
  switch (device.deviceType) {
    case 'tv':
      return createTvConsumption()
    case 'router':
      return createRouterConsumption()
    case 'oven':
      return createOvenConsumption()
    case 'refrigerator':
      return createRefrigeratorConsumption()
    case 'washer':
      return createWasherConsumption()
    case 'dryer':
      return createDryerConsumption()
    case 'ac':
      return createAcConsumption()
    case 'microwave':
      return createMicrowaveConsumption()
    default:
      return [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]
  }
}

function createTvConsumption(): number[] {
  // Create tv consumption that consumes 0,1kwh per hour
  // create 4 different tv consumption days
  // each is an array with 24 values
  // each value is the consumption for that hour
  const case1 = Array.from({ length: 24 }, () =>
    Math.random() > 0.5 ? 0.1 : 0
  )
  const case2 = Array.from({ length: 24 }, () =>
    Math.random() > 0.2 ? 0.1 : 0
  )
  const case3 = Array.from({ length: 24 }, () =>
    Math.random() > 0.8 ? 0.1 : 0
  )
  const case4 = Array.from({ length: 24 }, () =>
    Math.random() > 0.1 ? 0.1 : 0
  )
  return returnRandomEntry([case1, case2, case3, case4])
}

function createRouterConsumption(): number[] {
  return Array.from({ length: 24 }, () => 0.01)
}

function createOvenConsumption(): number[] {
  const ovenMonrning =
    Math.random() > 0.95 ? returnRandomEntry([0.75, 0.25]) : 0
  const ovenLunch =
    Math.random() > 0.5 ? returnRandomEntry([1.25, 1, 0.75, 0.5]) : 0
  const ovenDinner =
    Math.random() > 0.25 ? returnRandomEntry([1.75, 1.5, 1.25, 1, 0.75]) : 0
  return [
    0,
    0,
    0,
    0,
    0,
    0,
    ovenMonrning,
    0,
    0,
    0,
    ovenLunch,
    0,
    0,
    0,
    0,
    0,
    0,
    ovenDinner,
    0,
    0,
    0,
    0,
    0,
    0,
  ]
}

function createRefrigeratorConsumption(): number[] {
  return Array.from({ length: 24 }, () => 0.03)
}

function createWasherConsumption(): number[] {
  const waschingAt8 = Math.random() > 0.95 ? 1 : 0
  const waschingAt16 = Math.random() > 0.8 ? 1 : 0
  const waschingAt18 = Math.random() > 0.9 ? 1 : 0

  return [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    waschingAt8,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    waschingAt16,
    0,
    waschingAt18,
    0,
    0,
    0,
    0,
    0,
    0,
  ]
}

function createDryerConsumption(): number[] {
  const waschingAt8 = Math.random() > 0.95 ? 1 : 0
  const waschingAt16 = Math.random() > 0.8 ? 1 : 0
  const waschingAt18 = Math.random() > 0.9 ? 1 : 0

  return [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    waschingAt8,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    waschingAt16,
    0,
    waschingAt18,
    0,
    0,
    0,
    0,
    0,
    0,
  ]
  return [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]
}

function createAcConsumption(): number[] {
  const acMorning = Math.random() > 0.95 ? 2.5 : 0
  const acAfternoon = Math.random() > 0.75 ? 2.5 : 0
  return [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    acMorning,
    acMorning,
    acMorning,
    0,
    0,
    0,
    0,
    acAfternoon,
    acAfternoon,
    acAfternoon,
    acAfternoon,
    0,
    0,
    0,
    0,
    0,
  ]
}

function createMicrowaveConsumption(): number[] {
  const microMonrning = Math.random() > 0.95 ? 0.2 : 0
  const microLunch = Math.random() > 0.5 ? 0.4 : 0
  const microDinner = Math.random() > 0.75 ? 0.5 : 0
  return [
    0,
    0,
    0,
    0,
    0,
    0,
    microMonrning,
    0,
    0,
    0,
    microLunch,
    0,
    0,
    0,
    0,
    0,
    0,
    microDinner,
    0,
    0,
    0,
    0,
    0,
    0,
  ]
}

function returnRandomEntry<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
