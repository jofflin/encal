'use client'

import { Line } from 'react-chartjs-2'

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

const data: ChartData = {
  labels,

  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 11, 12, 13, 14, 15, 116, 17],
      borderColor: '#115e59',
      backgroundColor: '#ccfbf1',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4, 5, 6, 7],
      borderColor: '#fb923c',
      backgroundColor: '#ffedd5',
    },
  ],
}

export default function Home() {
  return (
    <div>
      <Line datasetIdKey="0" data={data} height="40vh" width="80vw" />
    </div>
  )
}
