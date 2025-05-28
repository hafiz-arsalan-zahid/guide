
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Palette, Database, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Application Settings</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Customize your FocusFlow experience. Manage preferences for appearance, notifications, and your account.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center gap-3">
            <Palette className="w-7 h-7 text-primary" />
            <div>
              <CardTitle className="text-xl">Appearance</CardTitle>
              <CardDescription>Adjust how the application looks and feels.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
              <Label htmlFor="theme-toggle-button" className="text-base">Theme</Label>
              <ThemeToggle />
            </div>
            <div className="p-4 border rounded-lg space-y-3 bg-background/50">
              <Label htmlFor="default-view" className="text-base">Default Dashboard View</Label>
              <Select defaultValue="overview">
                <SelectTrigger id="default-view" className="w-full">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="todos">Todo List</SelectItem>
                  <SelectItem value="marks">Marks Manager</SelectItem>
                  <SelectItem value="notes">Quick Notes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose what you see first when you open the app.</p>
            </div>
             <div className="p-4 border rounded-lg space-y-3 bg-background/50">
                <Label htmlFor="font-size" className="text-base">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size" className="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Adjust the text size across the application.</p>
              </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            <div>
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription>Manage how you receive alerts and updates.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg space-y-4 bg-background/50">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span className="text-base">Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground text-sm">
                    Receive important updates via email.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span className="text-base">Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground text-sm">
                    Get real-time alerts on your device.
                  </span>
                </Label>
                <Switch id="push-notifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="task-reminders" className="flex flex-col space-y-1">
                  <span className="text-base">Task Reminders</span>
                  <span className="font-normal leading-snug text-muted-foreground text-sm">
                    Get notified for upcoming due dates.
                  </span>
                </Label>
                <Switch id="task-reminders" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="w-7 h-7 text-primary" />
            <div>
              <CardTitle className="text-xl">Account</CardTitle>
              <CardDescription>Manage your profile and security.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg space-y-4 bg-background/50">
              <div>
                <Label htmlFor="username" className="text-base">Username</Label>
                <Input id="username" defaultValue="CurrentUser" className="mt-1 text-base" />
              </div>
              <div>
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@example.com" className="mt-1 text-base" />
              </div>
              <Button variant="outline" className="w-full">Change Password</Button>
              <Button variant="destructive" className="w-full">Delete Account</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Placeholder */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
             <div>
              <CardTitle className="text-xl">Data Management</CardTitle>
              <CardDescription>Export or manage your application data.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg space-y-3 bg-background/50">
               <Button variant="outline" className="w-full">Export My Data</Button>
               <p className="text-sm text-muted-foreground text-center pt-2">
                Options for importing or clearing specific data sets will be available here in the future.
              </p>
            </div>
             <div className="p-4 border border-destructive/30 rounded-lg space-y-3 bg-destructive/5">
                <Label htmlFor="passkey-setting" className="text-base flex items-center gap-2 text-destructive">
                    <ShieldCheck className="w-5 h-5"/> Passkey Management
                </Label>
                <Input id="passkey-setting" type="password" placeholder="Enter current passkey to change" className="mt-1 text-base"/>
                <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">Change Master Passkey</Button>
                 <p className="text-xs text-destructive/80">
                    The master passkey protects editing functionalities across the app. Changing it requires the current passkey.
                  </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
