import {
  getRoomConsumption,
  mapDevicessConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'

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

  return (
    <div>
      {chartdata.map((d, i) => {
        return (
          <ChartCard
            key={i}
            header={d.header}
            subheader={d.subheader}
            detailLink={d.link}
            data={d.data}
          />
        )
      })}
    </div>
  )
}
