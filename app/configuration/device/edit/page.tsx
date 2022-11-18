import ConfigureDevice from '@components/configure-device'
import { getDeviceById, getDeviceTypes } from '@lib/device'

type Props = {
  searchParams: {
    deviceId?: string
    roomId: string
  }
}

export default async function DeviceEdit({ searchParams }: Props) {
  console.log(`searchParams`, searchParams)
  const deviceTypes = await getDeviceTypes()
  if (!searchParams.deviceId) {
    return (
      <ConfigureDevice deviceTypes={deviceTypes} roomId={searchParams.roomId} />
    )
  }
  const device = await getDeviceById(searchParams.deviceId)

  return (
    <ConfigureDevice
      device={device}
      roomId={searchParams.roomId}
      deviceTypes={deviceTypes}
    />
  )
}
