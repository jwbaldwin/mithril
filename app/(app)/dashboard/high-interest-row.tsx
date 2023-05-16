"use client"

import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import { Brief } from '../../../types/brief';

export default function HighInterestRow({ brief }: { brief: Brief }) {
  const [showProducts, setShowProducts] = useState(false)

  return (
    <>

      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          3.
        </td>
        {brief.high_interest_products.products.length == 1 ?
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{`Your top product this week was "${brief.high_interest_products.products[0].title}"`}</td>
          :
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{`Your top products this week were ordered ${brief.high_interest_products.quantity} times`}</td>
        }
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="rounded bg-gray-900 px-3 py-2 shadow text-white">
            View stats
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">Consider adjusting sourcing accordingly</td>
      </tr>
      {showProducts ?
        brief.high_interest_products.products.map((product) =>
        (
          <tr key={product.id}>
            <td>
              <ArrowLongRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </td>
            <td className="text-sm text-gray-700 font-medium">{brief.high_interest_products.quantity} x {product.title}</td>
            <td className="text-sm text-gray-700 font-semibold">added {format(parseISO(product.published_at), 'MMMM d, yyyy')}</td>
            <td></td>
          </tr>
        ))
        : null}
    </>
  )
}
