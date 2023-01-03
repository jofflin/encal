'use client'

import { signOut } from 'next-auth/react'
import PageHeading from '@components/page-heading'

export default function Settings() {
  // Create a styled page that is a list of links
  // Logout, Delete Account
  return (
    <div className="flex h-screen flex-col p-1">
      <PageHeading title="Settings" />
      {/*  Create device button that is centered*/}
      <button
        className="submit-button"
        onClick={() => {
          signOut()
        }}
      >
        Logout
      </button>
      <button
        className=" submit-button mt-2"
        onClick={() => {
          signOut()
        }}
      >
        Delete Account
      </button>
    </div>
  )
}
