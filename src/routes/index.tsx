import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { GroupIssues } from "~/components/issue/group-issues";
import { MainLayout } from "~/components/layout/main-layout";
import { orpc } from "~/orpc/react-query";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(orpc.statuses.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.issues.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.priorities.getAll.queryOptions());
    await queryClient.ensureQueryData(orpc.labels.getAll.queryOptions());
  },
});

function Home() {
  const results = useSuspenseQueries({
    queries: [
      orpc.statuses.getAll.queryOptions(),
      orpc.issues.getAll.queryOptions(),
      orpc.priorities.getAll.queryOptions(),
      orpc.labels.getAll.queryOptions(),
    ],
  });
  const [statuses, issues] = results;

  if (results.some((r) => r.isLoading)) {
    return <div>Loading...</div>;
  }

  if (results.some((r) => r.isError)) {
    return <div>Error</div>;
  }

  return (
    <MainLayout>
      <div className="w-full h-full">
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
      </div>
    </MainLayout>
  );
}
