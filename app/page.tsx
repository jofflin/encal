import { ChartData, ScaleChartOptions } from 'chart.js'
import ChartCard from '@components/chart-card'
import { getMyPlaces } from '@lib/place'
import {
  getPlaceConsumptions,
  mapPlaceConsumptionToChartData,
} from '@lib/consumption'
import PageHeading from '@components/page-heading'
import { DeepPartial } from 'react-hook-form'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

export default async function Home() {
  const places = await getMyPlaces()
  const x: {
    data: ChartData
    header: string
    subheader: string
    link: string
    priceText: string
    options: DeepPartial<ScaleChartOptions>
  }[] = []
  for (const place of places) {
    const data = await getPlaceConsumptions(place.id)
    const chartdata = mapPlaceConsumptionToChartData(data)
    x.push(chartdata)
  }
  console.log(x, places)

  return (
    <div>
      <PageHeading title="Places Consumption" />
      {x.map((d, i) => {
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
