'use server';

/**
 * @fileOverview Analyzes real-time sensor data and provides actionable insights for farmers.
 *
 * - analyzeSensorDataAndProvideInsights - A function that takes sensor data as input and returns farming insights.
 * - AnalyzeSensorDataAndProvideInsightsInput - The input type for the analyzeSensorDataAndProvideInsights function.
 * - AnalyzeSensorDataAndProvideInsightsOutput - The return type for the analyzeSensorDataAndProvideInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSensorDataAndProvideInsightsInputSchema = z.object({
  soilMoisture: z.number().describe('Soil moisture level (percentage).'),
  temperature: z.number().describe('Temperature in Celsius.'),
  humidity: z.number().describe('Humidity level (percentage).'),
  pH: z.number().describe('pH level of the soil.'),
  lightIntensity: z.number().describe('Light intensity (lumens).'),
  motionDetected: z.boolean().describe('Whether motion is detected.'),
  raindropDetected: z.boolean().describe('Whether raindrops are detected.'),
  gasLevels: z
    .object({
      CO2: z.number().describe('Carbon Dioxide level (ppm).'),
      NH3: z.number().describe('Ammonia level (ppm).'),
    })
    .describe('Gas levels in the environment.'),
});
export type AnalyzeSensorDataAndProvideInsightsInput = z.infer<typeof AnalyzeSensorDataAndProvideInsightsInputSchema>;

const AnalyzeSensorDataAndProvideInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Actionable insights based on the sensor data, including potential nutrient deficiencies, disease risks, and recommendations.'
    ),
});
export type AnalyzeSensorDataAndProvideInsightsOutput = z.infer<typeof AnalyzeSensorDataAndProvideInsightsOutputSchema>;

export async function analyzeSensorDataAndProvideInsights(input: AnalyzeSensorDataAndProvideInsightsInput): Promise<AnalyzeSensorDataAndProvideInsightsOutput> {
  return analyzeSensorDataAndProvideInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSensorDataAndProvideInsightsPrompt',
  input: {schema: AnalyzeSensorDataAndProvideInsightsInputSchema},
  output: {schema: AnalyzeSensorDataAndProvideInsightsOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following real-time sensor data and provide actionable insights and recommendations to the farmer. Focus on potential nutrient deficiencies, disease risks, and recommendations for optimizing crop management. Consider all available data points to give a holistic analysis.

Sensor Data:
Soil Moisture: {{soilMoisture}}%
Temperature: {{temperature}}°C
Humidity: {{humidity}}%
pH: {{pH}}
Light Intensity: {{lightIntensity}} lumens
Motion Detected: {{motionDetected}}
Raindrop Detected: {{raindropDetected}}
Gas Levels: CO2: {{gasLevels.CO2}} ppm, NH3: {{gasLevels.NH3}} ppm`,
});

const analyzeSensorDataAndProvideInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeSensorDataAndProvideInsightsFlow',
    inputSchema: AnalyzeSensorDataAndProvideInsightsInputSchema,
    outputSchema: AnalyzeSensorDataAndProvideInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
