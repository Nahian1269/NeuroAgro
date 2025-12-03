import Link from "next/link";
import {
  Bot,
} from "lucide-react";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";

export function AppSidebar() {
  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <MainNav />
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot size={16} />
            <span>AI features powered by Google</span>
        </div>
      </div>
    </>
  );
}
