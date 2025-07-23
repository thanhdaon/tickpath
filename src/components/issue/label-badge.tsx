import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import { orpc } from "~/orpc/react-query";

interface LabelBadgeProps {
  labels: string[];
}

export function LabelBadge({ labels }: LabelBadgeProps) {
  return (
    <>
      {labels.map((labelId) => (
        <LabelBadgeItem key={labelId} labelId={labelId} />
      ))}
    </>
  );
}

function LabelBadgeItem({ labelId }: { labelId: string }) {
  const options = orpc.labels.getAll.queryOptions({ staleTime: Infinity });
  const result = useSuspenseQuery(options);

  if (result.isLoading) {
    return null;
  }

  if (result.isError) {
    return null;
  }

  const label = result.data.find((l) => l.id === labelId);

  if (label === undefined) {
    return null;
  }

  return (
    <Badge
      key={label.id}
      variant="outline"
      className="gap-1.5 rounded-full text-muted-foreground bg-background"
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: label.color }}
        aria-hidden="true"
      />
      {label.name}
    </Badge>
  );
}
