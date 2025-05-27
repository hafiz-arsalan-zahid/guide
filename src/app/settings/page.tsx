
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input
import { Separator } from "@/components/ui/separator"; // Added Separator

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Settings</CardTitle>
          <CardDescription>Manage your application preferences and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Appearance Settings */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Appearance</h3>
            <div className="flex flex-col space-y-2 p-4 border rounded-lg">
              <Label htmlFor="theme-toggle-button">Theme</Label>
              <div className="flex items-center space-x-2">
                 <ThemeToggle />
                 <span className="text-sm text-muted-foreground">Cycle through Light, Dark, or System theme.</span>
              </div>
            </div>
             <div className="p-4 border rounded-lg space-y-3">
                <Label htmlFor="default-view">Default Dashboard View</Label>
                <Select defaultValue="overview">
                  <SelectTrigger id="default-view" className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="todos">Todo List</SelectItem>
                    <SelectItem value="marks">Marks Manager</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose what you see first when you open the app.</p>
              </div>
          </section>

          <Separator />

          {/* Notification Settings */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Notifications</h3>
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive important updates and reminders via email.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get real-time alerts directly on your device (if supported).
                  </span>
                </Label>
                <Switch id="push-notifications" />
              </div>
            </div>
          </section>
          
          <Separator />

          {/* Account Settings */}
           <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Account</h3>
             <div className="p-4 border rounded-lg space-y-3">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="CurrentUser" className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" className="mt-1"/>
                </div>
                <Button variant="outline">Change Password</Button>
             </div>
          </section>

          <Separator />

          {/* Data Management Placeholder */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Data Management</h3>
            <div className="p-4 border-dashed border-2 border-muted-foreground/30 rounded-md">
              <p className="text-center text-muted-foreground">
                Options for exporting or deleting your data will be available here in the future.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
