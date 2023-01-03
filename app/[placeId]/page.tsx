import {
  getPlaceConsumptions,
  mapRoomsConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'

type Props = {
  params: {
    placeId: string
  }
}

export default async function PlaceCalculation({ params }: Props) {
  const data = await getPlaceConsumptions(params.placeId)
  const chartdata = mapRoomsConsumptionToChartData(data)

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
