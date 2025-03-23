import { Geist, Geist_Mono } from 'next/font/google';

import { MobileNav } from '@/components/common/mobile-nav';
import Nav from '@/components/common/nav';
import { ApolloClientProvider } from '@/components/providers/apollo-provider';
import { PrivyAuthProvider } from '@/components/providers/privy-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TokenProvider } from '@/hooks/useTokenContext';
import type { Metadata } from 'next';
import './globals.css';

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
  description: 'Bet on what Trump will say or do next on the Trump.fun prediction market platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PrivyAuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TokenProvider>
              <div className='mx-auto max-w-screen-xl'>
                <ApolloClientProvider>
                  <Nav />
                  <div className='pt-16 md:pt-20'>{children}</div>
                  <Toaster />
                  <MobileNav />
                </ApolloClientProvider>
              </div>
            </TokenProvider>
          </ThemeProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
