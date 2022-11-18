'use client'

import { signOut } from 'next-auth/react'

export default function Settings() {
  // Create mobile page that is a list of links
  // Logout, Delete Account
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-2 text-center">
        <h1 className="text-6xl font-bold">Settings</h1>
        <p className="mt-3 text-2xl">Manage your account</p>
        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <button
            onClick={() => signOut()}
            className="m-2 w-1/2 rounded-lg border-2 border-gray-300 p-6 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <h3 className="text-2xl font-semibold">Logout</h3>
            <p className="mt-4 text-lg text-gray-500">
              Logout of your account and return to the login page.
            </p>
          </button>
          <button
            // onClick={() => signOut()}
            className="m-2 w-1/2 rounded-lg border-2 border-gray-300 p-6 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <h3 className="text-2xl font-semibold">Delete Account</h3>
            <p className="mt-4 text-lg text-gray-500">
              Delete your account and all associated data.
            </p>
          </button>
        </div>
      </main>
    </div>
  )
}
