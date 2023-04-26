import '../globals.css';

import AnalyticsWrapper from '../analytics';
import { getServerSession } from "next-auth/next"
import AuthContext from '../auth-context';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { NextAuthOptions } from 'next-auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions as NextAuthOptions)

  return (
    <>
      <AuthContext session={session}>
        {children}
      </AuthContext>
      <AnalyticsWrapper />
    </>
  );
}

