import {
  getPlaceConsumptions,
  mapRoomsConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'
import PageHeading from '@components/page-heading'
import { getPlaceById } from '@lib/place'

type Props = {
  params: {
    placeId: string
  }
}

export default async function PlaceCalculation({ params }: Props) {
  const data = await getPlaceConsumptions(params.placeId)
  const place = await getPlaceById(params.placeId)
  const chartdata = mapRoomsConsumptionToChartData(data)

  // chartdata.forEach((data) => {
  //   console.log(data.header)
  //   if (data.header === 'Consumption for Storage Room') {
  //     data.priceText = '2.80 €'
  //     //   change data
  //     data.data.datasets[0].data = [0, 1, 0, 1, 0, 2, 0]
  //     data.data.datasets[1].data = [0, 2, 0, 0, 0, 1, 1]
  //   }
  // })
  // chartdata = [chartdata[1]]

  return (
    <div>
      <PageHeading title={`${place.name} Consumption`} backLink="/" />
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
