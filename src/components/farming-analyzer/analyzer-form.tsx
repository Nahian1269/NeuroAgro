"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  determineFarmingSuitability,
  FarmingSuitabilityOutput,
} from "@/ai/flows/determine-farming-suitability";
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
  FormDescription,
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
import { Loader2, Wand2, Tractor, Building } from "lucide-react";

const formSchema = z.object({
  fieldSize: z.coerce.number().min(0.1, "Field size must be at least 0.1 acres."),
  fieldWidth: z.coerce.number().min(1, "Field width must be at least 1 foot."),
  geolocation: z.string().min(3, "Please enter a valid location (e.g., city, coordinates)."),
  sunlightExposure: z.enum(["full-sun", "partial-shade", "full-shade"]),
});

type FormData = z.infer<typeof formSchema>;

export function AnalyzerForm() {
  const [analysisResult, setResult] = useState<FarmingSuitabilityOutput | null>(null);
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
    setResult(null);

    const input = {
      ...values,
      sunlightExposure: values.sunlightExposure.replace("-", " "),
    };

    try {
      const result = await determineFarmingSuitability(input);
      setResult(result);
    } catch (e) {
      setError("Failed to analyze data. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Field Details</CardTitle>
          <CardDescription>
            Provide the information below to receive your analysis.
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
                      <FormLabel>Field Size (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 5.5" {...field} />
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
                      <FormLabel>Field Width (feet)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 300" {...field} />
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
                        <Input placeholder="e.g., 'Austin, TX' or '40.7128, -74.0060'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sunlightExposure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sunlight Exposure</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sunlight level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-sun">Full Sun</SelectItem>
                          <SelectItem value="partial-shade">Partial Shade</SelectItem>
                          <SelectItem value="full-shade">Full Shade</SelectItem>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Suitability
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-lg bg-muted">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                {analysisResult.farmingType === 'traditional' ? <Tractor/> : <Building/>}
                Recommendation: <span className="capitalize text-primary">{analysisResult.farmingType} Farming</span>
              </h3>
              <p className="text-muted-foreground">{analysisResult.analysis}</p>
            </div>
            
            {analysisResult.verticalFarmingCostAnalysis && (
              <div className="p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Vertical Farming Cost Outlook</h3>
                <p className="text-muted-foreground">{analysisResult.verticalFarmingCostAnalysis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
