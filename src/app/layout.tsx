import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { PrivyAuthProvider } from '@/components/providers/privy-provider';
import './globals.css';
import Nav from '@/components/common/nav';
import { MobileNav } from '@/components/common/mobile-nav';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Trump.fun - Predict The Donald's Next Move",
  description:
    'Bet on what Trump will say or do next on the Trump.fun prediction market platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyAuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='mx-auto max-w-screen-xl'>
              <Nav />
              {children}
              <MobileNav />
            </div>
          </ThemeProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
