import { getRoomsForPlace } from '@lib/room'

type Props = {
  params: {
    placeId: string
  }
}

export default async function Configuration({ params }: Props) {
  const rooms = await getRoomsForPlace(params.placeId)

  console.log(rooms)

  return <p>Test</p>
}

const sampleData: { title: string; description: string; note: string }[] = [
  {
    title: 'Device 1',
    description: 'Description 1',
    note: 'Note 1',
  },
  {
    title: 'Device 2',
    description: 'Description 2',
    note: 'Note 2',
  },
  {
    title: 'Device 3',
    description: 'Description 3',
    note: 'Note 3',
  },
]

const place: { title: string; description: string; note: string } = {
  title: 'Place 1',
  description: 'Description 1',
  note: '3 Rooms (15 Devices)',
}
