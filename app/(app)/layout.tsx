import '../globals.css';

import Nav from './nav';
import React from 'react';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next'
import AuthContext from '../auth-context';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { NextAuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Kept - Engage at human scale',
  description:
    'See and engage your most valuable customers in an authentic way'
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const session = await getServerSession(authOptions as NextAuthOptions)

  if (session == null) {
    return redirect("/signin")
  } else {
    return (
      <>
        <AuthContext session={session}>
          <Suspense fallback="loading...">
            {/* @ts-expect-error Server Component */}
            <Nav />
          </Suspense>
          {children}
        </AuthContext>
      </>
    );
  }
}

