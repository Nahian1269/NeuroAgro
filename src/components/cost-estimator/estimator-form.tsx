"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  estimateVerticalFarmingCosts,
  EstimateVerticalFarmingCostsOutput,
} from "@/ai/flows/estimate-vertical-farming-costs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, DollarSign, TrendingUp, Wrench, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const formSchema = z.object({
  fieldSize: z.coerce.number().min(0.01, "Field size must be at least 0.01 acres."),
  fieldWidth: z.coerce.number().min(1, "Field width must be at least 1 foot."),
  geolocation: z.string().min(3, "Please enter a valid location."),
  sunlightAvailability: z.enum(["high", "medium", "low"]),
});

type FormData = z.infer<typeof formSchema>;

export function EstimatorForm() {
  const [estimation, setEstimation] = useState<EstimateVerticalFarmingCostsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geolocation: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError(null);
    setEstimation(null);

    try {
      const result = await estimateVerticalFarmingCosts(values);
      setEstimation(result);
    } catch (e) {
      setError("Failed to estimate costs. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vertical Farm Parameters</CardTitle>
          <CardDescription>
            Provide details to generate a cost estimation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="fieldSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed Farm Size (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fieldWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building Width (feet)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="geolocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geolocation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Chicago, IL'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sunlightAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natural Sunlight Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sunlight availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Estimating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Estimate Costs
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Estimation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {estimation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cost Estimation Details</CardTitle>
            <CardDescription>
              Total Initial Investment:
              <span className="text-primary font-bold text-lg ml-2">
                ${formatNumber(estimation.totalInitialInvestment)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${formatNumber(estimation.infrastructureCosts)}</div>
                        <p className="text-xs text-muted-foreground">Building & systems</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Annual Energy</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${formatNumber(estimation.energyCosts)}</div>
                        <p className="text-xs text-muted-foreground">Lighting & climate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Annual Maintenance</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${formatNumber(estimation.maintenanceCosts)}</div>
                        <p className="text-xs text-muted-foreground">Labor & repairs</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <TrendingUp className="h-6 w-6 text-muted-foreground"/>
                    <div>
                        <CardTitle>Return on Investment (ROI) Analysis</CardTitle>
                        <CardDescription className="pt-1">{estimation.roiAnalysis}</CardDescription>
                    </div>
                </CardHeader>
             </Card>
          </CardContent>
        </Card>
      )}
    </>
  );
}
