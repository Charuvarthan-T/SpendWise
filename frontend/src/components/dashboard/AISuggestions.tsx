'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Lightbulb } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { Spending } from "@/lib/firebase/firestore";

interface AISuggestionsProps {
  spendings: Spending[];
}

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
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${idToken}`,
        },
        
        body: JSON.stringify({ spendings }),
      });
      
      
      const data = await response.json() as { error?: string; suggestions?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suggestions.');
      }
      
      const parsedSuggestions = JSON.parse(data.suggestions ?? "[]");
      setSuggestions(parsedSuggestions);

    }
    
    catch (err: any){
      setError(err.message || "An unexpected error occurred.");
    }
    
    finally {
      setLoading(false);
    }

  };

  const SuggestionsSkeleton = () => (
    <div className="space-y-3 pt-2">
      <Skeleton className="h-5 w-5/6 rounded-lg" />
      <Skeleton className="h-5 w-full rounded-lg" />
      <Skeleton className="h-5 w-4/6 rounded-lg" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI Suggestions</span>
          </div>
          <Button onClick={getSuggestions} disabled={loading || !user || spendings.length === 0}>
            {loading ? "Analyzing..." : "Get Tips"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {loading ? (
          <SuggestionsSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-2 list-disc pl-5">
            {suggestions.map((tip, index) => (
              <li key={index} className="text-sm">{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Get Tips" to generate AI-powered suggestions based on your spending data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}