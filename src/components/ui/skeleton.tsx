import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // shadcn's default 'bg-accent' is intended to be neutral, but our
      // theme uses 'accent' as an attention orange. Use 'bg-muted' (gray)
      // for skeletons so they don't flash orange on cold starts.
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
