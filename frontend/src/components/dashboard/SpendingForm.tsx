'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/lib/firebase/AuthContext';
import { addSpending, Spending } from '@/lib/firebase/firestore';

interface SpendingFormProps {
  onSpendingAdded: () => void;
}

export default function SpendingForm({ onSpendingAdded }: SpendingFormProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    if (!value.startsWith('-')) {
      setAmount(value);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("No user logged in");
      return;
    }


    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0 || !category) {
      alert("Please enter a valid amount and category.");
      return;
    }


    const spendingData = {
      userId: user.uid,
      amount: amountNumber,
      category,
      description,
    };


    await addSpending(spendingData as Omit<Spending, 'id' | 'timestamp'>);

    setAmount('');
    setCategory('');
    setDescription('');
    onSpendingAdded();
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="e.g., 450"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Lunch at canteen"
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="e.g., Bought a tandoori"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </div>


          <Button type="submit" className="w-full">Add Spending</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
