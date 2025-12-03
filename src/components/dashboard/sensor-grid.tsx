import {
  Thermometer,
  Droplets,
  Leaf,
  FlaskConical,
  Sun,
  Wind,
  CloudDrizzle,
  Move,
} from "lucide-react";

import { SensorCard } from "./sensor-card";
import type { SensorData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface SensorGridProps {
  sensorData: SensorData;
}

export function SensorGrid({ sensorData }: SensorGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <SensorCard
        icon={Thermometer}
        title="Temperature"
        value={formatNumber(sensorData.temperature, { maximumFractionDigits: 1 })}
        unit="°C"
        status={
          sensorData.temperature > 35
            ? "destructive"
            : sensorData.temperature < 10
            ? "warning"
            : "normal"
        }
        description="Optimal range: 18-28°C"
      />
      <SensorCard
        icon={Droplets}
        title="Humidity"
        value={formatNumber(sensorData.humidity, { maximumFractionDigits: 1 })}
        unit="%"
        status={
          sensorData.humidity > 85
            ? "warning"
            : sensorData.humidity < 40
            ? "warning"
            : "normal"
        }
        description="Optimal range: 50-70%"
      />
      <SensorCard
        icon={Leaf}
        title="Soil Moisture"
        value={formatNumber(sensorData.soilMoisture, {
          maximumFractionDigits: 1,
        })}
        unit="%"
        status={
          sensorData.soilMoisture < 30
            ? "destructive"
            : sensorData.soilMoisture < 40
            ? "warning"
            : "normal"
        }
        description="Optimal range: 45-65%"
      />
      <SensorCard
        icon={FlaskConical}
        title="Soil pH"
        value={formatNumber(sensorData.ph, { maximumFractionDigits: 2 })}
        unit=""
        status={
          sensorData.ph < 5.5 || sensorData.ph > 7.5 ? "warning" : "normal"
        }
        description="Optimal range: 6.0-7.0"
      />
      <SensorCard
        icon={Sun}
        title="Light Intensity"
        value={formatNumber(sensorData.lightIntensity)}
        unit="lux"
        status={sensorData.lightIntensity < 1000 ? "warning" : "normal"}
        description="Varies by plant type"
      />
      <SensorCard
        icon={Wind}
        title="CO₂ Level"
        value={formatNumber(sensorData.co2)}
        unit="ppm"
        status={sensorData.co2 > 1000 ? "warning" : "normal"}
        description="Ambient is ~400 ppm"
      />
        <SensorCard
        icon={Wind}
        title="Ammonia (NH₃)"
        value={formatNumber(sensorData.nh3)}
        unit="ppm"
        status={sensorData.nh3 > 25 ? "destructive" : "normal"}
        description="Should be below 25 ppm"
      />
      <SensorCard
        icon={CloudDrizzle}
        title="Raindrop Sensor"
        value={sensorData.isRaining ? "Raining" : "Clear"}
        unit=""
        status={sensorData.isRaining ? "normal" : "normal"}
        description="Detects precipitation"
      />
      <SensorCard
        icon={Move}
        title="Motion Detection"
        value={sensorData.motionDetected ? "Detected" : "None"}
        unit=""
        status={sensorData.motionDetected ? "warning" : "normal"}
        description="Monitors field activity"
      />
    </div>
  );
}
