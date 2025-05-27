
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, BarChart2, Sparkles, Loader2 } from "lucide-react";
import type { Mark } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateMarkAnalysis, type GenerateMarkAnalysisInput, type GenerateMarkAnalysisOutput } from "@/ai/flows/generate-mark-analysis-flow";
import { APP_NAME } from "@/config/app";

interface SubjectSummary {
  subject: string;
  totalScored: number;
  totalPossible: number;
  averagePercentage: number;
  grade: string;
  testCount: number;
}

export default function MarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [subject, setSubject] = useState("");
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState<number | string>("");
  const [totalMarks, setTotalMarks] = useState<number | string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const [subjectSummaries, setSubjectSummaries] = useState<SubjectSummary[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<GenerateMarkAnalysisOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const totalMarksObtained = marks.reduce((sum, mark) => sum + mark.score, 0);
  const totalPossibleMarks = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
  const overallAvgPercentage = totalPossibleMarks > 0 ? (totalMarksObtained / totalPossibleMarks) * 100 : 0;
  const overallGrade = getGrade(overallAvgPercentage);

  useEffect(() => {
    if (marks.length === 0) {
      setSubjectSummaries([]);
      return;
    }

    const summaries: Record<string, { scored: number; possible: number; count: number }> = {};
    marks.forEach(mark => {
      if (!summaries[mark.subject]) {
        summaries[mark.subject] = { scored: 0, possible: 0, count: 0 };
      }
      summaries[mark.subject].scored += mark.score;
      summaries[mark.subject].possible += mark.totalMarks;
      summaries[mark.subject].count += 1;
    });

    const calculatedSummaries: SubjectSummary[] = Object.entries(summaries).map(([subjectKey, data]) => {
      const percentage = data.possible > 0 ? (data.scored / data.possible) * 100 : 0;
      return {
        subject: subjectKey,
        totalScored: data.scored,
        totalPossible: data.possible,
        averagePercentage: percentage,
        grade: getGrade(percentage),
        testCount: data.count,
      };
    }).sort((a,b) => a.subject.localeCompare(b.subject)); // Sort alphabetically by subject
    setSubjectSummaries(calculatedSummaries);
  }, [marks]);

  const handleAddMark = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !testName.trim() || score === "" || totalMarks === "") {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    if (Number(score) > Number(totalMarks)) {
      toast({ title: "Error", description: "Score cannot be greater than total marks.", variant: "destructive" });
      return;
    }
    if (Number(score) < 0 || Number(totalMarks) <= 0) {
      toast({ title: "Error", description: "Score must be non-negative and Total Marks must be positive.", variant: "destructive" });
      return;
    }
    const newMark: Mark = {
      id: Date.now().toString(),
      subject: subject.trim(),
      testName: testName.trim(),
      score: Number(score),
      totalMarks: Number(totalMarks),
      date: date || new Date(),
    };
    setMarks([newMark, ...marks].sort((a,b) => b.date.getTime() - a.date.getTime())); // Keep sorted by date desc
    setSubject("");
    setTestName("");
    setScore("");
    setTotalMarks("");
    setDate(new Date());
    toast({ title: "Success", description: "Mark added successfully!" });
  };

  const deleteMark = (id: string) => {
    setMarks(marks.filter((mark) => mark.id !== id));
    toast({ title: "Mark Deleted", description: "The mark entry has been removed." });
  };

  const handleGetAiSuggestions = async () => {
    if (marks.length === 0) {
      toast({ title: "No Data", description: "Please add some marks before generating AI insights.", variant: "default" });
      return;
    }
    setIsAiLoading(true);
    setAiSuggestions(null);
    setAiError(null);

    let studentNameForAI = "Student"; 
    const appNameParts = APP_NAME.split("'s ");
    if (appNameParts.length > 0 && appNameParts[0] !== APP_NAME) { // Check if split was successful
      studentNameForAI = appNameParts[0];
    }

    const input: GenerateMarkAnalysisInput = {
      studentName: studentNameForAI,
      subjectPerformances: subjectSummaries.map(s => ({
        subjectName: s.subject,
        averagePercentage: s.averagePercentage,
        testCount: s.testCount,
        grade: s.grade,
      })),
      overallAverage: parseFloat(overallAvgPercentage.toFixed(2)),
      overallGrade: overallGrade,
    };

    try {
      const result = await generateMarkAnalysis(input);
      setAiSuggestions(result);
      toast({ title: "AI Insights Ready!", description: "Your personalized mark analysis is here." });
    } catch (err) {
      console.error("Error generating AI mark analysis:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown AI error occurred.";
      setAiError(`Failed to get AI insights: ${errorMessage}`);
      toast({ title: "AI Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Marks Manager</CardTitle>
          <CardDescription>Track your academic performance effectively. Add marks and get AI insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMark} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject-name">Subject</Label>
                <Input id="subject-name" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Mathematics" />
              </div>
              <div>
                <Label htmlFor="test-name">Test/Assignment Name</Label>
                <Input id="test-name" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="e.g., Midterm Exam" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="score">Score</Label>
                <Input id="score" type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g., 85" min="0"/>
              </div>
              <div>
                <Label htmlFor="total-marks">Total Marks</Label>
                <Input id="total-marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g., 100" min="1"/>
              </div>
              <div>
                <Label htmlFor="mark-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Mark
            </Button>
          </form>
        </CardContent>
      </Card>

      {marks.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Recorded Marks</CardTitle>
              <CardDescription>Detailed list of all your scores.</CardDescription>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-muted-foreground">Overall Performance</p>
              <p className="text-2xl font-bold text-primary">{overallAvgPercentage.toFixed(2)}% ({overallGrade})</p>
              <p className="text-xs text-muted-foreground">
                Scored: {totalMarksObtained} / {totalPossibleMarks}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark) => {
                  const percentage = (mark.score / mark.totalMarks) * 100;
                  return (
                    <TableRow key={mark.id}>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>{mark.testName}</TableCell>
                      <TableCell>{mark.score}</TableCell>
                      <TableCell>{mark.totalMarks}</TableCell>
                      <TableCell>{percentage.toFixed(2)}%</TableCell>
                      <TableCell>{getGrade(percentage)}</TableCell>
                      <TableCell>{format(mark.date, "PP")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteMark(mark.id)} aria-label={`Delete mark for ${mark.testName}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter className="flex-col items-start gap-2 sm:flex-row sm:justify-between">
             <Button onClick={handleGetAiSuggestions} disabled={isAiLoading || marks.length === 0}>
              {isAiLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Insights...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Get AI Insights</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">AI can provide suggestions based on your entered marks.</p>
          </CardFooter>
        </Card>
      )}

      {subjectSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
            <CardDescription>Performance summary for each subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Total Scored</TableHead>
                  <TableHead>Total Possible</TableHead>
                  <TableHead>Average %</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectSummaries.map(summary => (
                  <TableRow key={summary.subject}>
                    <TableCell className="font-medium">{summary.subject}</TableCell>
                    <TableCell>{summary.testCount}</TableCell>
                    <TableCell>{summary.totalScored}</TableCell>
                    <TableCell>{summary.totalPossible}</TableCell>
                    <TableCell>{summary.averagePercentage.toFixed(2)}%</TableCell>
                    <TableCell>{summary.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {marks.length === 0 && (
         <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <BarChart2 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No marks recorded yet. Add your scores to see them here and get AI insights.</p>
            </CardContent>
          </Card>
      )}

      {aiError && (
        <Card className="mt-6 border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="text-destructive">AI Analysis Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive font-medium">{aiError}</p></CardContent>
        </Card>
      )}
      {aiSuggestions && (
        <Card className="mt-6 shadow-md border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" /> {aiSuggestions.analysisTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-1 text-foreground">Overall Feedback</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{aiSuggestions.overallFeedback}</p>
            </div>
            {aiSuggestions.subjectSpecificSuggestions && aiSuggestions.subjectSpecificSuggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-foreground">Subject-Specific Suggestions</h4>
                <div className="space-y-3">
                  {aiSuggestions.subjectSpecificSuggestions.map((item, index) => (
                    <div key={index} className="p-3 bg-card border rounded-md">
                      <p className="font-medium text-card-foreground">{item.subjectName}</p>
                      <p className="text-muted-foreground whitespace-pre-wrap text-sm">{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-lg mb-1 text-foreground">Final Thoughts</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{aiSuggestions.encouragement}</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
