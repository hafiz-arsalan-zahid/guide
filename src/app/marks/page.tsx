"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, BarChart2 } from "lucide-react";
import type { Mark } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function MarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [subject, setSubject] = useState("");
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState<number | string>("");
  const [totalMarks, setTotalMarks] = useState<number | string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

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
    const newMark: Mark = {
      id: Date.now().toString(),
      subject,
      testName,
      score: Number(score),
      totalMarks: Number(totalMarks),
      date: date || new Date(),
    };
    setMarks([newMark, ...marks]);
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

  const averagePercentage = () => {
    if (marks.length === 0) return 0;
    const totalScore = marks.reduce((sum, mark) => sum + mark.score, 0);
    const totalPossibleScore = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
    return totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Marks Manager</CardTitle>
          <CardDescription>Track your academic performance effectively.</CardDescription>
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
                <Input id="score" type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g., 85" />
              </div>
              <div>
                <Label htmlFor="total-marks">Total Marks</Label>
                <Input id="total-marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g., 100" />
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recorded Marks</CardTitle>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Average</p>
              <p className="text-2xl font-bold text-primary">{averagePercentage().toFixed(2)}%</p>
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
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell>{mark.subject}</TableCell>
                    <TableCell>{mark.testName}</TableCell>
                    <TableCell>{mark.score}</TableCell>
                    <TableCell>{mark.totalMarks}</TableCell>
                    <TableCell>{((mark.score / mark.totalMarks) * 100).toFixed(2)}%</TableCell>
                    <TableCell>{format(mark.date, "PP")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteMark(mark.id)} aria-label={`Delete mark for ${mark.testName}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
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
              <p>No marks recorded yet. Add your scores to see them here.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
