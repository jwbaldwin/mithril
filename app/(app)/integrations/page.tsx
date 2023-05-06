'use client';

import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import crypto from "crypto";
import Cookies from 'js-cookie';
import React from "react";

const Integrations = () => {
  const [isLinking, setIsLinking] = useState(false)
  const [store, setStore] = useState("");
  const [inputError, setInputError] = useState("");

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

  const searchParams = useSearchParams()!;

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

    const params = new URLSearchParams(searchParams);
    console.log("params", params)

    if (!params.has("hmac")) {
      return;
    } else {
      setIsLinking(true)
    }

    const hmac = params.get("hmac")!;
    const shop = params.get("shop")!.split('.')[0];
    params.delete("hmac");
    params.sort();

    const isRequestValid = safeCompare(hmac, params.toString());

    if (isRequestValid) {
      const redirectUrl = buildRedirectUrl(shop);
      window.location.href = redirectUrl
    } else {
      throw new Error("Unauthorized")
    }
  }, [searchParams]);

  if (isLinking) {
    return (
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <a
            href="#"
            className="group relative flex w-full justify-center rounded-md bg-gray-900 py-3 px-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            Connecting to Shopify
          </a>
        </div>
      </div>
    );
  } else {
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
};


export default Integrations;
