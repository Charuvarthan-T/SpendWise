import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          SpendWise
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Your personal finance dashboard, powered by AI.
        </p>
        <Button className="mt-8">
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}