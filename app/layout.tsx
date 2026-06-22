import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'NovaMint Creative — Premium Digital Products',
    template: '%s | NovaMint Creative',
  },
  description: 'Premium digital products for modern creators.',
};

async function getSettings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://novamintcreative.vercel.app'}/api/settings`,
      {  cache: 'no-store' }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const gaId = settings.google_analytics_id;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {settings.favicon_url && (
          <link rel="icon" href={settings.favicon_url} />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-cream text-stone-800 antialiased`}
      >
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}