import '../globals.css';

import AnalyticsWrapper from '../analytics';
import { getServerSession } from "next-auth/next"
import AuthContext from '../auth-context';

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
  const session = await getServerSession()

  return (
    <html lang="en" className="h-full bg-gray-50 antialiased">
      <body className="h-full">
        <AuthContext session={session}>
          {children}
        </AuthContext>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}

