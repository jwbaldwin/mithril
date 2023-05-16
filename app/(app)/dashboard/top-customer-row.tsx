"use client"

import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { Brief } from '../../../types/brief';

export default function TopCustomerRow({ brief }: { brief: Brief }) {
  const [showCustomers, setShowCustomers] = useState(false)

  return (
    <>
      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          1.
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{`Your top 5 customers spent $${brief.top_customers.total_spent} last week`}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
          <button
            className="rounded bg-gray-900 px-3 py-2 shadow text-white"
            onClick={() => setShowCustomers(!showCustomers)}>
            View customers
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">Send a personalized reward</td>
      </tr>
      {showCustomers ?
        brief.top_customers.top_customers.map(({ customer, total_spent }: { customer: any, total_spent: number }) =>
        (
          <tr key={customer.id}>
            <td>
              <ArrowLongRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </td>
            <td className="text-sm text-gray-700 font-medium">{customer.email}</td>
            <td className="text-sm text-gray-700 font-semibold">
              ${total_spent}
            </td>
            <td></td>
          </tr>
        ))
        : null}
    </>
  )
}
