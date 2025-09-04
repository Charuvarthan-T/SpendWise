'use client'; // 1. Convert to a client component

import { useState } from 'react'; // 2. Import useState
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SpendingForm() {
  // 3. Create state to hold the amount value
  const [amount, setAmount] = useState('');

  // 4. Create a handler function for the amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update the state if t he value is not negative
    if (!value.startsWith('-')) {
      setAmount(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            {/* 5. Connect the input to our state and handler */}
            <Input
              id="amount"
              placeholder="e.g., 1200"
              type="number"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g., Lunch with friends, Fuel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" placeholder="e.g., Pizza order" />
          </div>
          <Button className="w-full">Add Spending</Button>
        </form>
      </CardContent>
    </Card>
  );
}