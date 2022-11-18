import { getPlaceById } from '@lib/place'
import ConfigurePlace from '@components/configure-place'

type Props = {
  searchParams: {
    id: string
  }
}

export default async function PlaceEdit({ searchParams }: Props) {
  if (!searchParams.id) {
    return <ConfigurePlace />
  }
  const place = await getPlaceById(searchParams.id)

  return <ConfigurePlace place={place} />
}
