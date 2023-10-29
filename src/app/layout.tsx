import '../styles/globals.css'

export const metadata = {
  title: 'Jandee',
  description: 'Embed a GitHub contribution chart into any Notion document.',
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
