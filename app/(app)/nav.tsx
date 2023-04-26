import Navbar from './navbar';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth].js'
import React from 'react';

export default async function Nav() {
  const session = await getServerSession(authOptions as NextAuthOptions)
  return <Navbar user={session?.user} />;
}
