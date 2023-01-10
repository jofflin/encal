'use client'

import { Line } from 'react-chartjs-2'

import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScaleChartOptions,
  Title,
  Tooltip,
} from 'chart.js'
import { DeepPartial } from 'react-hook-form'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
type Props = {
  data: ChartData
  options: DeepPartial<ScaleChartOptions>
}

export default function LineChart({ data, options }: Props) {
  return (
    // @ts-ignore
    <Line data={data} options={options} height="40vh" width="80vw" />
  )
}
