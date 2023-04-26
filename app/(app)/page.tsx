import React from 'react';
import { Card, Title, Divider, Grid, Col } from '@tremor/react';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import UsersTable from './table';
import client from '../../lib/client';

async function getProducts() {
  const res = await client(`/insights/products`);
  return res.json()
}

async function getOrders() {
  const res = await client(`/insights/orders`)
  return res.json();
}

async function getCustomers() {
  const res = await client(`/insights/customers`)
  return res.json();
}


export default async function IndexPage() {

  const productData = getProducts();
  const orderData = getOrders();
  const customerData = getCustomers();

  // Wait for the promises to resolve
  const [products, orders, customers] = await Promise.all([productData, orderData, customerData]);

  const productsLength = products.data.length
  const ordersLength = orders.data.length
  const customersLength = customers.data.length


  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="text-xl pb-4 text-gray-900">Progress this month</Title>
      <div className="flex space-x-6">
        <Card className="flex items-center text-center sm:max-w-sm max-w-full">
          <div className="text-5xl text-gray-900 font-bold lining-nums slashed-zero">{productsLength}</div>
          <div className="text-left ml-8 text-lg text-gray-600">products</div>
        </Card>
        <Card className="flex items-center text-center align-middle sm:max-w-md max-w-full">
          <div className="text-5xl text-green-500 font-bold mr-4 lining-nums slashed-zero">{ordersLength}</div>
          <div className="ml-8 text-left text-lg text-gray-600">orders</div>
        </Card>
        <Card className="flex items-center text-center align-middle sm:max-w-md max-w-full">
          <div className="text-5xl text-green-500 font-bold mr-4 lining-nums slashed-zero">{customersLength}</div>
          <div className="ml-8 text-left text-lg text-gray-600">customers</div>
        </Card>
      </div>
      <Divider />
      <Title className="text-xl pb-4 text-gray-900">This weeks advocates</Title>
      <Grid numCols={1} numColsSm={2} className="gap-6">
        <Col>
          <Title className="text-base pb-2">Top customers</Title>
          {/* @ts-expect-error Server Component */}
          <UsersTable users={[{ id: 1, name: "Justin Timberlake", last_contact: "01/23" }]} />
        </Col>
        <Col>
          <Title className="text-base pb-2">Top customers</Title>
          {/* @ts-expect-error Server Component */}
          <UsersTable users={[{ id: 1, name: "Justin Timberlake", last_contact: "01/23" }]} />
        </Col>
      </Grid>
    </main>
  );
}
