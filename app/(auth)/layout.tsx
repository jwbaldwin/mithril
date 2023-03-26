import '../globals.css';

import AnalyticsWrapper from '../analytics';
import { getServerSession } from "next-auth/next"
import AuthContext from '../auth-context';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession()

  return (
    <>
      <AuthContext session={session}>
        {children}
      </AuthContext>
      <AnalyticsWrapper />
    </>
  );
}

