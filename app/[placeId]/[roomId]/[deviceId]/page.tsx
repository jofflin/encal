import {
  getDeviceConsumption,
  mapDeviceConsumptionToChartData,
} from '@lib/consumption'
import ChartCard from '@components/chart-card'

type Props = {
  params: {
    placeId: string
    roomId: string
    deviceId: string
  }
}

export default async function DeviceCalculation({ params }: Props) {
  const data = await getDeviceConsumption(params.deviceId)
  const chartdata = mapDeviceConsumptionToChartData(data)

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
