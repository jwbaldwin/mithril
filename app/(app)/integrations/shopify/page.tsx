'use client'

import { useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import crypto from "crypto";
import Cookies from "js-cookie";
import api from "../../../../lib/api"
import { AxiosResponse } from 'axios';
import Link from 'next/link';
import { CheckCircleIcon, ChevronLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function Shopify() {
  const [isLinking, setIsLinking] = useState(false)
  const [isLinked, setIsLinked] = useState(false)
  const [store, setStore] = useState("");
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);

  interface OAuthSuccessResponse {
    shop: string
  }

  const buildAuthTokenUrl = (shop: string, code: string) => {
    const query = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_SECRET!,
      code: code
    });

    return `https://${shop}.myshopify.com/admin/oauth/access_token?${query.toString()}`
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Define the regular expression for valid input
    const validInputRegex = /^[a-zA-Z0-9-]+$/;

    // Check if the input matches the valid format
    if (!validInputRegex.test(store.toLowerCase())) {
      setInputError("Store URL is invalid");
    } else {
      window.location.href = buildRedirectUrl(store)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStore(e.target.value)
  }


  const buildRedirectUrl = (shop: string) => {
    const nonce = crypto.randomBytes(16).toString("hex");
    Cookies.set(shop, nonce);

    const query = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID!,
      scope: process.env.NEXT_PUBLIC_SHOPIFY_SCOPES!,
      redirect_uri: process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI!,
      state: nonce
    });

    return `https://${shop}.myshopify.com/admin/oauth/authorize?${query.toString()}`.toString()
  };

  useEffect(() => {
    const safeCompare = (hmac: string, queryStr: string) => {
      return (
        hmac ===
        crypto
          .createHmac("SHA256", process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_SECRET!)
          .update(queryStr)
          .digest("hex")
      );
    };

    const partOneOAuthVerification = () => {
      const hmac = params.get("hmac")!;
      const shop = params.get("shop")!.split('.')[0];
      params.delete("hmac");
      params.sort();

      const isRequestValid = safeCompare(hmac, params.toString());

      if (isRequestValid) {
        const redirectUrl = buildRedirectUrl(shop);
        window.location.href = redirectUrl
      }
    }

    const partTwoOAuthVerification = () => {
      const hmac = params.get("hmac")!;
      const shop = params.get("shop")!.split('.')[0];
      const code = params.get("code")!;
      const requestedScopes = process.env.NEXT_PUBLIC_SHOPIFY_SCOPES!;
      params.delete("hmac");
      params.sort();

      const validHmac = safeCompare(hmac, params.toString());
      const validNonce = Cookies.get(shop) == params.get("state")
      const validShopFormat = params.get("shop")!.match("^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com")

      if (validHmac && validNonce && validShopFormat) {
        // Fetch data from an API and update state
        const data = {
          auth_token_url: buildAuthTokenUrl(shop, code),
          scopes: requestedScopes,
          shop: shop,
          client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_SECRET!,
          code: code
        }
        api.post('oauth/shopify', data)
          .then((response: AxiosResponse<OAuthSuccessResponse>) => {
            // Cookies.remove(response.data.shop)
            setIsLinked(true)
            setIsLoading(false)
          })
          .catch((_error: Error) => {
            setIsLoading(false)
            throw new Error("Unauthorized")
          })
      } else {
        throw new Error("Unauthorized")
      }
    }

    if (params.has("hmac") && !params.has("code")) {
      setIsLinking(true)
      partOneOAuthVerification()
    } else if (params.has("hmac") && params.has("code")) {
      setIsLinking(true)
      partTwoOAuthVerification()
    } else {
      return;
    }
  });

  if (isLinking && isLoading) {
    return <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        Linking...
      </div>
    </div>
  }

  if (isLinking && isLinked) {
    return (
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8 tracking-tight">
        <div className="w-full max-w-lg space-y-8">
          {isLinked ?
            <div className="rounded-md bg-green-50 border border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-green-800">Shopify linked!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>We&apos;re now syncing with your shop</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        href="integrations"
                        className="flex items-center rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      >
                        <ChevronLeftIcon className="h-4 w-5 -ml-1.5" /> Back to Integrations
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="rounded-md bg-yellow-50 border border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-yellow-800">Shopify linking encountered an error</h3>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        href="integrations"
                        className="flex items-center rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                      >
                        <ChevronLeftIcon className="h-4 w-5 -ml-1.5" /> Back to Integrations
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
      <div>
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Connect your Shop</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-3 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">Store URL</label>
              <input
                id="store"
                name="store"
                type="store"
                value={store}
                onChange={handleChange}
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                placeholder="exmaple-store-url"
              />
              {inputError && <p className="text-sm mt-2 text-red-500">{inputError}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-gray-900 py-3 px-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Install Kept
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

