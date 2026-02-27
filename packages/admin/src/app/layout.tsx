import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'PsychCombo Admin',
  description: 'Content management for PsychCombo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
