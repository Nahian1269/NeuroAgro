'use server';

/**
 * @fileOverview Estimates the potential costs associated with implementing vertical farming in a specific location.
 *
 * - estimateVerticalFarmingCosts - A function that estimates the costs of vertical farming.
 * - EstimateVerticalFarmingCostsInput - The input type for the estimateVerticalFarmingCosts function.
 * - EstimateVerticalFarmingCostsOutput - The return type for the estimateVerticalFarmingCosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateVerticalFarmingCostsInputSchema = z.object({
  fieldSize: z.number().describe('The size of the field in acres.'),
  fieldWidth: z.number().describe('The width of the field in feet.'),
  geolocation: z.string().describe('The geolocation of the field (e.g., latitude, longitude).'),
  sunlightAvailability: z.string().describe('The availability of sunlight in the location (e.g., high, medium, low).'),
});
export type EstimateVerticalFarmingCostsInput = z.infer<typeof EstimateVerticalFarmingCostsInputSchema>;

const EstimateVerticalFarmingCostsOutputSchema = z.object({
  infrastructureCosts: z.number().describe('Estimated costs for building the vertical farming infrastructure.'),
  energyCosts: z.number().describe('Estimated annual energy costs for the vertical farm.'),
  maintenanceCosts: z.number().describe('Estimated annual maintenance costs for the vertical farm.'),
  totalInitialInvestment: z.number().describe('Total initial investment required for vertical farming.'),
  roiAnalysis: z.string().describe('Analysis of the potential return on investment (ROI) for vertical farming in this location.')
});
export type EstimateVerticalFarmingCostsOutput = z.infer<typeof EstimateVerticalFarmingCostsOutputSchema>;

export async function estimateVerticalFarmingCosts(input: EstimateVerticalFarmingCostsInput): Promise<EstimateVerticalFarmingCostsOutput> {
  return estimateVerticalFarmingCostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateVerticalFarmingCostsPrompt',
  input: {schema: EstimateVerticalFarmingCostsInputSchema},
  output: {schema: EstimateVerticalFarmingCostsOutputSchema},
  prompt: `You are an expert in agricultural economics and vertical farming.
  Based on the following data, estimate the potential costs associated with implementing vertical farming in this location. Include infrastructure, energy, and maintenance costs.

  Field Size: {{fieldSize}} acres
  Field Width: {{fieldWidth}} feet
  Geolocation: {{geolocation}}
  Sunlight Availability: {{sunlightAvailability}}

  Provide a detailed breakdown of the estimated costs, including a total initial investment figure and a return on investment (ROI) analysis. Take into account the location's sunlight, geolocation, field size and field width.

  Consider these factors when making your estimates:
  - Infrastructure costs: Construction, materials, and installation of vertical farming systems.
  - Energy costs: Electricity for lighting, climate control, and other systems.
  - Maintenance costs: Labor, repairs, and replacement of equipment.
`,
});

const estimateVerticalFarmingCostsFlow = ai.defineFlow(
  {
    name: 'estimateVerticalFarmingCostsFlow',
    inputSchema: EstimateVerticalFarmingCostsInputSchema,
    outputSchema: EstimateVerticalFarmingCostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
