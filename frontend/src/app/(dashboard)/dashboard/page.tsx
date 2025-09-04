// import AISuggestions from "@/components/dashboard/AISuggestions";
import SpendingForm from "@/components/dashboard/SpendingForm";
import SpendingList from "@/components/dashboard/SpendingList";
import SignOutButton from "@/components/auth/SignOutButton";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      {/* This new div will act as a header for the page */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 now contains both the form and suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SpendingForm />
          {/* <AISuggestions /> */}
        </div>
        {/* Column 2 remains the same */}
        <div className="lg:col-span-2">
          <SpendingList />
        </div>
      </div>
    </div>
  );
}