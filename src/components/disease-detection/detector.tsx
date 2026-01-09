"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { detectPlantDisease, DetectPlantDiseaseOutput } from "@/ai/flows/detect-plant-diseases";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2, Bot, TreeDeciduous, ShieldCheck, Siren } from "lucide-react";

interface DetectorProps {
  placeholderImage?: ImagePlaceholder;
}

const formSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => {
        // This check is to prevent server-side validation of FileList
        if (typeof window === 'undefined') return true;
        return files instanceof FileList && files.length > 0
      }, "An image is required.")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`),
});

type FormData = z.infer<typeof formSchema>;

export function Detector({ placeholderImage }: DetectorProps) {
  const [analysis, setAnalysis] = useState<DetectPlantDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(placeholderImage?.imageUrl || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUseExample = () => {
    if (placeholderImage) {
        setPreview(placeholderImage.imageUrl);
        // We can't set FileList programmatically, so we'll just show the image
        // and trigger analysis with a placeholder if needed, or ask user to re-upload.
        // For this demo, let's clear the analysis.
        setAnalysis(null);
    }
  };


  async function onSubmit(values: FormData) {
    const file = values.image[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const result = await detectPlantDisease({ photoDataUri: base64data });
        setAnalysis(result);
      } catch (e) {
        setError("Failed to analyze the image. The file may be too large or in an unsupported format. Please try again.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Failed to read the image file. Please try again.");
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Upload</CardTitle>
        <CardDescription>
          Select an image file from your device to start the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleFileChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                    </>
                ) : (
                    <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Detect Disease
                    </>
                )}
                </Button>
                {placeholderImage && (
                    <Button type="button" variant="secondary" onClick={handleUseExample}>
                        Use Example
                    </Button>
                )}
            </div>
          </form>
        </Form>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
                <h3 className="font-semibold mb-2">Image Preview</h3>
                <div className="aspect-video relative rounded-lg border bg-muted overflow-hidden">
                    {preview ? (
                        <Image
                        src={preview}
                        alt="Plant preview"
                        fill
                        className="object-cover"
                        data-ai-hint={placeholderImage?.imageHint}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Upload an image to see a preview
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">AI Analysis</h3>
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-muted-foreground rounded-lg border border-dashed p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <Siren className="h-4 w-4"/>
                        <AlertTitle>Analysis Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {analysis && (
                    <Card className="bg-background/80">
                        <CardContent className="pt-6 space-y-4">
                            {analysis.diseaseDetected ? (
                                <Alert variant="destructive">
                                    <Siren className="h-4 w-4"/>
                                    <AlertTitle>Disease Detected!</AlertTitle>
                                </Alert>
                            ) : (
                                <Alert>
                                    <ShieldCheck className="h-4 w-4"/>
                                    <AlertTitle>Plant Appears Healthy</AlertTitle>
                                </Alert>
                            )}
                            
                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><Bot size={16}/> Diagnosis</h4>
                                <p className="text-sm text-muted-foreground">{analysis.diagnosis}</p>
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><TreeDeciduous size={16}/> Recommendations</h4>
                                <p className="text-sm text-muted-foreground">{analysis.recommendations}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
