'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function SignIn() {
  const router = useRouter()

  const callbackUrl = (useSearchParams()?.get('callbackUrl')) ?? "/dashboard"

  const [params, setParams] = useState({
    isSubmitting: false,
    email: "",
    password: "",
    error: ""
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setParams({ ...params, isSubmitting: true, error: "" })

    const response = await signIn('credentials', {
      redirect: false,
      email: params.email,
      password: params.password
    })
    if (response?.error) {
      setParams({ ...params, error: "Email or password was incorrect.", isSubmitting: false })
    } else {
      router.push(callbackUrl)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value })
  }


  return (
    <>
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            {params.error && <p className="text-sm mb-2 text-red-500">{params.error}</p>}
            <div className="space-y-3 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={params.email}
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={params.password}
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={params.isSubmitting}
                className="group relative flex w-full justify-center rounded-md bg-gray-900 py-3 px-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                {params.isSubmitting ? <svg className="animate-spin absolute left-[25%] sm:left-[30%] mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> : null}
                {params.isSubmitting ? <span>Signing in...</span> : <span>Sign in</span>}
              </button>
            </div>
          </form>
          <div className="flex flex-col text-center space-y-4 text-sm text-gray-500">
            <div>
              Need an account?
              <Link href="/register" className="ml-3  px-2 py-1 font-medium text-gray-600 rounded-md border-2 border-gray-600 hover:text-gray-700 hover:border-gray-700">
                Register
              </Link>
            </div>

            <div>
              Forgot your password?
              <a href="#" className="ml-3 font-medium underline text-gray-600 hover:text-gray-500">
                Reset it
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

