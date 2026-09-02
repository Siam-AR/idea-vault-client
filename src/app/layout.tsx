import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteTitleManager from '@/components/RouteTitleManager';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { ToastProvider } from '@/lib/toast-context';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IdeaVault - Startup Idea Sharing Platform',
  description: 'Share innovative startup ideas, explore ideas posted by others, and engage through comments and discussions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const themeInitScript = `
      (() => {
        try {
          // Temporarily force light mode
          const theme = 'light';
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.colorScheme = theme;
        } catch (error) {}
      })();
    `;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--surface-base)] text-[var(--text-primary)] transition-colors duration-200" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        
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
