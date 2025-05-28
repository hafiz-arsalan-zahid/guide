
'use server';
/**
 * @fileOverview A general-purpose AI question answering agent.
 *
 * - generateConceptorResponse - A function that provides answers to user questions.
 * - GenerateConceptorInput - The input type for the generateConceptorResponse function.
 * - GenerateConceptorOutput - The return type for the generateConceptorResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConceptorInputSchema = z.object({
  question: z.string().describe('The user question to be answered.'),
});
export type GenerateConceptorInput = z.infer<typeof GenerateConceptorInputSchema>;

const GenerateConceptorOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question. Formatted with Markdown, including headings (e.g., ## Section Title), bullet points, and emphasis for clarity and structure.'),
});
export type GenerateConceptorOutput = z.infer<typeof GenerateConceptorOutputSchema>;

export async function generateConceptorResponse(input: GenerateConceptorInput): Promise<GenerateConceptorOutput> {
  return generateConceptorResponseFlow(input);
}

const generateConceptorResponsePrompt = ai.definePrompt({
  name: 'generateConceptorResponsePrompt',
  input: {schema: GenerateConceptorInputSchema},
  output: {schema: GenerateConceptorOutputSchema},
  prompt: `You are Conceptor, a highly knowledgeable and versatile AI assistant. Your primary goal is to provide clear, comprehensive, and informative answers to a wide range of questions on any topic.

When answering, please adhere to the following guidelines:
- Structure your answers effectively using Markdown for readability.
- Use Markdown headings (e.g., '## Main Point', '### Sub-Point') to organize complex information.
- Utilize bullet points ('- ') or numbered lists ('1. ') for lists or sequential steps.
- Employ emphasis (e.g., *italic* for key terms, **bold** for strong emphasis) where appropriate to highlight important concepts.
- If a question is ambiguous, ask for clarification if necessary, but try to provide a helpful response based on the most likely interpretation.
- If you don't know the answer or the question is outside your capabilities, politely state so. Do not invent information.
- Aim for a helpful, friendly, and educational tone.

User's Question:
{{{question}}}

Please provide your answer below:
`,
});

const generateConceptorResponseFlow = ai.defineFlow(
  {
    name: 'generateConceptorResponseFlow',
    inputSchema: GenerateConceptorInputSchema,
    outputSchema: GenerateConceptorOutputSchema,
  },
  async (input) => {
    const {output} = await generateConceptorResponsePrompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a response. Output was null.");
    }
    return output;
  }
);
