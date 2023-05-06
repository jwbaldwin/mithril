import './globals.css';

import AnalyticsWrapper from './analytics';
import React from 'react';
import localFont from 'next/font/local'

export const metadata = {
  title: 'Kept - Engage at human scale',
  description:
    'See and engage your most valuable customers in an authentic way'
};
const etica = localFont({
  variable: "--font-etica",
  src: [
    {
      path: './font/LFTEticaMono-Light.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './font/LFTEticaMono-LightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: './font/LFTEticaMono-Book.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './font/LFTEticaMono-BookItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './font/LFTEticaMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './font/LFTEticaMono-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './font/LFTEticaMono-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './font/LFTEticaMono-SemiBold.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './font/LFTEticaMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './font/LFTEticaMono-Bold.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={`h-full bg-gray-50 antialiased font-sans ${etica.variable}`}>
      <body className="h-full">
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}

