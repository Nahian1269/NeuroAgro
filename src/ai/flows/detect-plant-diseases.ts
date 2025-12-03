'use server';

/**
 * @fileOverview Detects plant diseases from uploaded images using a trained machine learning model.
 *               The model is called via tool.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 * - DetectPlantDiseaseInput - The input type for the detectPlantDisease function.
 * - DetectPlantDiseaseOutput - The return type for the detectPlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPlantDiseaseInput = z.infer<typeof DetectPlantDiseaseInputSchema>;

const DetectPlantDiseaseOutputSchema = z.object({
  diseaseDetected: z.boolean().describe('Whether a disease is detected in the image.'),
  diagnosis: z.string().describe('The diagnosis of the plant disease, if any.'),
  recommendations: z.string().describe('Recommendations for treating the plant disease, if any.'),
});
export type DetectPlantDiseaseOutput = z.infer<typeof DetectPlantDiseaseOutputSchema>;

export async function detectPlantDisease(input: DetectPlantDiseaseInput): Promise<DetectPlantDiseaseOutput> {
  return detectPlantDiseaseFlow(input);
}

const plantDiseaseAnalysisTool = ai.defineTool(
  {
    name: 'plantDiseaseAnalysis',
    description: 'Analyzes an image of a plant and returns whether a disease is detected, the diagnosis, and recommendations for treatment.',
    inputSchema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
    outputSchema: z.object({
      diseaseDetected: z.boolean().describe('Whether a disease is detected in the image.'),
      diagnosis: z.string().describe('The diagnosis of the plant disease, if any.'),
      recommendations: z.string().describe('Recommendations for treating the plant disease, if any.'),
    }),
  },
  async input => {
    // TODO: Implement the machine learning model integration here
    // This is a placeholder implementation that always returns false
    return {
      diseaseDetected: false,
      diagnosis: 'No disease detected',
      recommendations: 'No action needed',
    };
  }
);

const detectPlantDiseasePrompt = ai.definePrompt({
  name: 'detectPlantDiseasePrompt',
  input: {schema: DetectPlantDiseaseInputSchema},
  output: {schema: DetectPlantDiseaseOutputSchema},
  tools: [plantDiseaseAnalysisTool],
  prompt: `You are an expert in plant pathology. You will analyze the image of the plant and determine if there are any diseases present using the plantDiseaseAnalysis tool.

  Based on the image, provide a diagnosis and recommendations for treatment, if a disease is detected. If no disease is detected, indicate that the plant appears healthy.

  Image: {{media url=photoDataUri}}`,
});

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
    inputSchema: DetectPlantDiseaseInputSchema,
    outputSchema: DetectPlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await detectPlantDiseasePrompt(input);
    return output!;
  }
);
