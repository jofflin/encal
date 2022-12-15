import ConfigureRoom from '@components/configure-room'
import { getRoomById } from '@lib/room'

type Props = {
  searchParams?: {
    roomId?: string
  }
  params: {
    placeId: string
  }
}

export default async function RoomEdit({ searchParams, params }: Props) {
  if (!searchParams?.roomId) {
    return <ConfigureRoom placeId={params.placeId} />
  }
  const room = await getRoomById(searchParams.roomId)

  return <ConfigureRoom room={room} placeId={params.placeId} />
}
