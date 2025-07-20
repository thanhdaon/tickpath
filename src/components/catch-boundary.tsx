import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export function CatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  function tryAgain() {
    router.invalidate();
  }

  function goBack() {
    router.history.back();
  }

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <Button onClick={tryAgain}>Try Again</Button>
        {isRoot ? (
          <Link to="/">Home</Link>
        ) : (
          <Link to="/" onClick={goBack}>
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
