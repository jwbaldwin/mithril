import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';
import React from 'react';

interface User {
  id: number;
  name: string;
  last_contact: string;
}

export default async function UsersTable({ users }: { users: User[] }) {
  return (
    <Table className="relative w-full ring-1 bg-white shadow border-blue-500 ring-gray-200 rounded-lg">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="text-base text-gray-800">Name</TableHeaderCell>
          <TableHeaderCell className="text-base text-gray-800">Last contact</TableHeaderCell>
          <TableHeaderCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="text-gray-800 text-base">{user.name}</TableCell>
            <TableCell>
              <Text className="flex items-center text-gray-800 text-base">
                <svg className="mr-1.5 h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx={4} cy={4} r={3} />
                </svg>
                {user.last_contact}</Text>
            </TableCell>
            <TableCell>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-full bg-green-500 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Go
                <ChevronRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table >
  );
}
