import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <section className="flex w-full flex-col">

      {/* Title */}
      <h1 className="bg-linear-to-br from-amber-600 to-purple-900 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl lg:text-5xl">
        Your Feed
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
        Your latest articles from all subscribed RSS feeds, in one distraction-free place.
      </p>

      {/* Feature pills */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {["All sources", "Unread", "Today"].map((tag) => (
          <Badge
            key={tag}
            className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </section>
  );
}
