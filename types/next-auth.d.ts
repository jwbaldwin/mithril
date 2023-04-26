import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string,
    refreshToken: string,
    accessTokenExpires: Date,
    user: {
      /** The user's name. */
      id: number,
      name: string,
      email: string
    }
  }
}
