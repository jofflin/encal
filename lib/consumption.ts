import {
  getConsumptionForDevice,
  getDeviceById,
  getDevicesForRoom,
} from '@lib/device'
import prisma from '@lib/prisma'
import { ChartData, ScaleChartOptions } from 'chart.js'
import { getPlaceById } from '@lib/place'
import { getRoomById } from '@lib/room'
import { DeepPartial } from 'react-hook-form'

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
    const date = new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000 + i * 24 * 60 * 60 * 1000
    )
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
  kwhPrice: number
  basePrice: number
  day1Labels: string[]
  daysLabels: string[]
  roomLabel: string
  roomId: string
  day1: number[]
  days: number[]
}> {
  // get all devices in room
  const devices = await getDevicesForRoom(roomId)
  const room = await getRoomById(roomId)
  const place = await getPlaceById(room.placeId)
  const consumption: {
    daysAmount: number
    devices: {
      deviceLabel: string
      deviceId: string
      days: number[]
      day1: number[]
    }[]
    kwhPrice: number
    basePrice: number
    day1Labels: string[]
    daysLabels: string[]
    roomId: string
    roomLabel: string
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
    kwhPrice: place.kwhPrice,
    basePrice: place.basePrice,
    day1Labels: [],
    daysLabels: [],
    roomId,
    roomLabel: room.name,
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
  kwhPrice: number
  basePrice: number
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
    kwhPrice: number
    basePrice: number
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
    kwhPrice: place.kwhPrice,
    basePrice: place.basePrice,
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
  kwhPrice: number
  basePrice: number
  placeName: string
  day1Labels: string[]
  daysLabels: string[]
  placeId: string
  day1: number[]
  days: number[]
}): {
  data: ChartData
  header: string
  subheader: string
  priceText: string
  link: string
  options: DeepPartial<ScaleChartOptions>
} {
  // calculate sum of all rooms
  const sum = data.days.reduce((acc, curr) => {
    return acc + curr
  })
  // calculate price with sum, kwh price as cents in euro and cents
  const price = ((sum * data.kwhPrice) / 100).toFixed(2)

  const priceText = price + '€ + ' + data.basePrice + '€'
  const header = `Consumption for ${data.placeName}`
  const subheader = `Last ${data.daysAmount} days`
  const link = `/${data.placeId}`
  const chartData: ChartData = {
    labels: data.daysLabels,
    datasets: data.rooms.map((room, i) => ({
      label: room.deviceLabel,
      data: room.days,
      backgroundColor: colors[i],
      borderColor: colors[i],
      fill: false,
    })),
  }
  const options: DeepPartial<ScaleChartOptions> = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Kwh',
        },
      },
    },
  }
  return { data: chartData, header, subheader, link, options, priceText }
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
  kwhPrice: number
  basePrice: number
  placeName: string
  day1Labels: string[]
  daysLabels: string[]
  placeId: string
  day1: number[]
  days: number[]
}): {
  data: ChartData
  header: string
  subheader: string
  priceText: string
  link: string
  options: DeepPartial<ScaleChartOptions>
}[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    priceText: string
    link: string
    options: DeepPartial<ScaleChartOptions>
  }[] = []
  data.rooms.forEach((room) => {
    response.push({
      header: `Consumption for ${room.deviceLabel}`,
      subheader: `Last ${data.daysAmount} days`,
      link: `/${data.placeId}/${room.deviceId}`,
      priceText:
        (
          (room.days.reduce((acc, curr) => {
            return acc + curr
          }) *
            data.kwhPrice) /
          100
        ).toFixed(2) + '€',
      data: {
        labels: data.daysLabels,
        datasets: room.devices.map((device, i) => ({
          label: device.deviceLabel,
          data: device.days,
          backgroundColor: colors[i],
          borderColor: colors[i],
          fill: false,
        })),
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Kwh',
            },
          },
        },
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
    kwhPrice: number
    basePrice: number
    day1Labels: string[]
    daysLabels: string[]
    roomId: string
    day1: number[]
    days: number[]
  }
): {
  data: ChartData
  header: string
  subheader: string
  link: string
  priceText: string
  options: DeepPartial<ScaleChartOptions>
}[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    priceText: string
    link: string
    options: DeepPartial<ScaleChartOptions>
  }[] = []
  data.devices.forEach((device, i) => {
    response.push({
      header: `Consumption for ${device.deviceLabel}`,
      subheader: `Last 7 days`,
      link: `/${baselink}/${device.deviceId}`,
      priceText:
        (
          (device.day1.reduce((acc, curr) => {
            return acc + curr
          }) *
            data.kwhPrice) /
          100
        ).toFixed(2) + '€',
      data: {
        labels: data.daysLabels,
        datasets: [
          {
            label: device.deviceLabel,
            data: device.days,
            backgroundColor: colors[i],
            borderColor: colors[i],
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Kwh',
            },
          },
        },
      },
    })
  })
  return response
}

export function mapDeviceConsumptionToChartData(
  data: {
    daysAmount: number
    day1: number[]
    days: number[]
    daysLabels: string[]
    day1Labels: string[]
    deviceLabel: string
  },
  kwhPrice: number
): {
  data: ChartData
  header: string
  subheader: string
  priceText: string
  link: string
  options: DeepPartial<ScaleChartOptions>
}[] {
  const response: {
    data: ChartData
    header: string
    subheader: string
    priceText: string
    link: string
    options: DeepPartial<ScaleChartOptions>
  }[] = [
    {
      header: `Consumption for ${data.deviceLabel}`,
      subheader: `Last 24 hours`,
      link: ``,
      priceText:
        (
          (data.day1.reduce((acc, curr) => {
            return acc + curr
          }) *
            kwhPrice) /
          100
        ).toFixed(2) + '€',
      data: {
        labels: data.day1Labels,
        datasets: [
          {
            label: data.deviceLabel,
            data: data.day1,
            backgroundColor: colors[0],
            borderColor: colors[0],
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hours',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Kwh',
            },
          },
        },
      },
    },
    {
      header: `Consumption for ${data.deviceLabel}`,
      subheader: `Last ${data.daysAmount} days`,
      link: ``,
      priceText:
        (
          (data.days.reduce((acc, curr) => {
            return acc + curr
          }) *
            kwhPrice) /
          100
        ).toFixed(2) + '€',
      data: {
        labels: data.daysLabels,
        datasets: [
          {
            label: data.deviceLabel,
            data: data.days,
            backgroundColor: colors[0],
            borderColor: colors[0],
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Kwh',
            },
          },
        },
      },
    },
  ]
  return response
}

const colors = [
  '#99f6e4',
  '#2dd4bf',
  '#0d9488',
  '#115e59',
  '#134e4a',
  '#ccfbf1',
]
