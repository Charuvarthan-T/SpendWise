'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  }, [user]);

  // 1. Calculate the total spending
  const totalAmount = spendings.reduce((sum, item) => sum + item.amount, 0);

  if (spendings.length === 0) {
    return <p className="text-center text-gray-500 py-4">No spendings recorded yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead> {/* 2. Add new Date column header */}
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spendings.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.description || '-'}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              {/* 3. Format and display the timestamp */}
              {item.timestamp.toDate().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </TableCell>
            <TableCell className="text-right">
              ₹{item.amount.toLocaleString('en-IN')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* 4. Add the total row */}
          <TableCell colSpan={3} className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            ₹{totalAmount.toLocaleString('en-IN')}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}