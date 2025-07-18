import { Plus } from "lucide-react";
import { IssueLine } from "~/components/issue/issue-line";
import { StatusIcon } from "~/components/issue/status-icon";
import { Button } from "~/components/ui/button";

type Status = {
  id: string;
  name: string;
  color: string;
};

type Issue = {
  title: string;
  statusId: string;
  id: number;
  identifier: string;
  description: string | null;
  createdAt: Date;
  assigneeId: string | null;
  priorityId: string;
  labels: string[];
};

interface GroupIssuesProps {
  status: Status;
  count: number;
  issues: Issue[];
}

export function GroupIssues({ status, count, issues }: GroupIssuesProps) {
  return (
    <div className="bg-conainer">
      <div className="sticky top-0 z-10 bg-container w-full h-10">
        <div className="w-full h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <StatusIcon statusId={status.id} />
            <span className="text-sm font-medium">{status.name}</span>
            <span className="text-sm text-muted-foreground">{count}</span>
          </div>
          <Button className="size-6" size="icon" variant="ghost">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-0">
        {issues.map((issue) => (
          <IssueLine key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
