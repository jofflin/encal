import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getRoomById } from '@lib/room'
import { Device, Room } from '@prisma/client'
import { getDevicesForRoom } from '@lib/device'
import ListElementEmpty from '@components/list-element-empty'

type Props = {
  params: {
    placeId: string
    roomId: string
  }
}

export default async function RoomDetails({ params }: Props) {
  const devices: Device[] = await getDevicesForRoom(params.roomId)
  const room: Room = await getRoomById(params.roomId)
  const defaultRoute = `/configuration/${params.placeId}/${params.roomId}`

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading
        title={room.name}
        backLink={`/configuration/${params.placeId}`}
      />
      {devices.map((device, index) => {
        return (
          <ListElement
            key={index}
            header={device.name}
            subheader={`Registration Code: ${device.oneTimeCode}`}
            note={`Status: ${
              device.deviceRegistered ? 'Registered' : 'Not Registered'
            }`}
            editLink={`${defaultRoute}/edit?deviceId=${device.id}`}
            // detailLink={`${defaultRoute}/${device.id}`}
          />
        )
      })}

      {/*device ListElementEmpty if rooms length is zero*/}
      {devices.length === 0 && (
        <ListElementEmpty
          header="No devices yet"
          subheader="Add a device to get started"
        />
      )}
      {/*  Create device button that is centered*/}
      <Link href={`${defaultRoute}/edit`} className="flex justify-center px-1">
        <button className="submit-button">New Device</button>
      </Link>
    </div>
  )
}
