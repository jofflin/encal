import ListElement from '@components/list-element'
import PageHeading from '@components/page-heading'
import Link from 'next/link'
import { getRoomById } from '@lib/room'
import { Device, Room } from '@prisma/client'
import { getDevicesForRoom } from '@lib/device'
import ListElementEmpty from '@components/list-element-empty'

type Props = {
  params: {
    id: string
  }
}

export default async function RoomDetails({ params }: Props) {
  const devices: Device[] = await getDevicesForRoom(params.id)
  const room: Room = await getRoomById(params.id)

  return (
    <div>
      {/*Create heading with title*/}
      <PageHeading title={room.name} />
      {devices.map((device, index) => {
        return (
          <ListElement
            key={index}
            header={device.name}
            subheader={'TODO Consumption'}
            note={'TODO Percent'}
            editLink={`configuration/device/edit?deviceId=${device.id}&roomId=${room.id}`}
            detailLink={`configuration/device/${device.id}`}
          />
        )
      })}

      {/*add ListElementEmpty if rooms length is zero*/}
      {devices.length === 0 && (
        <ListElementEmpty
          header="No devices yet"
          subheader="Add a device to get started"
        />
      )}
      {/*  Create add button that is centered*/}
      <Link
        href={`configuration/device/edit?roomId=${room.id}`}
        className="flex justify-center px-1"
      >
        <button className="submit-button">New Device</button>
      </Link>
    </div>
  )
}
