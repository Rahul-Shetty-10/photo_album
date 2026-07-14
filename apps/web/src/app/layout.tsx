import './global.css';

import { Toaster } from 'sonner';

import { ThemeToggle } from '@/components/theme-toggle';
import { AuthProvider } from '@/features/auth/auth-provider';

export const metadata = {
  title: 'ALANKAAR | Photography Workflow Platform',
  description:
    'AI-powered photography workflows for photographers, studios, and creative professionals.',
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
        <AuthProvider>
          {children}
          <ThemeToggle />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
