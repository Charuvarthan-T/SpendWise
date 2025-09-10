'use client';

// tells to render on the client side that is the browser
// react hooks to manage state(memory) and side effects(actions)
import { useState, useEffect } from 'react';

// server is aware of the user from the user's identity from the request
import { useAuth } from "@/lib/firebase/AuthContext";


// following are components we created
import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";
import SignOutButton from "@/components/auth/SignOutButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

// firestore functions to get data
import { getSpendings, Spending } from '@/lib/firebase/firestore';
import AISuggestions from '@/components/dashboard/AISuggestions';
import { DailySpendChart } from '@/components/custom/DailySpendChart'; 
import { Timestamp } from 'firebase/firestore';     
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';


// the following interface is for the data format needed for the chart
interface DailySpend {
  date: string;
  amount: number;
}


// components state are initialized here
export default function DashboardPage() {
  const { user } = useAuth();
  const [spendings, setSpendings] = useState<Spending[]>([]);
  // the below state is for the chart data
  const [dailyData, setDailyData] = useState<DailySpend[]>([]); 
  // for loading state
  const [loading, setLoading] = useState(true);


  const fetchSpendings = async () => {
    if (user) {
      setLoading(true);
      // await -> wait for the getSpendings to complete
      const userSpendings = await getSpendings(user.uid);
      setSpendings(userSpendings);
      setLoading(false);
    }
  };

  // useEffect to fetch spendings when user changes (login/logout)
  useEffect(() => {
    if (user) {
      fetchSpendings();
    }
  }, [user]);
  
  
  // useEffect to process spendings into dailyData for the chart
  useEffect(() => {
    if(spendings.length>0){
      const spendingByDay:{ [key: string]: number } = {};
      
      spendings.forEach(spending => {
        // This logic handles various date formats from Firestore

        // AI generated code 
        const dateObj = spending.timestamp instanceof Timestamp ? spending.timestamp.toDate() : new Date(spending.timestamp); 
        const dateKey = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        // end 

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
          
          {/* 2. Add the ThemeToggle next to the SignOutButton */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
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