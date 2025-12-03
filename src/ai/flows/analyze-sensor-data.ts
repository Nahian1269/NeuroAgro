'use server';

/**
 * @fileOverview Analyzes real-time sensor data and provides actionable insights for farmers.
 *
 * - analyzeSensorData - A function that takes sensor data as input and returns farming insights.
 * - AnalyzeSensorDataInput - The input type for the analyzeSensorData function.
 * - AnalyzeSensorDataOutput - The return type for the analyzeSensorData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSensorDataInputSchema = z.object({
  soilMoisture: z.number().describe('Soil moisture level (percentage).'),
  temperature: z.number().describe('Temperature in Celsius.'),
  humidity: z.number().describe('Humidity level (percentage).'),
  pH: z.number().describe('pH level of the soil.'),
  lightIntensity: z.number().describe('Light intensity (lumens).'),
  gasLevels: z
    .object({
      CO2: z.number().describe('Carbon Dioxide level (ppm).'),
      NH3: z.number().describe('Ammonia level (ppm).'),
    })
    .describe('Gas levels in the environment.'),
});
export type AnalyzeSensorDataInput = z.infer<typeof AnalyzeSensorDataInputSchema>;

const AnalyzeSensorDataOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Actionable insights based on the sensor data, including potential nutrient deficiencies, disease risks, and recommendations.'
    ),
});
export type AnalyzeSensorDataOutput = z.infer<typeof AnalyzeSensorDataOutputSchema>;

export async function analyzeSensorData(input: AnalyzeSensorDataInput): Promise<AnalyzeSensorDataOutput> {
  return analyzeSensorDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSensorDataPrompt',
  input: {schema: AnalyzeSensorDataInputSchema},
  output: {schema: AnalyzeSensorDataOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following sensor data and provide actionable insights to the farmer. Focus on potential nutrient deficiencies, disease risks, and recommendations for optimizing crop management.

Sensor Data:
Soil Moisture: {{soilMoisture}}%
Temperature: {{temperature}}°C
Humidity: {{humidity}}%
pH: {{pH}}
Light Intensity: {{lightIntensity}} lumens
Gas Levels: CO2: {{gasLevels.CO2}} ppm, NH3: {{gasLevels.NH3}} ppm`,
});

const analyzeSensorDataFlow = ai.defineFlow(
  {
    name: 'analyzeSensorDataFlow',
    inputSchema: AnalyzeSensorDataInputSchema,
    outputSchema: AnalyzeSensorDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
