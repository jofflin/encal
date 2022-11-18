import ConfigureRoom from '@components/configure-room'
import { getRoomById } from '@lib/room'

type Props = {
  searchParams: {
    id: string
  }
}

export default async function RoomConfiguration({ searchParams }: Props) {
  if (!searchParams.id) {
    return <ConfigureRoom />
  }
  const room = await getRoomById(searchParams.id)

  return <ConfigureRoom room={room} />
}
