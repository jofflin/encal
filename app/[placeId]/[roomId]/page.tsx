import {
  getRoomConsumption,
  mapDevicessConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'
import PageHeading from '@components/page-heading'

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
  // chartdata.forEach((data) => {
  //   console.log(data.header)
  //   if (data.header === 'Consumption for Dryer') {
  //     //   change data
  //     data.priceText = '1.40 €'
  //     data.data.datasets[0].data = [0, 1, 0, 1, 0, 2, 0]
  //   }
  //   if (data.header === 'Consumption for Washing Machine') {
  //     data.priceText = '1.40 €'
  //     //   change data
  //     data.data.datasets[0].data = [0, 2, 0, 0, 0, 1, 1]
  //   }
  // })

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
