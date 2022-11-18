import ConfigureDevice from '@components/configure-device'
import { getDeviceById } from '@lib/device'

type Props = {
  searchParams: {
    id: string
  }
}

export default async function DeviceConfiguration({ searchParams }: Props) {
  if (!searchParams.id) {
    return <ConfigureDevice />
  }
  const device = await getDeviceById(searchParams.id)

  return <ConfigureDevice device={device} />
}
