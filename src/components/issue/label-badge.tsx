import { Badge } from "~/components/ui/badge";
import { Label } from "~/data/labels";

interface LabelBadgeProps {
  label: Label[];
}

export function LabelBadge({ label }: LabelBadgeProps) {
  return (
    <>
      {label.map((l) => (
        <Badge
          key={l.id}
          variant="outline"
          className="gap-1.5 rounded-full text-muted-foreground bg-background"
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: l.color }}
            aria-hidden="true"
          />
          {l.name}
        </Badge>
      ))}
    </>
  );
}
