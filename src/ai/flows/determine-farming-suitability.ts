'use server';

/**
 * @fileOverview Determines the suitability of a location for vertical or traditional farming.
 *
 * - determineFarmingSuitability - A function that determines the farming suitability.
 * - FarmingSuitabilityInput - The input type for the determineFarmingSuitability function.
 * - FarmingSuitabilityOutput - The return type for the determineFarmingSuitability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FarmingSuitabilityInputSchema = z.object({
  fieldSize: z.number().describe('The size of the field in acres.'),
  fieldWidth: z.number().describe('The width of the field in feet.'),
  geolocation: z.string().describe('The geolocation of the field (e.g., latitude, longitude).'),
  sunlightExposure: z.string().describe('The amount of sunlight the field receives (e.g., full sun, partial shade).'),
});
export type FarmingSuitabilityInput = z.infer<typeof FarmingSuitabilityInputSchema>;

const FarmingSuitabilityOutputSchema = z.object({
  farmingType: z.enum(['vertical', 'traditional']).describe('The recommended farming type (vertical or traditional).'),
  analysis: z.string().describe('An analysis of why the recommended farming type is suitable.'),
  verticalFarmingCostAnalysis: z.string().optional().describe('An analysis of the potential cost for vertical farming in this location, if traditional farming is recommended.'),
});
export type FarmingSuitabilityOutput = z.infer<typeof FarmingSuitabilityOutputSchema>;

export async function determineFarmingSuitability(input: FarmingSuitabilityInput): Promise<FarmingSuitabilityOutput> {
  return determineFarmingSuitabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineFarmingSuitabilityPrompt',
  input: {schema: FarmingSuitabilityInputSchema},
  output: {schema: FarmingSuitabilityOutputSchema},
  prompt: `You are an expert agricultural consultant. Your job is to analyze various factors of a location and determine the
best farming method for the location.

Analyze the following data to determine whether vertical or traditional farming is better suited for the location:

Field Size: {{{fieldSize}}} acres
Field Width: {{{fieldWidth}}} feet
Geolocation: {{{geolocation}}}
Sunlight Exposure: {{{sunlightExposure}}}

Consider the following factors:

*   Vertical farming is typically better suited for locations with limited space or poor soil quality.
*   Traditional farming is typically better suited for locations with ample space and good soil quality.
*   Sunlight is important for both vertical and traditional farming, but vertical farming can supplement with artificial light.
*   Cost is also a factor. Vertical farming has higher upfront costs but can have lower operating costs.

Based on your analysis, recommend either \"vertical\" or \"traditional\" farming. In the analysis, explain your reasoning, referencing the provided data.

{{#if (eq farmingType \"traditional\")}}
Also provide a potential cost analysis of vertical farming in this location, considering the factors above.
{{/if}}`,
});

const determineFarmingSuitabilityFlow = ai.defineFlow(
  {
    name: 'determineFarmingSuitabilityFlow',
    inputSchema: FarmingSuitabilityInputSchema,
    outputSchema: FarmingSuitabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
