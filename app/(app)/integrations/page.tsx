'use client';

import { useEffect, useState } from "react";
import React from "react";
import api from "../../../lib/api";
import ShopifyIntegrationCard from "./shopify-integration-card";

const Integrations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState([] as any[]);
  const [hasShopifyIntegration, setHasShopifyIntegration] = useState(false);

  useEffect(() => {
    const fetchIntegrationsData = async () => {
      try {
        const response = await api.get('/integrations');
        setIntegrations([...response.data.integrations]);
        setHasShopifyIntegration(response.data.integrations.some((integration: any) => integration.type === "shopify"))
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching integrations:', error);
      }
    };

    fetchIntegrationsData();
  }, []);


  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-20 py-20">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Integrations</h3>
        </div>
        <ul role="list" className="space-y-3 pt-4">
          <li className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">

            <div className="flex animate-pulse">
              <div className="bg-gray-200 rounded h-12 w-14">
              </div>
              <div className="flex w-full items-center justify-between ml-4">
                <div className="flex flex-col justify-between h-full">
                  <div className="h-5 bg-gray-200 rounded w-36"></div>
                  <div className="w-28 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    )
  } else {
    return (
      <div className="mx-auto max-w-2xl px-20 py-20">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Integrations</h3>
        </div>
        <ul role="list" className="space-y-3 pt-4">
          {integrations.map((integration) => (
            <li key={integration.id} className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
              <ShopifyIntegrationCard integration={integration} />
            </li>
          ))}
          {hasShopifyIntegration ? null :
            <li className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
              <ShopifyIntegrationCard add={true} />
            </li>
          }
        </ul>
      </div>
    )
  }
};


export default Integrations;
