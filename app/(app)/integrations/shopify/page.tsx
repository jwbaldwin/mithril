'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import crypto from "crypto";
import Cookies from "js-cookie";
import api from "../../../../lib/api"
import { AxiosResponse } from 'axios';

export default function Shopify() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLinked, setIsLinked] = useState(false)
  const searchParams = useSearchParams()!;

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

  useEffect(() => {
    // https://example.org/some/redirect/uri?code={authorization_code}&hmac=da9d83c171400a41f8db91a950508985&host={base64_encoded_hostname}&shop={shop_origin}&state={nonce}&timestamp=1409617544
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
  });

  if (isLoading) {
    return <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        Linking...
      </div>
    </div>
  }

  return (
    <div className="flex min-h-full items-center -my-20 justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {isLinked ? "Shopify linked!" : "Shopify failed to link."}
      </div>
    </div>
  )
}

