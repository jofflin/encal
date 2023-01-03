import {
  getConsumptionForDevice,
  getDeviceById,
  getDevicesForRoom,
} from '@lib/device'
import prisma from '@lib/prisma'
import { ChartData } from 'chart.js'
import { getPlaceById } from '@lib/place'

export type RoomConsumption = {
  roomId: string
  consumption: number
  devices: {
    deviceId: string
    consumption: number
    percentage: number
  }[]
}

export async function getRoomConsumptionReal(
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

async function getDeviceConsumptionReal(deviceId: string): Promise<number> {
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

export async function getDeviceConsumption(deviceId: string): Promise<{
  daysAmount: number
  day1: number[]
  days: number[]
  daysLabels: string[]
  day1Labels: string[]
  deviceLabel: string
}> {
  //   get device
  const device = await getDeviceById(deviceId)
  const consumption: {
    daysAmount: number
    day1: number[]
    days: number[]
    daysLabels: string[]
    day1Labels: string[]
    deviceLabel: string
  } = {
    deviceLabel: device.name,
    daysAmount: 7,
    day1: [],
    days: [],
    daysLabels: [],
    day1Labels: [],
  }

  for (let i = 0; i < 7; i++) {
    const dayConsumption = getConsumptionForDevice(device)
    if (i === 0) {
      consumption.day1 = dayConsumption
      consumption.day1Labels = dayConsumption.map((_, i) => `${i}:00`)
    }
    const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
    const daySum = dayConsumption.reduce((acc, curr) => {
      return acc + curr
    })
    consumption.days.push(daySum)
    consumption.daysLabels.push(date.toLocaleDateString())
  }
  return consumption
}

export async function getRoomConsumption(roomId: string): Promise<{
  daysAmount: number
  devices: {
    deviceLabel: string
    deviceId: string
    days: number[]
    day1: number[]
  }[]
  day1Labels: string[]
  daysLabels: string[]
  roomId: string
  day1: number[]
  days: number[]
}> {
  // get all devices in room
  const devices = await getDevicesForRoom(roomId)
  const consumption: {
    daysAmount: number
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
    day1Labels: string[]
    daysLabels: string[]
    roomId: string
    day1: number[]
    days: number[]
  } = {
    daysAmount: 7,
    devices: devices.map((device) => ({
      deviceLabel: device.name,
      deviceId: device.id,
      days: [],
      day1: [],
    })),
    day1Labels: [],
    daysLabels: [],
    roomId,
    day1: Array(24).fill(0),
    days: Array(7).fill(0),
  }
  await Promise.all(
    devices.map(async (device) => {
      return await getDeviceConsumption(device.id)
    })
  ).then((res) => {
    consumption.day1Labels = res[0].day1Labels
    consumption.daysLabels = res[0].daysLabels
    //   combine the results
    res.forEach((deviceConsumption, i) => {
      consumption.devices[i].day1 = deviceConsumption.day1
      consumption.devices[i].days = deviceConsumption.days
      consumption.day1.map((value, i) => {
        consumption.day1[i] += deviceConsumption.day1[i]
      })
      consumption.days.map((value, i) => {
        consumption.days[i] += deviceConsumption.days[i]
      })
    })
  })
  return consumption
}

export async function getPlaceConsumptions(placeId: string): Promise<{
  daysAmount: number
  rooms: {
    deviceLabel: string
    deviceId: string
    days: number[]
    day1: number[]
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
  }[]
  placeName: string
  day1Labels: string[]
  daysLabels: string[]
  placeId: string
  day1: number[]
  days: number[]
}> {
  // get all rooms in place
  const rooms = await prisma.room.findMany({
    where: {
      placeId,
    },
  })
  const place = await getPlaceById(placeId)
  const consumption: {
    daysAmount: number
    rooms: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
      devices: {
        deviceLabel: string
        deviceId: string
        days: number[]
        day1: number[]
      }[]
    }[]
    placeName: string
    day1Labels: string[]
    daysLabels: string[]
    placeId: string
    day1: number[]
    days: number[]
  } = {
    daysAmount: 7,
    rooms: rooms.map((room) => ({
      deviceLabel: room.name,
      deviceId: room.id,
      days: [],
      day1: [],
      devices: [],
    })),
    placeName: place.name,
    day1Labels: [],
    daysLabels: [],
    placeId,
    day1: Array(24).fill(0),
    days: Array(7).fill(0),
  }
  await Promise.all(
    rooms.map(async (room) => {
      return await getRoomConsumption(room.id)
    })
  ).then((res) => {
    consumption.day1Labels = res[0].day1Labels
    consumption.daysLabels = res[0].daysLabels
    //   combine the results
    res.forEach((deviceConsumption, i) => {
      consumption.rooms[i].day1 = deviceConsumption.day1
      consumption.rooms[i].days = deviceConsumption.days
      consumption.rooms[i].devices = deviceConsumption.devices
      consumption.day1.map((value, i) => {
        consumption.day1[i] += deviceConsumption.day1[i]
      })
      consumption.days.map((value, i) => {
        consumption.days[i] += deviceConsumption.days[i]
      })
    })
  })
  return consumption
}

export function mapPlaceConsumptionToChartData(data: {
  daysAmount: number
  rooms: {
    deviceLabel: string
    deviceId: string
    days: number[]
    day1: number[]
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
  }[]
  placeName: string
  day1Labels: string[]
  daysLabels: string[]
  placeId: string
  day1: number[]
  days: number[]
}): { data: ChartData; header: string; subheader: string; link: string } {
  const header = `Consumption for ${data.placeName}`
  const subheader = `Last ${data.daysAmount} days`
  const link = `/${data.placeId}`
  const chartData: ChartData = {
    labels: data.daysLabels,
    datasets: data.rooms.map((room) => ({
      label: room.deviceLabel,
      data: room.days,
      fill: false,
    })),
  }
  return { data: chartData, header, subheader, link }
}

export function mapRoomsConsumptionToChartData(data: {
  daysAmount: number
  rooms: {
    deviceLabel: string
    deviceId: string
    days: number[]
    day1: number[]
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
  }[]
  placeName: string
  day1Labels: string[]
  daysLabels: string[]
  placeId: string
  day1: number[]
  days: number[]
}): { data: ChartData; header: string; subheader: string; link: string }[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    link: string
  }[] = []
  data.rooms.forEach((room) => {
    response.push({
      header: `Consumption for ${room.deviceLabel}`,
      subheader: `Last ${data.daysAmount} days`,
      link: `/${data.placeId}/${room.deviceId}`,
      data: {
        labels: data.daysLabels,
        datasets: room.devices.map((device) => ({
          label: device.deviceLabel,
          data: device.days,
          fill: false,
        })),
      },
    })
  })
  return response
}

