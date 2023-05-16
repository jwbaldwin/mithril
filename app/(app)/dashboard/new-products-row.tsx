"use client"

import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import { Brief } from '../../../types/brief';

var pluralize = require('pluralize')

export default function NewProductsRow({ brief }: { brief: Brief }) {
  const [showProducts, setShowProducts] = useState(false)

  return (
    <>
      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          2.
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{`${brief.new_products.length} new ${pluralize("product", brief.new_products.length)} was published to your Shopify site`}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
          <button
            className="rounded bg-gray-900 px-3 py-2 shadow text-white"
            onClick={() => setShowProducts(!showProducts)}>
            View products
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">Consider a colleciton announcement email</td>
      </tr>
      {showProducts ?
        brief.new_products.map((product) =>
        (
          <tr key={product.id}>
            <td>
              <ArrowLongRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </td>
            <td className="text-sm text-gray-700 font-medium">{product.title}</td>
            <td className="text-sm text-gray-700 font-semibold">added {format(parseISO(product.published_at), 'MMMM d, yyyy')}</td>
            <td></td>
          </tr>
        ))
        : null}
    </>
  )
}
