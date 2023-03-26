"use client";

import { SessionProvider, SessionProviderProps } from 'next-auth/react';

export default function AuthContext(props: SessionProviderProps) {
  return <SessionProvider {...props} />;
}
