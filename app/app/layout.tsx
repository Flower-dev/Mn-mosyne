import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Newspaper,
  Rss,
  Bookmark,
  BarChart2,
  Bell,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/app", label: "Feed", icon: Newspaper },
  { href: "/app/feeds", label: "My Feeds", icon: Rss },
  { href: "/app/favorites", label: "Favorites", icon: Bookmark },
  { href: "/app/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/app/alerts", label: "Alerts", icon: Bell },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background md:flex-row">
      {/* Ambient background — same layer as homepage */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-amber-600/[.06] via-background to-purple-900/[.07]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="animate-float absolute left-[8%] top-24 h-72 w-72 rounded-full bg-chart-3/15 blur-[100px]" />
        <div className="animate-float-delayed absolute right-[10%] top-[40%] h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="animate-float-slow absolute bottom-16 left-[40%] h-64 w-64 rounded-full bg-chart-5/10 blur-[100px]" />
      </div> */}

      {/* Sidebar — desktop only */}
      <aside className="relative hidden md:flex flex-col w-60 shrink-0 border-r border-border/60  px-3 py-6">
        {/* Logo */}
        <Link href="/app" className="flex items-center gap-2 px-3 mb-8">
          <span className="text-xl font-extrabold tracking-tight bg-linear-to-br from-amber-600 to-purple-900 bg-clip-text text-transparent">
            Mnemosyne
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-border/60 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="size-8 rounded-full bg-linear-to-br from-amber-600/30 to-purple-900/30 border border-border/60 flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </div>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile header — mobile only */}
      <header className="flex md:hidden items-center justify-between border-b border-border/60 bg-background/60 backdrop-blur-sm px-4 py-3">
        {/* Logo */}
        <Link href="/app">
          <span className="text-lg font-extrabold tracking-tight bg-linear-to-br from-amber-600 to-purple-900 bg-clip-text text-transparent">
            Mnemosyne
          </span>
        </Link>

        {/* User + sign-out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-linear-to-br from-amber-600/30 to-purple-900/30 border border-border/60 flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {session.user.name}
            </span>
          </div>
          <ThemeToggle iconOnly />
          <SignOutButton iconOnly />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-8">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border/60 bg-background/80 backdrop-blur-sm">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-5 shrink-0" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
