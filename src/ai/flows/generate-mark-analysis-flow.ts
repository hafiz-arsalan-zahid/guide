
'use server';
/**
 * @fileOverview AI-powered mark analysis and suggestion generator.
 *
 * - generateMarkAnalysis - A function that analyzes student marks and provides feedback.
 * - GenerateMarkAnalysisInput - The input type for the generateMarkAnalysis function.
 * - GenerateMarkAnalysisOutput - The return type for the generateMarkAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubjectPerformanceSchema = z.object({
  subjectName: z.string().describe('The name of the subject.'),
  averagePercentage: z.number().describe('The average percentage achieved in this subject.'),
  testCount: z.number().describe('The number of tests/assignments recorded for this subject.'),
  grade: z.string().describe('The overall grade for this subject (e.g., A+, B, F).'),
});

export const GenerateMarkAnalysisInputSchema = z.object({
  studentName: z.string().optional().describe("The student's name, if available (e.g., Ahmad)."),
  subjectPerformances: z.array(SubjectPerformanceSchema).describe('An array of performance data for each subject.'),
  overallAverage: z.number().describe('The overall average percentage across all subjects.'),
  overallGrade: z.string().describe('The overall grade across all subjects (e.g., A, C).'),
});
export type GenerateMarkAnalysisInput = z.infer<typeof GenerateMarkAnalysisInputSchema>;

export const GenerateMarkAnalysisOutputSchema = z.object({
  analysisTitle: z.string().describe("A catchy, positive, and encouraging title for the analysis report (e.g., 'Your Path to Success!', 'Keep Up the Great Work! Highlights & Tips')."),
  overallFeedback: z.string().describe("General feedback based on the overall performance. Should be constructive and balanced, mentioning strengths and areas for improvement. Should be 2-3 sentences."),
  subjectSpecificSuggestions: z.array(z.object({
    subjectName: z.string().describe("The name of the subject for which the suggestion is being made."),
    suggestion: z.string().describe("A specific, actionable suggestion for this subject. Max 2-3 sentences. Focus on study techniques, resource utilization, or specific topics if applicable.")
  })).describe("Detailed suggestions for 2-3 key subjects. Prioritize subjects needing improvement (Grade C or below, or percentage below 70%). If all subjects are strong, pick 1-2 to reinforce good habits or suggest advanced topics."),
  encouragement: z.string().describe("A final encouraging and motivational message for the student. Should be 1-2 sentences.")
});
export type GenerateMarkAnalysisOutput = z.infer<typeof GenerateMarkAnalysisOutputSchema>;

export async function generateMarkAnalysis(input: GenerateMarkAnalysisInput): Promise<GenerateMarkAnalysisOutput> {
  return generateMarkAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarkAnalysisPrompt',
  input: {schema: GenerateMarkAnalysisInputSchema},
  output: {schema: GenerateMarkAnalysisOutputSchema},
  prompt: `You are an expert, friendly, and insightful academic advisor AI. Your goal is to provide constructive feedback and actionable study suggestions to {{#if studentName}}{{studentName}}{{else}}the student{{/if}} based on their academic performance.

Student's Performance Overview:
- Overall Average: {{overallAverage}}%
- Overall Grade: {{overallGrade}}

Subject Breakdown:
{{#if subjectPerformances.length}}
{{#each subjectPerformances}}
- Subject: {{this.subjectName}}
  - Average Percentage: {{this.averagePercentage}}%
  - Grade: {{this.grade}}
  - Number of Tests: {{this.testCount}}
{{/each}}
{{else}}
- No specific subject data provided.
{{/if}}

Please generate an analysis with the following components, adhering strictly to the output schema:
1.  analysisTitle: Craft an encouraging and relevant title for this feedback report. Make it positive.
2.  overallFeedback: Summarize the student's overall performance. Highlight strengths and identify general areas for improvement in a constructive manner. (2-3 sentences)
3.  subjectSpecificSuggestions:
    - Identify 2-3 key subjects for specific feedback.
    - Prioritize subjects where the grade is 'C', 'D', 'F', or the average percentage is below 70%. For these, provide actionable suggestions like focusing on specific topics, trying different study techniques (e.g., practice problems, concept mapping, teaching it to someone else), or utilizing specific resources (e.g., textbook chapters, online tutorials, teacher's office hours).
    - If most subjects are strong (Grade 'B' or above, or percentage 70% and above), pick 1-2 subjects. Acknowledge the good work and suggest how to maintain momentum, explore advanced topics, or apply knowledge in new ways.
    - Each suggestion should be concise (max 2-3 sentences).
4.  encouragement: Conclude with a positive and motivational message to encourage the student. (1-2 sentences)

Focus on providing practical and supportive advice.
`,
});

const generateMarkAnalysisFlow = ai.defineFlow(
  {
    name: 'generateMarkAnalysisFlow',
    inputSchema: GenerateMarkAnalysisInputSchema,
    outputSchema: GenerateMarkAnalysisOutputSchema,
  },
  async (input) => {
    // Basic validation or preprocessing if needed
    if (input.subjectPerformances.length === 0 && input.overallAverage === 0) {
        // Potentially return a default "not enough data" message structured like the output
        // For now, let the LLM handle it based on the prompt.
    }

    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to generate an analysis. Output was null.");
    }
    return output;
  }
);
