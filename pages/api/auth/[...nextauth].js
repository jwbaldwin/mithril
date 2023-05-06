import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "../../../lib/api"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' }
      },
      async authorize(credentials, _req) {
        if (!credentials) { return null; }
        try {
          const response = await api.post("session", { user: { email: credentials.email, password: credentials.password } })
          if (response.status == 200) {
            return response.data.data
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          accessToken: user.access_token,
          refreshToken: user.renewal_token,
          accessTokenExpires: Math.floor(Date.now() + (60 * 30 * 1000)), // 30 minutes from now
          user: user.user
        }
      }

      if (Date.now() >= token.accessTokenExpires) {
        const response = await api.post("session/renew", {}, { headers: { 'Authorization': `${token.refreshToken}` } })

        console.log("tok", response.data.data.access_token)
        if (response.status == 200) {
          const data = response.data.data
          return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.renewal_token,
            accessTokenExpires: Math.floor(Date.now() + (60 * 30 * 1000)), // 30 minutes from now
          }
        }
      } else {
        return token
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.user = token.user;

      return session;
    },
  },
}

export default NextAuth(authOptions)
