'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import crypto from "crypto";
import Cookies from 'js-cookie';

const Integrations = () => {
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

    if (!params.has("hmac")) return;

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

  return (
    <>
      <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <a
            href="#"
            className="group relative flex w-full justify-center rounded-md bg-gray-900 py-3 px-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            Connecting to Shopify
          </a>
        </div>
      </div>
    </>
  );
};

// test url localhost:3000/integrations?code=0907a61c0c8d55e99db179b68161bc00&hmac=700e2dadb827fcc8609e9d5ce208b2e9cdaab9df07390d2cbca10d7c328fc4bf&shop={shop}.myshopify.com&state=0.6784241404160823&timestamp=1337178173

export default Integrations;