import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PsychCombo Admin',
  description: 'Content management for PsychCombo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
