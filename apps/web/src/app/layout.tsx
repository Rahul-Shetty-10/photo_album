import './global.css';

import { ThemeToggle } from '@/components/theme-toggle';

export const metadata = {
  title: 'ALANKAR | AI Wedding Portraits',
  description:
    'Transform ordinary couple photos into cinematic wedding portraits with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.classList.toggle('dark',localStorage.getItem('alankar-theme')==='dark')}catch(e){}",
          }}
        />
        {children}
        <ThemeToggle />
      </body>
    </html>
  )
}
