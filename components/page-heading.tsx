import Link from 'next/link'
import { BiChevronLeft } from 'react-icons/bi'

type Props = {
  title: string
  backLink?: string
}

export default function PageHeading({ title, backLink }: Props) {
  //  Create heading for mobile devices with back button and title

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center border-b border-gray-200 bg-white py-3 px-4 md:hidden">
      {backLink ? (
        <div className="flex w-full items-center justify-between">
          <Link
            href={backLink}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <BiChevronLeft className={'h-10 w-10'} />
          </Link>
          <h1 className="text-xl font-bold text-gray-700">{title}</h1>
          <div className="h-10 w-10" />
        </div>
      ) : (
        <div className=" flex h-10 w-full items-center justify-center">
          <h1 className="text-xl font-bold text-gray-700">{title}</h1>
        </div>
      )}
    </div>
  )
  // return (
  //   <div className="mx-auto my-4 flex h-24 w-full flex-col items-center justify-center border-b border-gray-200 bg-white px-4 sm:flex-row sm:px-6">
  //     <div className="mx-auto flex h-24 w-full items-center justify-center sm:w-1/2">
  //       <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
  //         {title}
  //       </h1>
  //     </div>
  //   </div>
  // )
}
