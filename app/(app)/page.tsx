import React from 'react';
// import { Card, Title, Divider, Grid, Col, List, ListItem } from '@tremor/react';
// import { getServerSession, NextAuthOptions } from 'next-auth';
// import { authOptions } from '../../pages/api/auth/[...nextauth]';
// import UsersTable from './table';
import client from '../../lib/client';
import { format } from 'date-fns'
import Link from 'next/link';
import { Brief } from '../../types/brief';
import TopCustomerRow from './top-customer-row';
import NewProductsRow from './new-products-row';
import HighInterestRow from './high-interest-row';


async function getWeeklyBrief() {
  const res = await client(`/insights/weekly-brief`);
  return res.json()
}

async function getShopifyIntegration() {
  const res = await client(`/integrations`)
  return res.json()
}

export default async function IndexPage() {
  const integrations = await getShopifyIntegration()

  const hasShopifyIntegration = integrations.integrations.some((integration: any) => integration.type === "shopify")

  if (!hasShopifyIntegration) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className="flex justify-around mt-24">
          <h2 className="text-md font-bold text-gray-900">
            <Link
              href="/integrations"
              className="mr-3 inline-flex items-center rounded bg-gray-900 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Link your Shopify
            </Link>
            to get your weekly brief</h2>
        </div>
      </main>
    )
  }

  let brief_data = await getWeeklyBrief()
  const brief: Brief = brief_data.brief

  // Wait for the promises to resolve
  const today = format(new Date(), 'MMMM d, yyyy')
  //=> "Today is a Thursday"
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <h2 className="text-3xl pb-1 font-bold text-gray-900">Your briefing</h2>
      <p className="text-base text-gray-900">Week of {today}</p>
      <div className="px-4 sm:px-0">
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 font-semibold text-gray-900 sm:pl-0" />
                    <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900" />
                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">Details</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">Next step</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <TopCustomerRow brief={brief} />
                  <NewProductsRow brief={brief} />
                  <HighInterestRow brief={brief} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
