
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, ListChecks, Loader2, Lock, Unlock, ShieldAlert, Badge } from "lucide-react";
import type { Todo, TodoPriority } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const TODOS_STORAGE_KEY = "todos-data";
const APP_EDIT_LOCKED_KEY = "app-edit-locked"; // Session storage key
const PASSKEY = "HappyHunYar#000";

const priorityColors: Record<TodoPriority, string> = {
  High: "bg-red-500/20 text-red-700 dark:text-red-400",
  Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  Low: "bg-green-500/20 text-green-700 dark:text-green-400",
};


export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>();
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority | undefined>();

  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  // Passkey lock state
  const [isLocked, setIsLocked] = useState(true);
  const [passkeyAttempt, setPasskeyAttempt] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Load todos
    try {
      const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
      if (storedTodos) {
        const parsedTodos: Todo[] = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage:", error);
      toast({ title: "Error", description: "Could not load saved todos.", variant: "destructive" });
    }

    // Check lock state from session storage
    const appEditLocked = sessionStorage.getItem(APP_EDIT_LOCKED_KEY);
    if (appEditLocked === 'false') { // Explicitly check for 'false'
      setIsLocked(false);
    } else {
      setIsLocked(true); // Default to locked or if key is 'true' or not set
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) { 
      try {
        localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to localStorage:", error);
        toast({ title: "Error", description: "Could not save todos.", variant: "destructive" });
      }
    }
  }, [todos, isMounted, toast]);

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

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast({ title: "Locked", description: "Please unlock controls to add a todo.", variant: "default" });
      return;
    }
    if (!newTodoText.trim()) {
      toast({ title: "Error", description: "Todo text cannot be empty.", variant: "destructive" });
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      category: newTodoCategory || undefined,
      dueDate: newTodoDueDate,
      priority: newTodoPriority,
    };
    setTodos([newTodo, ...todos]);
    setNewTodoText("");
    setNewTodoCategory("");
    setNewTodoDueDate(undefined);
    setNewTodoPriority(undefined);
    toast({ title: "Success", description: "Todo added successfully!" });
  };

  const toggleTodo = (id: string) => {
    if (isLocked) {
      toast({ title: "Locked", description: "Please unlock controls to modify todos.", variant: "default" });
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    if (isLocked) {
      toast({ title: "Locked", description: "Please unlock controls to delete todos.", variant: "default" });
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({ title: "Todo Deleted", description: "The todo item has been removed." });
  };
  
  const categories = ["Work", "Personal", "Study", "Urgent"];
  const priorities: TodoPriority[] = ["Low", "Medium", "High"];

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
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Todo List</CardTitle>
          <CardDescription>Organize your tasks and stay productive. {isLocked && "(Controls Locked)"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="todo-text">New Todo</Label>
              <Input
                id="todo-text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="What needs to be done?"
                disabled={isLocked}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="todo-priority">Priority</Label>
                 <Select 
                    value={newTodoPriority} 
                    onValueChange={(value) => setNewTodoPriority(value as TodoPriority)}
                    disabled={isLocked}
                  >
                  <SelectTrigger id="todo-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-category">Category (Optional)</Label>
                 <Select 
                    value={newTodoCategory} 
                    onValueChange={(value) => setNewTodoCategory(value === "_none_" ? "" : value)}
                    disabled={isLocked}
                  >
                  <SelectTrigger id="todo-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    <SelectItem value="_none_">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-due-date">Due Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!newTodoDueDate && "text-muted-foreground"}`}
                      disabled={isLocked}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTodoDueDate ? format(newTodoDueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTodoDueDate}
                      onSelect={setNewTodoDueDate}
                      initialFocus
                      disabled={isLocked}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={isLocked}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Todo
            </Button>
          </form>
        </CardContent>
      </Card>

      {todos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Active Todos</CardTitle>
             {isLocked && <CardDescription className="text-orange-600">Controls are locked. Unlock to manage todos.</CardDescription>}
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center justify-between p-3 bg-card border rounded-md  transition-colors ${!isLocked ? 'hover:bg-secondary/70' : 'opacity-70'}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                      disabled={isLocked}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "text-card-foreground"} cursor-pointer`}
                    >
                      {todo.text}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {todo.priority && (
                          <span className={`text-xs ${priorityColors[todo.priority]} ${todo.completed ? 'bg-muted text-muted-foreground' : ''} px-1.5 py-0.5 rounded-full font-medium`}>
                            <Badge variant="outline" className={`border-none p-0 text-xs ${priorityColors[todo.priority]} ${todo.completed ? 'bg-muted text-muted-foreground' : ''}`}>{todo.priority} Priority</Badge>
                          </span>
                        )}
                        {todo.category && (
                          <span className={`text-xs ${todo.completed ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'} px-1.5 py-0.5 rounded-full`}>
                            {todo.category}
                          </span>
                        )}
                      </div>
                      {todo.dueDate && (
                        <p className={`text-xs ${todo.completed ? "text-muted-foreground/70" : "text-muted-foreground"} mt-1`}>
                          Due: {format(todo.dueDate, "PPP")}
                        </p>
                      )}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} aria-label={`Delete todo: ${todo.text}`} disabled={isLocked}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <ListChecks className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>No todos yet. {isLocked ? "Unlock controls to add tasks." : "Add some tasks to get started!"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
