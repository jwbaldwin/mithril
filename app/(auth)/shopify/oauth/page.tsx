'use client'

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from "react";
import crypto from "crypto";
import Cookies from "js-cookie";
import api from "../../../../lib/api"
import { AxiosResponse } from 'axios';
import Link from 'next/link';
import { CheckCircleIcon, ChevronLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function Shopify() {
  const [isLinking, setIsLinking] = useState(false)
  const [isLinked, setIsLinked] = useState(false)
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

  // if (isLinking && isLinked) {
  if (true) {
    return (<div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8 tracking-tight">
      <div className="flex flex-col items-center">
        <Image src="/static/logo.svg" alt="kept" width="120" height="120" />
        <div className="w-full max-w-lg pt-8">
          {true ?
            <div className="rounded-md bg-green-50 border border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Kept account created!</h3>
                  <div className="mt-2 text-base text-green-700">
                    <p>IMPORTANT! Your Kept account has been created using your <strong>Shop email as both username and password</strong></p>
                    <br />
                    <p>You can change this once you log in.</p>
                    <br />
                    <p>In the meantime we will begin syncing your shop data.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        href="integrations"
                        className="flex items-center rounded-md bg-green-50 px-2 py-1.5 text-base font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      >
                        <ChevronLeftIcon className="h-4 w-5 -ml-1.5" /> Sign in using your Shop email
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
    </div>)
  }
  else if (isLinking && isLoading) {
    return (<div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <Image src="/static/logo.svg" alt="kept" width="120" height="120" />
        <div className="w-full max-w-md pt-8">
          Linking...
        </div>
      </div>
    </div>)
  } else {
    return (
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center animate-pulse">
            <Image src="/static/logo.svg" alt="kept" width="120" height="120" />
          </div>
        </div>
      </div>
    )
  }
}

