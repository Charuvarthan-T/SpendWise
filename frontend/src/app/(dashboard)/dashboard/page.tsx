'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/lib/firebase/AuthContext";
import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";
import SignOutButton from "@/components/auth/SignOutButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { getSpendings, Spending } from '@/lib/firebase/firestore';

export default function DashboardPage() {
  const { user } = useAuth();
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(true);

  // This function fetches the data and can be called to refresh the list
  const fetchSpendings = async () => {
    if (user) {
      const userSpendings = await getSpendings(user.uid);
      setSpendings(userSpendings);
    }
    setLoading(false);
  };

  // Fetch the initial data when the component loads
  useEffect(() => {
    fetchSpendings();
  }, [user]);

  // This function is passed down to the form, which calls it after a new spending is added
  const handleSpendingAdded = () => {
    fetchSpendings(); // Re-fetches the data, automatically updating the list
  };

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">
            Welcome, {user ? user.displayName?.split(' ')[0] : 'User'}!
          </h1>
          <SignOutButton />
        </header>

        <main className="mt-4">
          <SpendingForm onSpendingAdded={handleSpendingAdded} />

          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger>View Recent Spendings</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-4">
                    <SpendingList spendings={spendings} loading={loading} setSpendings={setSpendings} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </main>
      </div>
    </div>
  );
}