import { Detector } from "@/components/disease-detection/detector";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function DiseaseDetectionPage() {
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'diseased-leaf');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plant Disease Detection</h1>
        <p className="text-muted-foreground">
          Upload an image of a plant leaf to detect potential diseases using our AI model.
        </p>
      </div>
      <Detector placeholderImage={placeholderImage} />
    </div>
  );
}
