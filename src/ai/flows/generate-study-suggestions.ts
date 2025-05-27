'use server';

/**
 * @fileOverview AI-powered study suggestion generator.
 *
 * - generateStudySuggestions - A function that generates study suggestions based on subjects and exam topics.
 * - GenerateStudySuggestionsInput - The input type for the generateStudySuggestions function.
 * - GenerateStudySuggestionsOutput - The return type for the generateStudySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudySuggestionsInputSchema = z.object({
  subjects: z
    .string()
    .describe('List of subjects for the exam preparation.'),
  examTopics: z.string().describe('Specific topics covered in the exam.'),
});

export type GenerateStudySuggestionsInput = z.infer<
  typeof GenerateStudySuggestionsInputSchema
>;

const GenerateStudySuggestionsOutputSchema = z.object({
  studySuggestions: z
    .string()
    .describe('AI-powered study suggestions for the given subjects and topics. Formatted with Markdown, including headings (e.g., ## Section Title), bullet points, and emphasis.'),
});

export type GenerateStudySuggestionsOutput = z.infer<
  typeof GenerateStudySuggestionsOutputSchema
>;

export async function generateStudySuggestions(
  input: GenerateStudySuggestionsInput
): Promise<GenerateStudySuggestionsOutput> {
  return generateStudySuggestionsFlow(input);
}

const generateStudySuggestionsPrompt = ai.definePrompt({
  name: 'generateStudySuggestionsPrompt',
  input: {schema: GenerateStudySuggestionsInputSchema},
  output: {schema: GenerateStudySuggestionsOutputSchema},
  prompt: `You are an AI-powered study guide assistant. A student is preparing for their exams and needs efficient study suggestions.
Please use Markdown for formatting your suggestions. This includes:
- Main sections or topics should use Level 2 Headings (e.g., '## Subject Deep Dive').
- Sub-topics or key points can use Level 3 Headings (e.g., '### Key Concepts in Algebra').
- Use bullet points ('- list item') for actionable tips or lists of resources.
- Use emphasis like '*' or '_' for highlighting important terms or advice.

Given the following subjects and exam topics, provide relevant and actionable study suggestions.

Subjects: {{{subjects}}}
Exam Topics: {{{examTopics}}}

Please structure your response clearly with appropriate Markdown headings and formatting for readability.
## Study Suggestions:`,
});

const generateStudySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateStudySuggestionsFlow',
    inputSchema: GenerateStudySuggestionsInputSchema,
    outputSchema: GenerateStudySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await generateStudySuggestionsPrompt(input);
    return output!;
  }
);
