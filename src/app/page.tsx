import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, NotebookText } from "lucide-react";
import Image from "next/image";
import { APP_NAME } from "@/config/app";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">Welcome to {APP_NAME}!</CardTitle>
          <CardDescription className="text-lg">
            Your central place to organize tasks, manage studies, and boost productivity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Navigate through your tools using the sidebar. Let's get things done!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardActionCard
              title="My Todos"
              description="Stay on top of your tasks."
              href="/todos"
              icon={<ListChecks className="w-8 h-8 text-primary" />}
            />
            <DashboardActionCard
              title="AI Study Guide"
              description="Get smart study suggestions."
              href="/study-guide"
              icon={<Lightbulb className="w-8 h-8 text-primary" />}
            />
            <DashboardActionCard
              title="Quick Notes"
              description="Jot down your thoughts."
              href="/notes"
              icon={<NotebookText className="w-8 h-8 text-primary" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Productivity Tip</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Image src="https://placehold.co/100x100.png" alt="Productivity illustration" width={100} height={100} className="rounded-md" data-ai-hint="illustration productivity" />
          <div>
            <p className="text-muted-foreground">
              Break down large tasks into smaller, manageable steps. This makes them less daunting and easier to start. Celebrate small wins!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function DashboardActionCard({ title, description, href, icon }: DashboardActionCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>
            Go to {title.split(' ')[1] || title} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
