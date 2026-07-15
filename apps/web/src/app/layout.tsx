import './global.css';

import { Toaster } from 'sonner';

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
            __html:
              "try{var t=localStorage.getItem('alankar-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}",
          }}
        />
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
