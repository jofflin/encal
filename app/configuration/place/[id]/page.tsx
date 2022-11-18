import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getPlaceById } from '@lib/place'
import { getRoomsForPlace } from '@lib/room'
import { Place, Room } from '@prisma/client'
import ListElementEmpty from '@components/list-element-empty'

type Props = {
  params: {
    id: string
  }
}

export default async function PlaceDetails({ params }: Props) {
  const rooms: Room[] = await getRoomsForPlace(params.id)
  const place: Place = await getPlaceById(params.id)

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading title={place.name} backLink="/configuration" />
      {rooms.map((room, index) => {
        return (
          <ListElement
            key={index}
            header={room.name}
            subheader={'TODO Devices'}
            note={'TODO Percent'}
            editLink={`configuration/room/edit?roomId=${room.id}&placeId=${place.id}`}
            detailLink={`configuration/room/${room.id}`}
          />
        )
      })}
      {/*add ListElementEmpty if rooms length is zero*/}
      {rooms.length === 0 && (
        <ListElementEmpty
          header="No rooms yet"
          subheader="Add a room to get started"
        />
      )}
      {/*  Create add button that is centered*/}
      <Link
        href={`configuration/room/edit?placeId=${place.id}`}
        className="flex justify-center px-1"
      >
        <button className="submit-button">New Room</button>
      </Link>
    </div>
  )
}
