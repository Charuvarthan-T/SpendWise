'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/lib/firebase/AuthContext";
import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";
import SignOutButton from "@/components/auth/SignOutButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { getSpendings, Spending } from '@/lib/firebase/firestore';
import AISuggestions from '@/components/dashboard/AISuggestions';
import { DailySpendChart } from '@/components/custom/DailySpendChart'; 
import { Timestamp } from 'firebase/firestore'; 

// chart components
interface DailySpend {
  date: string;
  amount: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [dailyData, setDailyData] = useState<DailySpend[]>([]); 
  const [loading, setLoading] = useState(true);


// firestore fetching is done here!
  const fetchSpendings = async () => {
    if (user) {
      setLoading(true);
      const userSpendings = await getSpendings(user.uid);
      setSpendings(userSpendings);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user) {
      fetchSpendings();
    }
  }, [user]);


  useEffect(() => {
    if (spendings.length > 0) {
      const spendingByDay: { [key: string]: number } = {};

      spendings.forEach(spending => {
        let dateObj: Date;
        
        if (spending.timestamp instanceof Timestamp) {
          dateObj = spending.timestamp.toDate();
        }
        
        else if (typeof spending.timestamp === 'string' || typeof spending.timestamp === 'number') {
          dateObj = new Date(spending.timestamp);
        }
        
        else if (spending.timestamp && Object.prototype.toString.call(spending.timestamp) === '[object Date]') {
          dateObj = spending.timestamp as Date;
        }
        
        else {
          dateObj = new Date(); 
        }

        const dateKey = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        if(spendingByDay[dateKey]){
          spendingByDay[dateKey]+=spending.amount;
        }
        
        else{
          spendingByDay[dateKey]=spending.amount;
        }

      });

      const formattedData=Object.keys(spendingByDay).map(date => ({
        date,
        amount: spendingByDay[date],
      }));

      formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setDailyData(formattedData);
    }
    
    else{
      setDailyData([]); 
    }

  }, [spendings]); 

  const handleSpendingAdded = () => {
    fetchSpendings();
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

        <main className="mt-4 space-y-6">
          <div className="flex flex-col gap-6">
            <SpendingForm onSpendingAdded={handleSpendingAdded} />
            <AISuggestions spendings={spendings} />
          </div>
          
          {loading ? (
             <Card><CardContent className="pt-6"><p>Loading chart data...</p></CardContent></Card>
          ) : dailyData.length > 0 ? (
            <DailySpendChart data={dailyData} />
          ) : (
            !loading && <Card><CardContent className="pt-6"><p>Add an expense to see your daily spending chart.</p></CardContent></Card>
          )}
          
          <Accordion type="single" collapsible className="w-full">
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