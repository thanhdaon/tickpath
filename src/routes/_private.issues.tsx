import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { GroupIssues } from "~/components/issue/group-issues";
import { ScrollArea } from "~/components/ui/scroll-area";
import { orpc } from "~/orpc/client";

export const Route = createFileRoute("/_private/issues")({
  component: IssuePage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(orpc.issues.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.statuses.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.priorities.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.labels.getAll.queryOptions());
  },
});

function IssuePage() {
  const results = useSuspenseQueries({
    queries: [
      orpc.issues.getAll.queryOptions(),
      orpc.statuses.getAll.queryOptions({ staleTime: Infinity }),
    ],
  });
  const [issues, statuses] = results;

  if (results.some((r) => r.isLoading)) {
    return <div>Loading...</div>;
  }

  if (results.some((r) => r.isError)) {
    return <div>Error</div>;
  }

  return (
    <ScrollArea className="w-full h-[calc(100svh-60px)]">
      {statuses.data.map((s) => {
        const targetIssues = issues.data.filter((i) => i.statusId === s.id);

        return (
          <GroupIssues
            key={s.id}
            status={s}
            issues={targetIssues}
            count={targetIssues.length}
          />
        );
      })}
    </ScrollArea>
  );
}