export function mapDevicessConsumptionToChartData(
  baselink: string,
  data: {
    daysAmount: number
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
    day1Labels: string[]
    daysLabels: string[]
    roomId: string
    day1: number[]
    days: number[]
  }
): { data: ChartData; header: string; subheader: string; link: string }[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    link: string
  }[] = []
  data.devices.forEach((device) => {
    response.push({
      header: `Consumption for ${device.deviceLabel}`,
      subheader: `Last 24 hours`,
      link: `/${baselink}/${device.deviceId}`,
      data: {
        labels: data.day1Labels,
        datasets: [
          {
            label: device.deviceLabel,
            data: device.day1,
            fill: false,
          },
        ],
      },
    })
  })
  return response
}

export function mapDeviceConsumptionToChartData(data: {
  daysAmount: number
  day1: number[]
  days: number[]
  daysLabels: string[]
  day1Labels: string[]
  deviceLabel: string
}): { data: ChartData; header: string; subheader: string; link: string }[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    link: string
  }[] = [
    {
      header: `Consumption for ${data.deviceLabel}`,
      subheader: `Last 24 hours`,
      link: ``,
      data: {
        labels: data.day1Labels,
        datasets: [
          {
            label: data.deviceLabel,
            data: data.day1,
            fill: false,
          },
        ],
      },
    },
    {
      header: `Consumption for ${data.deviceLabel}`,
      subheader: `Last ${data.daysAmount} days`,
      link: ``,
      data: {
        labels: data.daysLabels,
        datasets: [
          {
            label: data.deviceLabel,
            data: data.days,
            fill: false,
          },
        ],
      },
    },
  ]
  return response
}
