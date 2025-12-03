'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Combine,
  DollarSign,
  Bug,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export function MainNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/farming-analyzer", label: "Farming Analyzer", icon: Combine },
    { href: "/cost-estimator", label: "Cost Estimator", icon: DollarSign },
    { href: "/disease-detection", label: "Disease Detection", icon: Bug },
  ];

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {item.badge && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </>
  );
}
