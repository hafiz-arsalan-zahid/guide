
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, Mail, MessageSquare, BookOpen, Search } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How do I reset my passkey?",
    answer: "Currently, passkey reset is not self-service. If you've forgotten your passkey, you might need to clear application data or contact support if a more robust account system is implemented in the future."
  },
  {
    question: "Is my data stored online?",
    answer: "This application primarily uses your browser's local storage. This means data is stored on your device and not automatically synced across multiple devices or browsers unless a backend system is integrated."
  },
  {
    question: "How does the AI Study Guide work?",
    answer: "The AI Study Guide uses a Genkit AI model to process the subjects and exam topics you provide. It then generates study suggestions based on this input. The quality of suggestions can depend on the clarity and detail of your input."
  },
  {
    question: "Can I export my notes or marks?",
    answer: "Data export functionality is planned for a future update. You can find a placeholder for this in the Settings page."
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <LifeBuoy className="w-8 h-8 text-primary" /> Support Center
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground mt-1">
                Find help and resources for FocusFlow. We're here to assist you!
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm mt-2 sm:mt-0">
              <Input type="search" placeholder="Search help articles..." className="pl-10 text-base" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs Section */}
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions about using FocusFlow.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-base text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact & Resources Section */}
        <div className="space-y-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Contact Support</CardTitle>
              <CardDescription>Can't find an answer? Reach out to us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full text-base py-6" asChild variant="outline">
                <Link href="mailto:support@example.com">
                  <Mail className="mr-2 h-5 w-5" /> Email Support
                </Link>
              </Button>
              <Button className="w-full text-base py-6" asChild variant="outline">
                <Link href="/community-forum-link"> {/* Placeholder Link */}
                  <MessageSquare className="mr-2 h-5 w-5" /> Community Forum
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Response times may vary. Please check FAQs first.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Documentation</CardTitle>
              <CardDescription>Explore guides and tutorials.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full text-base py-6" asChild>
                <Link href="/docs-link"> {/* Placeholder Link */}
                  <BookOpen className="mr-2 h-5 w-5" /> View Documentation
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

