import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartCard from '@components/chart-card'
import { getMyPlaces } from '@lib/place'
import {
  getPlaceConsumptions,
  mapPlaceConsumptionToChartData,
} from '@lib/consumption'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
  Title,
  Tooltip,
  Legend
)

function createChartData(
  labels: string[]
): { data: ChartData; header: string; subheader: string; link: string }[] {
  return labels.map((l) => {
    return {
      header: l,
      subheader: '2 Rooms, 3 Devices',
      link: '',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],

        datasets: [
          {
            label: 'Main Room',
            data: [10, 11, 12, 13, 14, 15, 116, 17],
            borderColor: '#115e59',
            backgroundColor: '#ccfbf1',
          },
          {
            label: 'Storage Room',
            data: [1, 2, 3, 4, 5, 6, 7],
            borderColor: '#fb923c',
            backgroundColor: '#ffedd5',
          },
        ],
      },
    }
  })
}

export default async function Home() {
  const places = await getMyPlaces()
  const x: {
    data: ChartData
    header: string
    subheader: string
    link: string
  }[] = []
  places.forEach(async (place) => {
    const consumptions = await getPlaceConsumptions(place.id)
    const data = mapPlaceConsumptionToChartData(consumptions)
    x.push(data)
  })

  const data = await getPlaceConsumptions(places[0].id)
  const chartdata = mapPlaceConsumptionToChartData(data)
  console.log(data)

  return (
    <div>
      {x.map((d, i) => {
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
