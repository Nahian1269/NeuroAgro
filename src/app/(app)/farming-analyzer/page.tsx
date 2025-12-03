import { AnalyzerForm } from "@/components/farming-analyzer/analyzer-form";

export default function FarmingAnalyzerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Farming Suitability Analyzer</h1>
        <p className="text-muted-foreground">
          Enter your field's details to get an AI-powered recommendation for traditional vs. vertical farming.
        </p>
      </div>
      <AnalyzerForm />
    </div>
  );
}
