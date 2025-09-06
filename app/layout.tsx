import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import 'leaflet/dist/leaflet.css';
import './globals.css'

export const metadata: Metadata = {
  title: 'VanDisha - Forest Rights Atlas',
  description: 'Ministry of Tribal Affairs - Digital Forest Rights Management System',
  generator: 'Lord Kurian',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
