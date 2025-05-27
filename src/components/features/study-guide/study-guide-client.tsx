"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { generateStudySuggestions } from "@/ai/flows/generate-study-suggestions";
import type { GenerateStudySuggestionsOutput } from "@/ai/flows/generate-study-suggestions";
import { useToast } from "@/hooks/use-toast";

export function StudyGuideClient() {
  const [subjects, setSubjects] = useState("");
  const [examTopics, setExamTopics] = useState("");
  const [suggestions, setSuggestions] = useState<GenerateStudySuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    if (!subjects.trim() || !examTopics.trim()) {
      setError("Please provide both subjects and exam topics.");
      setIsLoading(false);
      toast({
        title: "Input Required",
        description: "Subjects and exam topics cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateStudySuggestions({ subjects, examTopics });
      setSuggestions(result);
      toast({
        title: "Suggestions Generated!",
        description: "Your AI study guide is ready.",
      });
    } catch (err) {
      console.error("Error generating study suggestions:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate study suggestions: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to generate suggestions: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> AI Study Guide
          </CardTitle>
          <CardDescription>
            Get personalized study suggestions to ace your exams. Enter your subjects and exam topics below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subjects">Subjects</Label>
              <Textarea
                id="subjects"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g., Mathematics, Physics, History"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="exam-topics">Exam Topics</Label>
              <Textarea
                id="exam-topics"
                value={examTopics}
                onChange={(e) => setExamTopics(e.target.value)}
                placeholder="e.g., Algebra, Newtonian Mechanics, World War II"
                rows={5}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Get Suggestions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Study Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {suggestions.studySuggestions}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
