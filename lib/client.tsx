import { getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../pages/api/auth/[...nextauth]";

async function client(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!; // get the base URL from environment variable
  const session = await getServerSession(authOptions as NextAuthOptions)

  if (session) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `${session.accessToken}`,
    };
  }

  const response = await fetch(`${baseUrl}${endpoint}`, options);

  if (response.status == 401) {
    return redirect("/signin")
  }

  return response;
}

export default client;
