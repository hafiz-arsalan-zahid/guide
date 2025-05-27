"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Link as LinkIcon, BookOpen } from "lucide-react";
import type { Subject } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
    setSubjects([newSubject, ...subjects]);
    setSubjectName("");
    setTeacherName("");
    setResourceUrl("");
    toast({ title: "Success", description: "Subject added successfully!" });
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    toast({ title: "Subject Deleted", description: "The subject has been removed." });
  };

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
              <CardHeader className="pb-4">
                <div className={`w-full h-2 ${subject.color || 'bg-gray-300'} rounded-t-md -mt-6 -mx-6 mb-2`}></div>
                <CardTitle className="flex items-center justify-between">
                  {subject.name}
                  <Button variant="ghost" size="icon" onClick={() => deleteSubject(subject.id)} aria-label={`Delete subject ${subject.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
                {subject.teacher && (
                  <CardDescription>Taught by: {subject.teacher}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                {subject.resourceUrl && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={subject.resourceUrl} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="mr-2 h-4 w-4" /> Visit Resource
                    </Link>
                  </Button>
                )}
                {!subject.resourceUrl && <p className="text-sm text-muted-foreground">No online resource link provided.</p>}
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
