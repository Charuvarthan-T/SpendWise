import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data that we will replace with Firestore data later
const mockSpendings = [
  { id: 1, description: "Pizza Order", category: "Food", amount: 1200, date: "2025-09-01" },
  { id: 2, description: "Cab to office", category: "Transport", amount: 500, date: "2025-09-01" },
  { id: 3, description: "New T-shirt", category: "Shopping", amount: 2500, date: "2025-08-31" },
];

export default function SpendingList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Spendings</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockSpendings.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <p className="font-semibold">₹{item.amount.toLocaleString('en-IN')}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}