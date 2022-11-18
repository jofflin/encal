type Props = {
  header: string
  subheader: string
}

export default function ListElementEmpty({ header, subheader }: Props) {
  return (
    <div className="mx-1 my-2 flex flex-col rounded-md bg-white p-4 shadow-md">
      <h1 className="mx-auto text-xl font-bold">{header}</h1>
      <p className="mx-auto text-gray-500">{subheader}</p>
    </div>
  )
}
