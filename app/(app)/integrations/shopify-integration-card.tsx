import { ChevronRightIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import * as React from "react"

const ShopifyIntegrationCard = (props: any) => {
  return (
    <div className="flex">
      <svg
        className="h-12"
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 108.44 122.88"
      >
        <path
          d="M94.98 23.66c-.09-.62-.63-.96-1.08-1-.45-.04-9.19-.17-9.19-.17s-7.32-7.1-8.04-7.83c-.72-.72-2.13-.5-2.68-.34-.01 0-1.37.43-3.68 1.14a25.05 25.05 0 0 0-1.76-4.32c-2.6-4.97-6.42-7.6-11.03-7.61h-.02c-.32 0-.64.03-.96.06-.14-.16-.27-.32-.42-.48C54.11.96 51.54-.08 48.45.01 42.5.18 36.57 4.48 31.76 12.12c-3.38 5.37-5.96 12.12-6.69 17.35-6.83 2.12-11.61 3.6-11.72 3.63-3.45 1.08-3.56 1.19-4.01 4.44C9.03 39.99 0 109.8 0 109.8l75.65 13.08 32.79-8.15S95.06 24.28 94.98 23.66zm-28.46-7.03c-1.74.54-3.72 1.15-5.87 1.82-.04-3.01-.4-7.21-1.81-10.83 4.52.85 6.74 5.96 7.68 9.01zm-9.83 3.05c-3.96 1.23-8.29 2.57-12.63 3.91 1.22-4.67 3.54-9.33 6.38-12.38 1.06-1.14 2.54-2.4 4.29-3.12 1.65 3.43 2 8.3 1.96 11.59zM48.58 3.97c1.4-.03 2.57.28 3.58.94-1.61.83-3.16 2.03-4.62 3.59-3.78 4.06-6.68 10.35-7.83 16.43-3.6 1.11-7.13 2.21-10.37 3.21C31.38 18.58 39.4 4.23 48.58 3.97z"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            fill: "#95bf47",
          }}
        />
        <path
          d="M93.9 22.66c-.45-.04-9.19-.17-9.19-.17s-7.32-7.1-8.04-7.83c-.27-.27-.63-.41-1.02-.47v108.68l32.78-8.15S95.05 24.28 94.97 23.66c-.07-.62-.62-.96-1.07-1z"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            fill: "#5e8e3e",
          }}
        />
        <path
          d="m57.48 39.52-3.81 14.25s-4.25-1.93-9.28-1.62c-7.38.47-7.46 5.12-7.39 6.29.4 6.37 17.16 7.76 18.11 22.69.74 11.74-6.23 19.77-16.27 20.41-12.05.76-18.69-6.35-18.69-6.35l2.55-10.86s6.68 5.04 12.02 4.7c3.49-.22 4.74-3.06 4.61-5.07-.52-8.31-14.18-7.82-15.04-21.48-.73-11.49 6.82-23.14 23.48-24.19 6.43-.41 9.71 1.23 9.71 1.23z"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            fill: "#fff",
          }}
        />
      </svg>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center ml-6">
          {props.integration ?
            <div className="flex-col">
              <p className="text-lg text-gray-800 font-semibold">Shopify</p>
              <p className="text-sm text-gray-600 font-medium"> {props.integration.shop}</p>
            </div>
            : <p className="text-lg text-gray-800 font-semibold">Shopify</p>}
        </div>
        <div>
          {props.integration ?
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Synced
            </span>
            :
            <Link
              href="/integrations/shopify"
              className="flex items-center text-sm tracking-tight font-medium text-gray-700 hover:text-gray-800"
            >
              Add Integration <ChevronRightIcon className="-ml-0.5 h-4 w-5" aria-hidden="true" />
            </Link>}
        </div>
      </div>
    </div>)
}
export default ShopifyIntegrationCard

