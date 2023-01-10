import {
  getDeviceConsumption,
  mapDeviceConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'
import PageHeading from '@components/page-heading'
import { getPlaceById } from '@lib/place'

type Props = {
  params: {
    placeId: string
    roomId: string
    deviceId: string
  }
}

export default async function DeviceCalculation({ params }: Props) {
  const data = await getDeviceConsumption(params.deviceId)
  const place = await getPlaceById(params.placeId)
  const chartdata = mapDeviceConsumptionToChartData(data, place.kwhPrice)

  // chartdata.forEach((data) => {
  //   console.log(data.header)
  //   if (
  //     data.header === 'Consumption for Dryer' &&
  //     data.subheader === 'Last 24 hours'
  //   ) {
  //     //   change data
  //     data.priceText = '0.00 €'
  //     data.data.datasets[0].data = [
  //       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     ]
  //   }
  //   if (
  //     data.header === 'Consumption for Dryer' &&
  //     data.subheader === 'Last 7 days'
  //   ) {
  //     data.priceText = '1.40 €'
  //     //   change data
  //     data.data.datasets[0].data = [0, 1, 0, 1, 0, 2, 0]
  //   }
  // })

  return (
    <div>
      <PageHeading
        title={`${data.deviceLabel} Consumption`}
        backLink={`/${params.placeId}/${params.roomId}`}
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
