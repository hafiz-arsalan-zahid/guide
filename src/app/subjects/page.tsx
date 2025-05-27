"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Link as LinkIcon, BookOpen, Loader2 } from "lucide-react";
import type { Subject } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const SUBJECTS_STORAGE_KEY = "subjects-data";

const subjectColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSubjects = localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }
    } catch (error) {
      console.error("Failed to load subjects from localStorage:", error);
      toast({ title: "Error", description: "Could not load saved subjects.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
      } catch (error) {
        console.error("Failed to save subjects to localStorage:", error);
        toast({ title: "Error", description: "Could not save subjects.", variant: "destructive" });
      }
    }
  }, [subjects, isMounted, toast]);

  const handleAddSubject = (e: FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      toast({ title: "Error", description: "Subject name cannot be empty.", variant: "destructive" });
      return;
    }
    const randomColor = subjectColors[Math.floor(Math.random() * subjectColors.length)];
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      teacher: teacherName || undefined,
      resourceUrl: resourceUrl || undefined,
      color: randomColor,
    };
    setSubjects([newSubject, ...subjects].sort((a,b) => a.name.localeCompare(b.name)));
    setSubjectName("");
    setTeacherName("");
    setResourceUrl("");
    toast({ title: "Success", description: "Subject added successfully!" });
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    toast({ title: "Subject Deleted", description: "The subject has been removed." });
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Subjects Manager</CardTitle>
          <CardDescription>Organize your courses and related information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input id="subject-name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g., Quantum Physics" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher-name">Teacher/Instructor (Optional)</Label>
                <Input id="teacher-name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="e.g., Dr. Einstein" />
              </div>
              <div>
                <Label htmlFor="resource-url">Online Resource URL (Optional)</Label>
                <Input id="resource-url" type="url" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="e.g., https://example.com/quantum-notes" />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </form>
        </CardContent>
      </Card>

      {subjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 relative">
                <div className={`w-full h-2 ${subject.color || 'bg-gray-300'} rounded-t-md absolute top-0 left-0 right-0`}></div>
                <div className="pt-4 flex items-center justify-between">
                  <CardTitle>{subject.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => deleteSubject(subject.id)} aria-label={`Delete subject ${subject.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {subject.teacher && (
                  <CardDescription>Taught by: {subject.teacher}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                {subject.resourceUrl ? (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={subject.resourceUrl} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="mr-2 h-4 w-4" /> Visit Resource
                    </Link>
                  </Button>
                ): (
                  <p className="text-sm text-muted-foreground italic">No online resource.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>No subjects added yet. Start by adding your courses.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
