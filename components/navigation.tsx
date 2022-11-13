// Create Navigation component that is located at the bottom of the page like an mobile app

// Path: components/navigation.tsx

import { unstable_getServerSession } from 'next-auth'
import { BiCog, BiHome, BiPieChart, BiUser } from 'react-icons/bi'
import Link from 'next/link'

export default function Navigation() {
  const session = unstable_getServerSession()

  // Create bottom navigation menu with Home, Insights, Profile, Settings, and Logout
  return (
    <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 justify-between">
          <Link
            href="/"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiHome className="h-5 w-5" />
            <span className="ml-2">Home</span>
          </Link>
          <Link
            href="/insights"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiPieChart className="h-5 w-5" />
            <span className="ml-2">Insights</span>
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiUser className="h-5 w-5" />
            <span className="ml-2">Profile</span>
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
          >
            <BiCog className="h-5 w-5" />
            <span className="ml-2">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
