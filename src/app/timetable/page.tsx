
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, CalendarRange, Loader2, Lock, Unlock, ShieldAlert } from "lucide-react";
import type { TimetableEntry, Subject } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const TIMETABLE_STORAGE_KEY = "timetable-data";
const SUBJECTS_STORAGE_KEY = "subjects-data"; 
const APP_EDIT_LOCKED_KEY = "app-edit-locked";
const PASSKEY = "HappyHunYar#000";

const daysOfWeek: TimetableEntry['day'][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

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

  // Passkey lock state
  const [isLocked, setIsLocked] = useState(true);
  const [passkeyAttempt, setPasskeyAttempt] = useState("");

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTimetable = localStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (storedTimetable) {
        setTimetable(JSON.parse(storedTimetable)
          .sort((a: TimetableEntry, b: TimetableEntry) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.startTime.localeCompare(b.startTime))
        );
      }
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
    // Check lock state
    const appEditLocked = sessionStorage.getItem(APP_EDIT_LOCKED_KEY);
    if (appEditLocked === 'false') {
      setIsLocked(false);
    } else {
      setIsLocked(true);
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

  const handleUnlockAttempt = () => {
    if (passkeyAttempt === PASSKEY) {
      sessionStorage.setItem(APP_EDIT_LOCKED_KEY, 'false');
      setIsLocked(false);
      setPasskeyAttempt("");
      toast({ title: "Success", description: "Controls unlocked for this session." });
    } else {
      toast({ title: "Error", description: "Incorrect passkey.", variant: "destructive" });
    }
  };

  const handleLockControls = () => {
    sessionStorage.setItem(APP_EDIT_LOCKED_KEY, 'true');
    setIsLocked(true);
    toast({ title: "Controls Locked", description: "Editing has been locked." });
  };

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to add timetable entries.", variant: "default" });
      return;
    }
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
    setSubjectId("");
    setLocation("");
  };

  const deleteEntry = (id: string) => {
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to delete timetable entries.", variant: "default" });
      return;
    }
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
      <Card className="shadow-md border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-orange-600" /> Access Control
          </CardTitle>
          <CardDescription>
            {isLocked 
              ? "Enter passkey to enable editing for this session." 
              : "Controls are currently unlocked. You can add or delete entries."}
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
                <Unlock className="mr-2 h-4 w-4" /> Unlock
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-sm text-green-600 font-medium">Controls Unlocked.</p>
                <Button onClick={handleLockControls} variant="destructive" size="sm">
                    <Lock className="mr-2 h-4 w-4" /> Lock Controls
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Weekly Timetable</CardTitle>
          <CardDescription>Visualize and manage your weekly schedule. {isLocked && "(Controls Locked)"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="day-select">Day</Label>
                <Select value={selectedDay} onValueChange={(val) => setSelectedDay(val as TimetableEntry['day'])} disabled={isLocked}>
                  <SelectTrigger id="day-select"><SelectValue placeholder="Select day" /></SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId} disabled={isLocked}>
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
                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Room 101" disabled={isLocked}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} disabled={isLocked}/>
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} disabled={isLocked}/>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={availableSubjects.length === 0 || isLocked}>
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
            {isLocked && <CardDescription className="text-orange-600">Controls are locked. Unlock to manage timetable.</CardDescription>}
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
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
                      <div key={`${day}-${slot}`} className={`p-1 border-r last:border-r-0 min-h-[50px] relative group flex flex-col gap-0.5 ${isLocked ? 'opacity-70' : ''}`}>
                        {entriesInSlot.map(entry => {
                          const subject = getSubjectById(entry.subjectId);
                          return (
                            <div key={entry.id} className={`p-1.5 rounded text-xs text-white ${subject?.color || 'bg-gray-400'} relative flex-grow flex flex-col justify-center`}>
                              <p className="font-semibold truncate">{subject?.name || 'Unknown Subject'}</p>
                              {entry.location && <p className="text-xs opacity-80 truncate">{entry.location}</p>}
                              {!isLocked && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-0 right-0 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20 focus-visible:opacity-100"
                                  onClick={() => deleteEntry(entry.id)}
                                  aria-label={`Delete ${subject?.name} at ${entry.startTime}`}
                                  disabled={isLocked}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
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
            <p>Your timetable is empty. {isLocked ? "Unlock controls to plan your week." : "Add some entries to plan your week!"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    