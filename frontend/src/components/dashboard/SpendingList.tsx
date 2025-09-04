'use client';

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getSpendings, Spending } from "@/lib/firebase/firestore";

export default function SpendingList() {
  const { user } = useAuth();
  const [spendings, setSpendings] = useState<Spending[]>([]);

  useEffect(() => {
    if (user) {
      const fetchSpendings = async () => {
        const userSpendings = await getSpendings(user.uid);
        setSpendings(userSpendings);
      };
      fetchSpendings();
    }
  }, [user]); // Re-run when user changes

  if (spendings.length === 0) {
    return <p className="text-center text-gray-500 py-4">No spendings recorded yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spendings.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.description || '-'}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right">
              ₹{item.amount.toLocaleString('en-IN')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}