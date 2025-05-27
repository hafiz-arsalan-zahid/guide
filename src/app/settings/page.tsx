"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle"; // Re-added ThemeToggle for settings page
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Settings</CardTitle>
          <CardDescription>Manage your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="theme-toggle-button">Theme</Label>
            <div className="flex items-center space-x-2">
               <ThemeToggle />
               <span className="text-sm text-muted-foreground">Change the application theme (Light, Dark, System).</span>
            </div>
          </div>
          
          {/* Placeholder for future settings */}
          <div className="p-4 border-dashed border-2 border-muted-foreground/30 rounded-md">
            <p className="text-center text-muted-foreground">
              More settings will be available here in the future.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
