import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getMyPlaces } from '@lib/place'
import ListElementEmpty from '@components/list-element-empty'
import { countDevicesAndRoomsForPlace } from '@lib/counting'

export default async function PlaceList() {
  const places = await getMyPlaces()

  const amounts: { devicesAmount: number; roomsAmount: number }[] = []

  for (const place of places) {
    const amount = await countDevicesAndRoomsForPlace(place.id)
    amounts.push(amount)
  }

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading title="Your Places" />
      {places.map((place, index) => {
        return (
          <ListElement
            key={index}
            header={place.name}
            subheader={`${place.basePrice}€/month & ${
              place.kwhPrice / 100
            }€/kwh`}
            note={`${amounts[index].roomsAmount} rooms & ${amounts[index].devicesAmount} devices`}
            editLink={`configuration/edit?id=${place.id}`}
            detailLink={`configuration/${place.id}`}
          />
        )
      })}
      {/*device ListElementEmpty if places length is zero*/}
      {places.length === 0 && (
        <ListElementEmpty
          header="No places yet"
          subheader="Add a place to get started"
        />
      )}
      {/*  Create device button that is centered*/}
      <Link href={`configuration/edit`} className="flex justify-center px-1">
        <button className="submit-button">New Place</button>
      </Link>
    </div>
  )
}
