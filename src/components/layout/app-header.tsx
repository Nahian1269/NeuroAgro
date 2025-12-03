"use client";

import Link from "next/link";
import { PanelLeft, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "./app-sidebar";

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/farming-analyzer": "Farming Analyzer",
  "/cost-estimator": "Cost Estimator",
  "/disease-detection": "Disease Detection",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "NeuroAgro Insights";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
    </header>
  );
}
