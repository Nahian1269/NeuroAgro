import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-sensor-data.ts';
import '@/ai/flows/detect-plant-diseases.ts';
import '@/ai/flows/determine-farming-suitability.ts';
import '@/ai/flows/estimate-vertical-farming-costs.ts';
import '@/ai/flows/analyze-sensor-data-and-provide-insights.ts';