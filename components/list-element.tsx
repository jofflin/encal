import { BiChevronRight, BiEditAlt } from 'react-icons/bi'
import Link from 'next/link'

type Props = {
  header: string
  subheader: string
  note: string
  editLink: string
  detailLink?: string
}

export default function ListElement({
  editLink,
  detailLink,
  note,
  header,
  subheader,
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
          <p className="text-gray-500">{note}</p>
        </div>
        {/* Create two icons*/}
        <div className="flex flex-row">
          <Link href={editLink}>
            <BiEditAlt className="h-8 w-8 justify-center" />
          </Link>
          {detailLink && (
            <Link href={detailLink}>
              <BiChevronRight className="h-8 w-8 justify-center" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
