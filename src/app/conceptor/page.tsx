
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, MessageSquareQuestion, ShieldAlert, Lock, Unlock } from "lucide-react";
import { generateConceptorResponse } from "@/ai/flows/generate-conceptor-response-flow";
import type { GenerateConceptorOutput } from "@/ai/flows/generate-conceptor-response-flow";
import { useToast } from "@/hooks/use-toast";

const APP_EDIT_LOCKED_KEY = "app-edit-locked";
const PASSKEY = "HappyHunYar#000";

export default function ConceptorPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<GenerateConceptorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  const [isLocked, setIsLocked] = useState(true);
  const [passkeyAttempt, setPasskeyAttempt] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const appEditLocked = sessionStorage.getItem(APP_EDIT_LOCKED_KEY);
    if (appEditLocked === 'false') {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }
  }, []);

  const handleUnlockAttempt = () => {
    if (passkeyAttempt === PASSKEY) {
      sessionStorage.setItem(APP_EDIT_LOCKED_KEY, 'false');
      setIsLocked(false);
      setPasskeyAttempt("");
      toast({ title: "Success", description: "Conceptor AI Unlocked." });
    } else {
      toast({ title: "Error", description: "Incorrect passkey.", variant: "destructive" });
    }
  };

  const handleLockControls = () => {
    sessionStorage.setItem(APP_EDIT_LOCKED_KEY, 'true');
    setIsLocked(true);
    toast({ title: "Conceptor AI Locked", description: "Interaction has been locked." });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock Conceptor AI to ask questions.", variant: "default" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    if (!question.trim()) {
      setError("Please enter a question.");
      setIsLoading(false);
      toast({
        title: "Input Required",
        description: "Question cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateConceptorResponse({ question });
      setAnswer(result);
      toast({
        title: "Answer Ready!",
        description: "Conceptor AI has responded.",
      });
    } catch (err) {
      console.error("Error generating conceptor response:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get an answer: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to get answer: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Card className="shadow-md border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-orange-600" /> Access Control
          </CardTitle>
          <CardDescription>
            {isLocked 
              ? "Enter passkey to use Conceptor AI." 
              : "Conceptor AI is unlocked. You can ask questions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLocked ? (
            <div className="flex items-center gap-2">
              <Input
                type="password"
                value={passkeyAttempt}
                onChange={(e) => setPasskeyAttempt(e.target.value)}
                placeholder="Enter passkey"
                className="max-w-xs"
                aria-label="Passkey"
              />
              <Button onClick={handleUnlockAttempt} variant="outline">
                <Unlock className="mr-2 h-4 w-4" /> Unlock AI
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-sm text-green-600 font-medium">Conceptor AI Unlocked.</p>
                <Button onClick={handleLockControls} variant="destructive" size="sm">
                    <Lock className="mr-2 h-4 w-4" /> Lock AI
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <MessageSquareQuestion className="h-7 w-7 text-primary" /> Conceptor AI
          </CardTitle>
          <CardDescription>
            Ask any question, explore any concept. Conceptor is here to help you understand. {isLocked && "(Unlock to use)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Explain the theory of relativity in simple terms."
                rows={4}
                disabled={isLoading || isLocked}
                className="text-base"
              />
            </div>
            <Button type="submit" disabled={isLoading || isLocked || !question.trim()} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Ask Conceptor
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary"/> Conceptor's Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
              {answer.answer}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
