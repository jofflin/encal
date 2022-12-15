import ConfigureDevice from '@components/configure-device'
import { getDeviceById, getDeviceTypes } from '@lib/device'

type Props = {
  searchParams?: {
    deviceId?: string
  }
  params: {
    placeId: string
    roomId: string
  }
}

export default async function DeviceEdit({ searchParams, params }: Props) {
  console.log(`searchParams`, searchParams)
  const deviceTypes = await getDeviceTypes()
  if (!searchParams?.deviceId) {
    return (
      <ConfigureDevice
        placeId={params.placeId}
        deviceTypes={deviceTypes}
        roomId={params.roomId}
      />
    )
  }
  const device = await getDeviceById(searchParams.deviceId)

  return (
    <ConfigureDevice
      device={device}
      roomId={params.roomId}
      placeId={params.placeId}
      deviceTypes={deviceTypes}
    />
  )
}
