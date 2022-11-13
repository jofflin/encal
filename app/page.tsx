import { unstable_getServerSession } from 'next-auth'

export default async function Home() {
  const session = await unstable_getServerSession()
  console.log(session)
  return <h1 className="text-3xl font-light">Home</h1>
}
