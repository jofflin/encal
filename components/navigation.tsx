// Create Navigation component that is located at the bottom of the page like an mobile app

// Path: components/navigation.tsx

import { unstable_getServerSession } from 'next-auth'
import { BiBarChart, BiCog, BiListUl, BiUser } from 'react-icons/bi'
import Link from 'next/link'

export default async function Navigation() {
  const session = await unstable_getServerSession()
  // change color when active
  // const isActive = (route: string) => {
  // if (route === router.pathname) {
  //   return 'text-teal-500'
  // } else {
  //   return 'text-gray-500'
  // }
  // }

  if (!session?.user?.email) {
    return null
  }

  // Create bottom navigation menu with Home, Insights, Profile, Settings, and Logout
  return (
    <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 justify-between">
          <Link
            href="/"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiBarChart className="h-8 w-8" />
          </Link>
          <Link
            href="/configuration"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiListUl className="h-8 w-8" />
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiCog className="h-8 w-8" />
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiUser className="h-8 w-8" />
          </Link>
        </div>
      </div>
    </div>
  )
}
