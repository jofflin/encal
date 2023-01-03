import { BiChevronRight } from 'react-icons/bi'
import Link from 'next/link'
import LineChart from '@components/line-chart'
import { ChartData } from 'chart.js'

type Props = {
  header: string
  data: ChartData
  subheader: string
  detailLink?: string
}

export default function ChartCard({
  detailLink,
  header,
  subheader,
  data,
}: Props) {
  // Create list element with title, description and note that is styled with tailwind
  // The list element is a card with a title, description and note
  // The title, description and note are below each other
  // On the right side there is a button to edit and a button to delete the list element
  return (
    <div className="mx-1 my-2 flex flex-col rounded-md bg-white p-4 shadow-md">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{header}</h1>
          <p className="text-gray-500">{subheader}</p>
        </div>
        {detailLink ? (
          <div className="flex flex-row">
            <Link href={detailLink}>
              <BiChevronRight className="h-8 w-8 justify-center" />
            </Link>
          </div>
        ) : null}
      </div>
      <LineChart data={data} />
    </div>
  )
}
