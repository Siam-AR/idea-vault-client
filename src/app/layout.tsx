import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteTitleManager from '@/components/RouteTitleManager';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { ToastProvider } from '@/lib/toast-context';
import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IdeaVault - Startup Idea Sharing Platform',
  description: 'Share innovative startup ideas, explore ideas posted by others, and engage through comments and discussions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full container mx-auto" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const storageKey = 'ideaVaultTheme';
              const savedTheme = window.localStorage.getItem(storageKey);
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
              document.documentElement.dataset.theme = theme;
              document.documentElement.style.colorScheme = theme;
            } catch (error) {}
          })();`}
        </Script>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <RouteTitleManager />
              <Navbar />
              {children}
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
