import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "~/components/layout/main-layout";
import { GroupIssues } from "~/components/issue/group-issues";
import { status } from "~/data/status";
import { issuesByStatus } from "~/data/issues";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <MainLayout>
      <div className="w-full h-full">
        {status.map((statusItem) => (
          <GroupIssues
            key={statusItem.id}
            status={statusItem}
            issues={issuesByStatus[statusItem.id] || []}
            count={issuesByStatus[statusItem.id]?.length || 0}
          />
        ))}
      </div>
    </MainLayout>
  );
}
