import {
  getRoomConsumption,
  mapDevicessConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'
import PageHeading from '@components/page-heading'
import { getPlaceById } from '@lib/place'

type Props = {
  params: {
    placeId: string
    roomId: string
  }
}

export default async function RoomCalculation({ params }: Props) {
  const data = await getRoomConsumption(params.roomId)
  const chartdata = mapDevicessConsumptionToChartData(
    `${params.placeId}/${params.roomId}`,
    data
  )
  const place = await getPlaceById(params.placeId)
  // const

  return (
    <div>
      <PageHeading
        title={`${data.roomLabel} Consumption`}
        backLink={`/${params.placeId}`}
      />
      {chartdata.map((d, i) => {
        return (
          <ChartCard
            key={i}
            header={d.header}
            subheader={d.subheader}
            detailLink={d.link}
            data={d.data}
            priceText={d.priceText}
            options={d.options}
          />
        )
      })}
    </div>
  )
}
