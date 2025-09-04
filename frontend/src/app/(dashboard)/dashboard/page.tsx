'use client';

import { useAuth } from "@/lib/firebase/AuthContext";
import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";
import SignOutButton from "@/components/auth/SignOutButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">
            Welcome, {user ? user.displayName?.split(' ')[0] : 'User'}!
          </h1>
          <SignOutButton />
        </header>

        {/* Main Content Section */}
        <main className="mt-4">
          <SpendingForm />

          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger>View Recent Spendings</AccordionTrigger>
              <AccordionContent>
                {/* Wrap the list in a Card for valid structure and styling */}
                <Card>
                  <CardContent className="pt-4">
                    <SpendingList />
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