import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react" // Fixed import - Suspense comes from react, not next/navigation
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans", // Fixed font variable to match globals.css
})

export const metadata: Metadata = {
  title: "VanDisha - Forest Rights Management System",
  description: "AI-powered Decision Support System for Forest Rights Act claims",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
