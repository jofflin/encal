import PageHeading from '@components/page-heading'
import { Device } from '@prisma/client'
import { getDeviceById } from '@lib/device'

type Props = {
  params: {
    id: string
  }
}

export default async function DeviceDetails({ params }: Props) {
  const device: Device = await getDeviceById(params.id)

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading
        title={device.name}
        backLink={`/configuration/room/${device.roomId}`}
      />
    </div>
  )
}
