import { Card, Title, Divider, Grid, Col } from '@tremor/react';
import UsersTable from './table';

export const dynamic = 'force-dynamic';

export default async function IndexPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="text-xl pb-4 text-gray-900">Progress this month</Title>
      <div className="flex space-x-6">
        <Card className="flex items-center text-center sm:max-w-sm max-w-full">
          <div className="text-5xl text-gray-900 font-bold lining-nums slashed-zero">0</div>
          <div className="text-left ml-8 text-lg text-gray-600">
            advocates you engaged this week
          </div>
        </Card>
        <Card className="flex items-center text-center align-middle sm:max-w-md max-w-full">
          <div className="text-5xl text-green-500 font-bold mr-4 lining-nums slashed-zero">0</div>
          <div className="ml-8 text-left text-lg text-gray-600">
            new influential customers made a Pinkyotto purchase this month
          </div>
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
