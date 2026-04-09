import { type ReactElement } from 'react';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';
import HelpChat from '@/components/HelpChat';

/**
 * Root layout component that wraps all pages with consistent header and footer
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Header />
      {children}
      <Footer />
      <HelpChat />
    </Website>
  );
}
