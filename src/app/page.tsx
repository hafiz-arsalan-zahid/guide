
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, NotebookText, MessageSquareQuote, Sparkles } from "lucide-react"; // Changed MessageSquareQuestion to MessageSquareQuote
import Image from "next/image";
import { APP_NAME } from "@/config/app";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg border-primary/30">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-10 h-10 text-primary" />
            <CardTitle className="text-4xl font-bold tracking-tight">Welcome to {APP_NAME}!</CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground">
            Your intelligent dashboard to learn, organize, and achieve. Explore your tools below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <DashboardActionCard
              title="My Todos"
              description="Organize your tasks and deadlines."
              href="/todos"
              icon={<ListChecks className="w-8 h-8 text-primary" />}
            />
            <DashboardActionCard
              title="AI Study Guide"
              description="Get smart study suggestions for exams."
              href="/study-guide"
              icon={<Lightbulb className="w-8 h-8 text-primary" />}
            />
            <DashboardActionCard
              title="Conceptor AI"
              description="Ask anything! Get insightful answers."
              href="/conceptor"
              icon={<MessageSquareQuote className="w-8 h-8 text-primary" />} // Changed
            />
            <DashboardActionCard
              title="Quick Notes"
              description="Jot down ideas and thoughts instantly."
              href="/notes"
              icon={<NotebookText className="w-8 h-8 text-primary" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Productivity Tip of the Day</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Image 
            src="https://placehold.co/120x120.png" 
            alt="Productivity illustration" 
            width={100} 
            height={100} 
            className="rounded-lg shadow-sm shrink-0" 
            data-ai-hint="abstract idea" />
          <div>
            <p className="text-muted-foreground text-base">
              <strong>The Pomodoro Technique:</strong> Work in focused 25-minute intervals (Pomodoros) separated by short 5-minute breaks. After four Pomodoros, take a longer 15-30 minute break. This helps maintain concentration and prevent burnout.
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
    <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 ease-in-out flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild variant="outline" size="sm" className="mt-auto w-full sm:w-auto self-start">
          <Link href={href}>
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
