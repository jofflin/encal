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
type Props = {
  data: ChartData
}

export default function LineChart({ data }: Props) {
  // @ts-ignore
  return <Line datasetIdKey="0" data={data} height="40vh" width="80vw" />;
}
