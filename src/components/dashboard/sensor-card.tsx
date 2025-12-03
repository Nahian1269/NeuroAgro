import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "destructive";
  description: string;
}

const statusClasses = {
  normal: "text-primary",
  warning: "text-yellow-500",
  destructive: "text-destructive",
};

export function SensorCard({
  icon: Icon,
  title,
  value,
  unit,
  status,
  description,
}: SensorCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={cn("h-5 w-5 text-muted-foreground", statusClasses[status])}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
