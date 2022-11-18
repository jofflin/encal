import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getMyPlaces } from '@lib/place'
import ListElementEmpty from '@components/list-element-empty'

export default async function PlaceList() {
  const places = await getMyPlaces()

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading title="Your Places" />
      {places.map((place, index) => {
        return (
          <ListElement
            key={index}
            header={place.name}
            subheader={place.basePrice + 'Euro / month'}
            note={place.kwhPrice + 'Euro / kwh'}
            editLink={`configuration/place/edit?id=${place.id}`}
            detailLink={`configuration/place/${place.id}`}
          />
        )
      })}
      {/*add ListElementEmpty if places length is zero*/}
      {places.length === 0 && (
        <ListElementEmpty
          header="No places yet"
          subheader="Add a place to get started"
        />
      )}
      {/*  Create add button that is centered*/}
      <Link
        href={`configuration/place/edit`}
        className="flex justify-center px-1"
      >
        <button className="submit-button">New Place</button>
      </Link>
    </div>
  )
}
