import './global.css';

export const metadata = {
  title: 'ViWaah | AI Wedding Portraits',
  description:
    'Transform ordinary couple photos into cinematic wedding portraits with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
