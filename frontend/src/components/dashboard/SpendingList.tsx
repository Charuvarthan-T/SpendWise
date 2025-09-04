import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockSpendings = [
  { id: 1, description: "Pizza Order", category: "Food", amount: 1200 },
  { id: 2, description: "Cab to office", category: "Transport", amount: 500 },
  { id: 3, description: "New T-shirt", category: "Shopping", amount: 2500 },
];

export default function SpendingList() {
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
        {mockSpendings.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.description}</TableCell>
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