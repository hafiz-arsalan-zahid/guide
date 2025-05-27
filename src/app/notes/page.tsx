
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit3, Save, FileText, Loader2, Lock, Unlock, ShieldAlert } from "lucide-react";
import type { Note } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const NOTES_STORAGE_KEY = "notes-data";
const APP_EDIT_LOCKED_KEY = "app-edit-locked";
const PASSKEY = "HappyHunYar#000";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Partial<Note> & { isEditing?: boolean }>({});
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  // Passkey lock state
  const [isLocked, setIsLocked] = useState(true);
  const [passkeyAttempt, setPasskeyAttempt] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Load notes
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes: Note[] = JSON.parse(storedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      toast({ title: "Error", description: "Could not load saved notes.", variant: "destructive" });
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
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes to localStorage:", error);
        toast({ title: "Error", description: "Could not save notes.", variant: "destructive" });
      }
    }
  }, [notes, isMounted, toast]);

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


  const handleSaveNote = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to save notes.", variant: "default" });
      return;
    }
    if (!currentNote.title?.trim()) {
      toast({ title: "Error", description: "Note title cannot be empty.", variant: "destructive" });
      return;
    }

    let updatedNotes;
    if (currentNote.id) { // Editing existing note
      updatedNotes = notes.map(n => n.id === currentNote.id ? { ...n, ...currentNote, title: currentNote.title as string, content: currentNote.content as string, updatedAt: new Date() } as Note : n);
      toast({ title: "Success", description: "Note updated successfully!" });
    } else { // Adding new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: currentNote.title,
        content: currentNote.content || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updatedNotes = [newNote, ...notes];
      toast({ title: "Success", description: "Note created successfully!" });
    }
    setNotes(updatedNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    setCurrentNote({});
    setShowForm(false);
  };

  const startEditing = (note: Note) => {
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to edit notes.", variant: "default" });
      return;
    }
    setCurrentNote({ ...note, isEditing: true });
    setShowForm(true);
  };
  
  const startNewNote = () => {
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to create new notes.", variant: "default" });
      return;
    }
    setCurrentNote({ title: "", content: "", isEditing: true });
    setShowForm(true);
  }

  const deleteNote = (id: string) => {
    if (isLocked) {
      toast({ title: "Locked", description: "Unlock controls to delete notes.", variant: "default" });
      return;
    }
    setNotes(notes.filter((note) => note.id !== id).sort((a,b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    toast({ title: "Note Deleted", description: "The note has been removed." });
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
              ? "Enter passkey to enable editing for this session." 
              : "Controls are currently unlocked. You can add, edit, or delete items."}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">My Notes</CardTitle>
            <CardDescription>Create, edit, and manage your text-based notes. {isLocked && "(Controls Locked)"}</CardDescription>
          </div>
          {!showForm && (
             <Button onClick={startNewNote} disabled={isLocked}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Note
            </Button>
          )}
        </CardHeader>
        {showForm && (
          <CardContent>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={currentNote.title || ""}
                  onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  placeholder="Note Title"
                  disabled={isLocked}
                />
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={currentNote.content || ""}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  placeholder="Write your note here..."
                  rows={8}
                  disabled={isLocked}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLocked}>
                  <Save className="mr-2 h-4 w-4" /> {currentNote.id ? "Save Changes" : "Create Note"}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setCurrentNote({}); }} disabled={isLocked}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {notes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className={`flex flex-col hover:shadow-xl transition-shadow duration-300 ${isLocked ? 'opacity-70' : ''}`}>
              <CardHeader>
                <CardTitle className="truncate">{note.title}</CardTitle>
                <CardDescription>
                  Last updated: {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                  {note.content || "No content."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => startEditing(note)} aria-label={`Edit note: ${note.title}`} disabled={isLocked}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deleteNote(note.id)} aria-label={`Delete note: ${note.title}`} disabled={isLocked}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>You have no notes yet. {isLocked ? "Unlock controls to create one." : `Click "New Note" to create one.`}</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

    