'use client'; // This page needs to be a client component for interactivity

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // This function will be called when the button is clicked
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // After sign-in, the useEffect below will trigger a redirect
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // This hook redirects the user to the dashboard if they are already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show a loading state while checking for user
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is logged in, this page will redirect, so we can return null or a loader
  if (user) {
      return null;
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          SpendWise
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Your personal finance dashboard, powered by AI.
        </p>
        <Button onClick={handleSignIn} className="mt-8">
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}