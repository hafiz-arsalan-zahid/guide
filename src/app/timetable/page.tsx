"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, CalendarRange, Loader2 } from "lucide-react";
import type { TimetableEntry, Subject } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const TIMETABLE_STORAGE_KEY = "timetable-data";
const SUBJECTS_STORAGE_KEY = "subjects-data"; // To load subjects from subject manager

const daysOfWeek: TimetableEntry['day'][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`); // 7 AM to 9 PM (21:00)

const defaultSubjects: Subject[] = [
    { id: "default-math", name: "Mathematics (Default)", color: "bg-blue-500" },
    { id: "default-phy", name: "Physics (Default)", color: "bg-green-500" },
    { id: "default-chem", name: "Chemistry (Default)", color: "bg-red-500" },
];

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>(defaultSubjects);

  const [selectedDay, setSelectedDay] = useState<TimetableEntry['day']>("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [subjectId, setSubjectId] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      // Load Timetable
      const storedTimetable = localStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (storedTimetable) {
        setTimetable(JSON.parse(storedTimetable)
          .sort((a: TimetableEntry, b: TimetableEntry) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.startTime.localeCompare(b.startTime))
        );
      }
      // Load Subjects
      const storedSubjects = localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (storedSubjects) {
        const parsedSubjects: Subject[] = JSON.parse(storedSubjects);
        if (parsedSubjects.length > 0) {
          setAvailableSubjects(parsedSubjects);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      toast({ title: "Error", description: "Could not load saved data.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(timetable));
      } catch (error) {
        console.error("Failed to save timetable to localStorage:", error);
        toast({ title: "Error", description: "Could not save timetable.", variant: "destructive" });
      }
    }
  }, [timetable, isMounted, toast]);


  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!subjectId || !startTime || !endTime) {
      toast({ title: "Error", description: "Please select subject, start time, and end time.", variant: "destructive" });
      return;
    }
    if (new Date(`1970/01/01 ${startTime}`) >= new Date(`1970/01/01 ${endTime}`)) {
        toast({ title: "Error", description: "End time must be after start time.", variant: "destructive" });
        return;
    }

    const newEntry: TimetableEntry = {
      id: Date.now().toString(),
      day: selectedDay,
      startTime,
      endTime,
      subjectId,
      location: location || undefined,
    };
    setTimetable([...timetable, newEntry].sort((a,b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.startTime.localeCompare(b.startTime)));
    toast({ title: "Success", description: "Timetable entry added." });
    // Reset form partially
    setSubjectId("");
    setLocation("");
  };

  const deleteEntry = (id: string) => {
    setTimetable(timetable.filter(entry => entry.id !== id));
    toast({ title: "Entry Deleted", description: "Timetable entry removed." });
  };
  
  const getSubjectById = (id: string) => availableSubjects.find(s => s.id === id);

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
          <CardTitle className="text-2xl font-semibold">Weekly Timetable</CardTitle>
          <CardDescription>Visualize and manage your weekly schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="day-select">Day</Label>
                <Select value={selectedDay} onValueChange={(val) => setSelectedDay(val as TimetableEntry['day'])}>
                  <SelectTrigger id="day-select"><SelectValue placeholder="Select day" /></SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger id="subject-select"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {availableSubjects.length > 0 ? 
                      availableSubjects.map(sub => <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>) :
                      <SelectItem value="" disabled>No subjects available. Add subjects in Subject Manager.</SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Room 101" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={availableSubjects.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Timetable
            </Button>
             {availableSubjects.length === 0 && <p className="text-sm text-destructive">Please add subjects in the 'Subjects' page first to create timetable entries.</p>}
          </form>
        </CardContent>
      </Card>

      {timetable.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]"> {/* Ensure horizontal scroll for smaller screens */}
              <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
                <div className="p-2 font-semibold border-r sticky left-0 bg-card z-10">Time</div>
                {daysOfWeek.map(day => <div key={day} className="p-2 font-semibold text-center border-r last:border-r-0">{day.substring(0,3)}</div>)}
              </div>
              {timeSlots.map(slot => (
                <div key={slot} className="grid grid-cols-[100px_repeat(7,1fr)] border-b items-stretch">
                  <div className="p-2 border-r text-sm text-muted-foreground sticky left-0 bg-card z-10">{slot}</div>
                  {daysOfWeek.map(day => {
                    const entriesInSlot = timetable.filter(entry => entry.day === day && entry.startTime <= slot && entry.endTime > slot);
                    return (
                      <div key={`${day}-${slot}`} className="p-1 border-r last:border-r-0 min-h-[50px] relative group flex flex-col gap-0.5">
                        {entriesInSlot.map(entry => {
                          const subject = getSubjectById(entry.subjectId);
                          return (
                            <div key={entry.id} className={`p-1.5 rounded text-xs text-white ${subject?.color || 'bg-gray-400'} relative flex-grow flex flex-col justify-center`}>
                              <p className="font-semibold truncate">{subject?.name || 'Unknown Subject'}</p>
                              {entry.location && <p className="text-xs opacity-80 truncate">{entry.location}</p>}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20 focus-visible:opacity-100"
                                onClick={() => deleteEntry(entry.id)}
                                aria-label={`Delete ${subject?.name} at ${entry.startTime}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
             <CalendarRange className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>Your timetable is empty. Add some entries to plan your week!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
