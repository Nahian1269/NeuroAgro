"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { SensorData } from "@/lib/types";
import { SensorGrid } from "@/components/dashboard/sensor-grid";
import { SensorAnalysis } from "@/components/dashboard/sensor-analysis";

const initialSensorData: SensorData = {
  temperature: 25,
  humidity: 60,
  soilMoisture: 55,
  ph: 6.8,
  lightIntensity: 1500,
  co2: 450,
  nh3: 15,
  isRaining: false,
  motionDetected: false,
};

// Helper to generate a random value within a range around a center point
const fluctuate = (value: number, range: number) =>
  value + (Math.random() - 0.5) * range;

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSensorData((prevData) => {
        const newTemp = fluctuate(prevData.temperature, 2);
        const newSoilMoisture = fluctuate(prevData.soilMoisture, 5);

        if (newTemp > 35) {
          toast({
            variant: "destructive",
            title: "High Temperature Alert",
            description: `Temperature has reached ${newTemp.toFixed(1)}°C.`,
          });
        }
        if (newSoilMoisture < 30) {
          toast({
            variant: "destructive",
            title: "Low Soil Moisture Alert",
            description: `Soil moisture is critical: ${newSoilMoisture.toFixed(
              1
            )}%.`,
          });
        }

        return {
          temperature: parseFloat(newTemp.toFixed(1)),
          humidity: parseFloat(fluctuate(prevData.humidity, 5).toFixed(1)),
          soilMoisture: parseFloat(Math.max(0, Math.min(100, newSoilMoisture)).toFixed(1)),
          ph: parseFloat(fluctuate(prevData.ph, 0.2).toFixed(2)),
          lightIntensity: Math.round(fluctuate(prevData.lightIntensity, 200)),
          co2: Math.round(fluctuate(prevData.co2, 50)),
          nh3: Math.round(fluctuate(prevData.nh3, 4)),
          isRaining: Math.random() > 0.95 ? !prevData.isRaining : prevData.isRaining,
          motionDetected: Math.random() > 0.9 ? !prevData.motionDetected : false,
        };
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [toast]);

  return (
    <div className="flex flex-col gap-6">
      <SensorAnalysis sensorData={sensorData} />
      <SensorGrid sensorData={sensorData} />
    </div>
  );
}
