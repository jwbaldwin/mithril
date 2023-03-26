import '../globals.css';

import Nav from './nav';
import AnalyticsWrapper from '../analytics';
import { Suspense } from 'react';
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
    <>
      <AuthContext session={session}>
        <Suspense fallback="...">
          {/* @ts-expect-error Server Component */}
          <Nav />
        </Suspense>
        {children}
      </AuthContext>
    </>
  );
}

