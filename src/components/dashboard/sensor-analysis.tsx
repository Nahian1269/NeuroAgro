"use client";

import { useState } from "react";
import {
  analyzeSensorDataAndProvideInsights,
  AnalyzeSensorDataAndProvideInsightsOutput,
} from "@/ai/flows/analyze-sensor-data-and-provide-insights";
import type { SensorData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bot, Loader2, Wand2 } from "lucide-react";

interface SensorAnalysisProps {
  sensorData: SensorData;
}

export function SensorAnalysis({ sensorData }: SensorAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSensorDataAndProvideInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const input = {
      soilMoisture: sensorData.soilMoisture,
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      pH: sensorData.ph,
      lightIntensity: sensorData.lightIntensity,
      motionDetected: sensorData.motionDetected,
      raindropDetected: sensorData.isRaining,
      gasLevels: {
        CO2: sensorData.co2,
        NH3: sensorData.nh3,
      },
    };

    try {
      const result = await analyzeSensorDataAndProvideInsights(input);
      setAnalysisResult(result);
    } catch (e) {
      setError("Failed to analyze sensor data. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          AI-Powered Analysis
        </CardTitle>
        <CardDescription>
          Get actionable insights and recommendations based on the current sensor readings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Analyze Sensor Data
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <Alert className="mt-4">
            <AlertTitle className="flex items-center gap-2">
                <Bot/>
                Analysis Complete
            </AlertTitle>
            <AlertDescription className="whitespace-pre-wrap pt-2">
                {analysisResult.insights}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
