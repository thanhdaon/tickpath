import { format } from "date-fns";
import { motion } from "motion/react";
import { AssigneeUser } from "~/components/issue/assignee-user";
import { LabelBadge } from "~/components/issue/label-badge";
import { PrioritySelector } from "~/components/issue/priority-selector";
import { StatusSelector } from "~/components/issue/status-selector";

interface IssueLineProps {
  issue: {
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
}

export function IssueLine({ issue }: IssueLineProps) {
  return (
    <motion.div className="w-full flex items-center justify-start h-11 px-6 hover:bg-sidebar/50">
      <div className="flex items-center gap-0.5">
        <PrioritySelector priorityId={issue.priorityId} />
        <span className="text-sm hidden sm:inline-block text-muted-foreground font-medium w-[80px] truncate shrink-0 mr-0.5">
          {issue.identifier}
        </span>
        <StatusSelector statusId={issue.statusId} />
      </div>
      <span className="min-w-0 flex items-center justify-start mr-1 ml-0.5">
        <span className="text-xs sm:text-sm font-medium sm:font-semibold truncate">
          {issue.title}
        </span>
      </span>
      <div className="flex items-center justify-end gap-2 ml-auto sm:w-fit">
        <div className="w-3 shrink-0"></div>
        <div className="-space-x-5 hover:space-x-1 lg:space-x-1 items-center justify-end hidden sm:flex duration-200 transition-all">
          <LabelBadge labels={issue.labels} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline-block">
          {format(new Date(issue.createdAt), "MMM dd")}
        </span>
        {/* <AssigneeUser userId={issue.assigneeId} /> */}
      </div>
    </motion.div>
  );
}
