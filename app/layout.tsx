import './globals.css';

import AnalyticsWrapper from './analytics';

export const metadata = {
  title: 'Kept - Engage at human scale',
  description:
    'See and engage your most valuable customers in an authentic way'
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="h-full bg-gray-50 antialiased">
      <body className="h-full">
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}

