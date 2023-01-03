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
