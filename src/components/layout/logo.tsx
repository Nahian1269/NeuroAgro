import { Sprout } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <Sprout className="h-6 w-6 text-primary" />
      <span>NeuroAgro</span>
    </div>
  );
}
