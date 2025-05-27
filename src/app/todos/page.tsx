"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, ListChecks } from "lucide-react";
import type { Todo } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const TODOS_STORAGE_KEY = "todos-data";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
  }, [toast]);

  useEffect(() => {
    if (isMounted) { // Only save to localStorage after initial mount and load
      try {
        localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to localStorage:", error);
        toast({ title: "Error", description: "Could not save todos.", variant: "destructive" });
      }
    }
  }, [todos, isMounted, toast]);

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
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
    };
    setTodos([newTodo, ...todos]);
    setNewTodoText("");
    setNewTodoCategory("");
    setNewTodoDueDate(undefined);
    toast({ title: "Success", description: "Todo added successfully!" });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({ title: "Todo Deleted", description: "The todo item has been removed." });
  };
  
  const categories = ["Work", "Personal", "Study", "Urgent"];

  if (!isMounted) {
    return ( // Or a more sophisticated loading skeleton
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Todo List</CardTitle>
          <CardDescription>Organize your tasks and stay productive.</CardDescription>
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
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="todo-category">Category (Optional)</Label>
                 <Select 
                    value={newTodoCategory} 
                    onValueChange={(value) => setNewTodoCategory(value === "_none_" ? "" : value)}
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Todo
            </Button>
          </form>
        </CardContent>
      </Card>

      {todos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Active Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-md hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}
                    >
                      {todo.text}
                      {todo.category && (
                        <span className={`ml-2 text-xs ${todo.completed ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary-foreground'} px-1.5 py-0.5 rounded-full`}>
                          {todo.category}
                        </span>
                      )}
                      {todo.dueDate && (
                        <p className={`text-xs ${todo.completed ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                          Due: {format(todo.dueDate, "PPP")}
                        </p>
                      )}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} aria-label={`Delete todo: ${todo.text}`}>
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
            <p>No todos yet. Add some tasks to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
