
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, NotebookText, MessageSquareQuote, Sparkles, BarChartBig, Settings, LifeBuoy } from "lucide-react";
import Image from "next/image";
import { APP_NAME } from "@/config/app";
import { cn } from "@/lib/utils"; // Ensure cn is imported

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-xl border-primary/30 bg-gradient-to-br from-card to-card/90">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4 mb-3">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <div>
              <CardTitle className="text-4xl font-extrabold tracking-tight text-foreground">Welcome to {APP_NAME}!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">
                Your intelligent command center to organize, learn, and achieve. Let's make today productive.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground/80 mb-6">
            Seamlessly manage your tasks, track academic progress, take smart notes, and unlock insights with AI-powered tools. 
            Everything you need, all in one place.
          </p>
          <Button size="lg" className="text-base py-6 px-8" asChild>
            <Link href="/todos">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardActionCard
          title="My Todos"
          description="Organize tasks, set priorities, and meet deadlines efficiently."
          href="/todos"
          icon={<ListChecks className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-primary/5 hover:bg-primary/10 border-primary/20"
        />
        <DashboardActionCard
          title="Marks Manager"
          description="Track your grades, analyze performance, and get AI insights."
          href="/marks"
          icon={<BarChartBig className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-green-500/5 hover:bg-green-500/10 border-green-500/20"
        />
        <DashboardActionCard
          title="AI Study Guide"
          description="Get smart, AI-powered study suggestions for your exams."
          href="/study-guide"
          icon={<Lightbulb className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/20"
        />
        <DashboardActionCard
          title="Conceptor AI"
          description="Ask anything! Get insightful answers from your versatile AI assistant."
          href="/conceptor"
          icon={<MessageSquareQuote className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20"
        />
        <DashboardActionCard
          title="Quick Notes"
          description="Jot down ideas, thoughts, and important information instantly."
          href="/notes"
          icon={<NotebookText className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20"
        />
         <DashboardActionCard
          title="Settings"
          description="Customize your application preferences and account details."
          href="/settings"
          icon={<Settings className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />}
          className="bg-gray-500/5 hover:bg-gray-500/10 border-gray-500/20"
        />
      </div>

      <Card className="shadow-md mt-4">
        <CardHeader>
          <CardTitle className="text-xl">Productivity Tip of the Day</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6">
          <Image
            src="https://placehold.co/150x150.png"
            alt="Productivity illustration"
            width={120}
            height={120}
            className="rounded-lg shadow-sm shrink-0 object-cover"
            data-ai-hint="abstract idea" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Master the Two-Minute Rule
            </p>
            <p className="text-muted-foreground text-base">
              If a task takes less than two minutes to complete, do it immediately. This simple habit prevents small tasks from piling up and creating a sense of overwhelm. It's amazing how much you can accomplish by tackling these quick wins throughout your day.
            </p>
          </div>
        </CardContent>
      </Card>
       <Card className="shadow-md mt-4">
        <CardHeader>
          <CardTitle className="text-xl">Need Help?</CardTitle>
           <CardDescription>Visit our support center for FAQs and assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-base py-6">
            <Link href="/support">
             <LifeBuoy className="mr-2 h-5 w-5"/> Go to Support Center
            </Link>
          </Button>
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
  className?: string;
}

function DashboardActionCard({ title, description, href, icon, className }: DashboardActionCardProps) {
  return (
    <Card className={cn(
        "hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group border-2",
        "transform hover:-translate-y-1",
        className
      )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between px-5 pb-5">
        <p className="text-base text-muted-foreground mb-5">{description}</p>
        <Button asChild variant="default" size="sm" className="mt-auto w-full sm:w-auto self-start text-base py-2.5 px-5 group-hover:bg-primary/90 transition-colors">
          <Link href={href}>
            Explore <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
