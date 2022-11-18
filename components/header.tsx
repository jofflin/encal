'use client'

import { useSession } from 'next-auth/react'
import { BiHome } from 'react-icons/bi'

export default function Header() {
  const session = useSession()
  // return header with text on the left and icon on the right

  if (!session) {
    return null
  }

  return (
    <header className="flex items-center justify-between bg-gray-800 p-4 text-gray-400 ">
      <h1 className="text-3xl font-light">Hi {session.data?.user?.name}</h1>
      <div className="flex items-center">
        <BiHome className="h-8 w-8" />
      </div>
    </header>
  )
  // return (
  //   <header className="bg-white shadow">
  //     <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
  //       <h1 className="text-3xl font-light">Hi {session.data?.user?.name}</h1>
  //     </div>
  //   </header>
  // )
}
