import appCss from "~/styles/app.css?url";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { ThemeProvider, useTheme } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { getThemeServerFn } from "~/lib/theme";
import { Session, User } from "~/lib/auth";

type Context = {
  queryClient: QueryClient;
  session?: Session;
  user?: User;
};

export const Route = createRootRouteWithContext<Context>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TickPath - Ticketing System" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  loader: async () => {
    return {
      theme: await getThemeServerFn(),
    };
  },
});

function RootComponent() {
  const { theme } = Route.useLoaderData();

  return (
    <ThemeProvider theme={theme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <html className={theme}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
