import { EstimatorForm } from "@/components/cost-estimator/estimator-form";

export default function CostEstimatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vertical Farming Cost Estimator</h1>
        <p className="text-muted-foreground">
          Fill out the details to receive an AI-generated cost estimate and ROI analysis for a vertical farm.
        </p>
      </div>
      <EstimatorForm />
    </div>
  );
}
