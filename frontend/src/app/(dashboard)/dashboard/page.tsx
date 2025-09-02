import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SpendingForm />
        </div>
        <div className="lg:col-span-2">
          <SpendingList />
        </div>
      </div>
    </div>
  );
}