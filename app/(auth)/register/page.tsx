'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../../../lib/api';
import { signIn } from 'next-auth/react';

export default function Regiser() {
  const router = useRouter()


  const [params, setParams] = useState({
    isSubmitting: false,
    isLoggingIn: false,
    isPasswordVisible: false,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: ""
  });

  const togglePasswordVisibility = () => {
    setParams({ ...params, isPasswordVisible: !params.isPasswordVisible })
  }

  const callbackUrl = (useSearchParams()?.get('callbackUrl')) ?? "/dashboard"
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setParams({ ...params, isSubmitting: true })

    const response = await api.post('registration', {
      user: {
        name: params.name,
        email: params.email,
        password: params.password,
        password_confirmation: params.confirmPassword
      }
    })
    if (response?.status != 201) {
      setParams({ ...params, error: response.statusText, isSubmitting: false })
    } else {
      setParams({ ...params, isSubmitting: true, isLoggingIn: true })
      const response = await signIn('credentials', {
        redirect: false,
        email: params.email,
        password: params.password
      })
      if (response?.error) {
        setParams({ ...params, error: response.error, isSubmitting: false })
      } else {
        router.push(callbackUrl)
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value })
  }


  return (
    <>
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image src="/static/logo.svg" alt="kept" width="120" height="120" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-3 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Full name
                </label>
                <input
                  id="full-name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  value={params.name}
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Full name"
                />
              </div>
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
              <div className="relative flex items-center">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={params.isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  value={params.password}
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
                <button
                  tabIndex={-1}
                  className="flex absolute inset-y-0 right-0 items-center px-4"
                  onClick={() => togglePasswordVisibility()}>
                  {params.isPasswordVisible ?
                    <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                    : <EyeIcon className="h-5 w-5 text-gray-600" />}
                </button>
              </div>
              <div className="relative flex items-center">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={params.isPasswordVisible ? "text" : "password"}
                  value={params.confirmPassword}
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Confirm password"
                />
                <button
                  tabIndex={-1}
                  className="flex absolute inset-y-0 right-0 items-center px-4"
                  onClick={() => togglePasswordVisibility()}>
                  {params.isPasswordVisible ?
                    <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                    : <EyeIcon className="h-5 w-5 text-gray-600" />}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-gray-900 py-3 px-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                {params.isSubmitting ? <svg className="animate-spin absolute left-[25%] sm:left-[30%] mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> : null}
                {!params.isSubmitting ?
                  <span>Register</span>
                  : params.isLoggingIn ?
                    <span>Signing in...</span>
                    : <span>Registering...</span>
                }


              </button>
            </div>
          </form>
          <div className="flex flex-col text-center space-y-4 text-sm text-gray-500">
            <div>
              Have an account?
              <Link href="/signin" className="ml-3  px-2 py-1 font-medium text-gray-600 rounded-md border-2 border-gray-600 hover:text-gray-700 hover:border-gray-700">
                Sign in
              </Link>
            </div>

            <div>
              View our <Link href="/policies/privacy" className="font-medium underline text-gray-600 hover:text-gray-500">privacy policy</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

