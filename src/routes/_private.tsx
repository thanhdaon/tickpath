import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { FullscreenLoading } from "~/components/fullscreen-loading";
import { MainLayout } from "~/components/layout/main-layout";
import { useSession } from "~/lib/auth-client";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useSession();

  if (session.isPending) {
    return <FullscreenLoading />;
  }

  if (session.error) {
    return (
      <div>
        {session.error.name} - {session.error.message}
      </div>
    );
  }

  if (session.data) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }

  return <Navigate to="/signin" />;
}
