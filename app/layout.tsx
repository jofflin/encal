import './globals.css'
import React from 'react'
import { Providers } from './providers'
import { unstable_getServerSession } from 'next-auth'
import Navigation from '@components/navigation'
import Header from '@components/header'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await unstable_getServerSession()

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Providers session={session}>
          <div className="mt-20" />
          {/*// @ts-ignore*/}
          <Header />

          {children}
          {/*// @ts-ignore*/}
          <Navigation />
          <div className="mb-20"></div>
        </Providers>
      </body>
    </html>
  )
}
