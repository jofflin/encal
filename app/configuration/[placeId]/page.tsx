import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getPlaceById } from '@lib/place'
import { getRoomsForPlace } from '@lib/room'
import { Place, Room } from '@prisma/client'
import ListElementEmpty from '@components/list-element-empty'
import {
  countDevicesForRoom,
  countRegisteredDevicesForRoom,
} from '@lib/counting'

type Props = {
  params: {
    placeId: string
  }
}

export default async function PlaceDetails({ params }: Props) {
  const rooms: Room[] = await getRoomsForPlace(params.placeId)
  const place: Place = await getPlaceById(params.placeId)
  const amounts: number[] = []
  const registered: number[] = []
  const baseRoute = `/configuration/${params.placeId}`

  for (const room of rooms) {
    const amount = await countDevicesForRoom(room.id)
    const registeredAmount = await countRegisteredDevicesForRoom(room.id)
    registered.push(registeredAmount)
    amounts.push(amount)
  }

  return (
    <div>
      <PageHeading title={place.name} backLink="/configuration" />
      {rooms.map((room, index) => {
        return (
          <ListElement
            key={index}
            header={room.name}
            subheader={amounts[index] + ' devices'}
            note={`${registered[index]} registered`}
            editLink={`${baseRoute}/edit?roomId=${room.id}`}
            detailLink={`${baseRoute}/${room.id}`}
          />
        )
      })}
      {/*device ListElementEmpty if rooms length is zero*/}
      {rooms.length === 0 && (
        <ListElementEmpty
          header="No rooms yet"
          subheader="Add a room to get started"
        />
      )}
      {/*  Create device button that is centered*/}
      <Link href={`${baseRoute}/edit`} className="flex justify-center px-1">
        <button className="submit-button">New Room</button>
      </Link>
    </div>
  )
}
