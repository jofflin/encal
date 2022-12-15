import PageHeading from '@components/page-heading'
import { Device } from '@prisma/client'
import { getDeviceById } from '@lib/device'

type Props = {
  params: {
    placeId: string
    roomId: string
    deviceId: string
  }
}

export default async function DeviceDetails({ params }: Props) {
  const device: Device = await getDeviceById(params.deviceId)

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading
        title={device.name}
        backLink={`/configuration/${params.placeId}/${params.roomId}`}
      />
    </div>
  )
}
