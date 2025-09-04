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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getSpendings, deleteSpending, Spending } from "@/lib/firebase/firestore";

export default function SpendingList() {
  const { user } = useAuth();
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(true); // Manages loading state

  useEffect(() => {
    if (user) {
      const fetchSpendings = async () => {
        const userSpendings = await getSpendings(user.uid);
        setSpendings(userSpendings);
        setLoading(false); // Set loading to false after data is fetched
      };
      fetchSpendings();
    } else {
      setLoading(false); // Also stop loading if there's no user
    }
  }, [user]);

  const handleDelete = async (spendingId: string) => {
    await deleteSpending(spendingId);
    setSpendings(spendings.filter((item) => item.id !== spendingId));
  };

  const totalAmount = spendings.reduce((sum, item) => sum + item.amount, 0);

  // First, render a loading message to ensure server and client match
  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading spendings...</p>;
  }

  // Then, render the empty message if applicable
  if (spendings.length === 0) {
    return <p className="text-center text-gray-500 py-4">No spendings recorded yet.</p>;
  }

  // Finally, render the table with data
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spendings.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.description || '-'}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              {item.timestamp.toDate().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </TableCell>
            <TableCell className="text-right">
              ₹{item.amount.toLocaleString('en-IN')}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            ₹{totalAmount.toLocaleString('en-IN')}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}