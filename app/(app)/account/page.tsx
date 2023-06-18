'use client'

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FormEvent, useState } from "react";
import api from "../../../lib/api"

export default function Account() {

  const [params, setParams] = useState({
    isUpdated: false,
    isSubmitting: false,
    current_password: "",
    password: "",
    password_confirmation: "",
    error: ""
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setParams({ ...params, isSubmitting: true })

    api.put('session', {
      user: {
        current_password: params.current_password,
        password: params.password,
        password_confirmation: params.password_confirmation
      }
    }).then(response => {
      setParams({ ...params, isSubmitting: false, error: "", isUpdated: true })
    }).catch(error => {
      setParams({ ...params, isSubmitting: false, error: "Your confirmation or current password was incorrect." })
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value })
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="divide-y divide-gray-800/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-800">Change password</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Update your password associated with your account.
            </p>
          </div>

          <form className="md:col-span-2" onSubmit={handleSubmit} method="PUT">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                {params.error && <p className="text-sm mb-2 text-red-500">{params.error}</p>}
                {params.isUpdated &&
                  <div className="rounded-md bg-green-50 border border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Password updated</h3>
                      </div>
                    </div>
                  </div>}
                <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-800">
                  Current password
                </label>
                <div className="mt-2">
                  <input
                    id="current-password"
                    name="current_password"
                    type="password"
                    value={params.current_password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-gray-800/5 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-800/10 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-800">
                  New password
                </label>
                <div className="mt-2">
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    value={params.password}
                    onChange={handleChange}
                    autoComplete="password"
                    className="block w-full rounded-md border-0 bg-gray-800/5 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-800/10 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-800">
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="password_confirmation"
                    type="password"
                    value={params.password_confirmation}
                    onChange={handleChange}
                    autoComplete="password_confirmation"
                    className="block w-full rounded-md border-0 bg-gray-800/5 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-800/10 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
