'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { Spending } from "@/lib/firebase/firestore"; // Import the Spending type

// 1. Define an interface for the component's props
interface AISuggestionsProps {
  spendings: Spending[];
}

// 2. Use the interface to type the component's props
export default function AISuggestions({ spendings }: AISuggestionsProps) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = async () => {
    if (!user) {
      setError("You must be logged in to get suggestions.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

  const data = await response.json() as { error?: string; suggestions?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suggestions.');
      }
      
  const parsedSuggestions = JSON.parse(data.suggestions ?? "[]");
      setSuggestions(parsedSuggestions);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI Suggestions</span>
          </div>
          {/* 3. Disable button if there's no spending data to analyze */}
          <Button onClick={getSuggestions} disabled={loading || !user || spendings.length === 0}>
            {loading ? "Analyzing..." : "Get Tips"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {suggestions.length > 0 && (
          <ul className="space-y-3">
            {suggestions.map((tip, index) => (
              <li key={index} className="text-sm text-gray-700">
                {tip}
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && suggestions.length === 0 && (
           <p className="text-sm text-gray-500">Click "Get Tips" to generate AI-powered suggestions based on your spending data in Firestore.</p>
        )}
      </CardContent>
    </Card>
  );
}