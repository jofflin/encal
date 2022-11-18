import ConfigureRoom from '@components/configure-room'
import { getRoomById } from '@lib/room'

type Props = {
  searchParams: {
    placeId: string
    roomId?: string
  }
}

export default async function RoomEdit({ searchParams }: Props) {
  if (!searchParams.roomId) {
    return <ConfigureRoom placeId={searchParams.placeId} />
  }
  const room = await getRoomById(searchParams.roomId)

  return <ConfigureRoom room={room} placeId={searchParams.placeId} />
}
