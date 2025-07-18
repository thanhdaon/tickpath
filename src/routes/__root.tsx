import appCss from "~/styles/app.css?url";

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { NotFound } from "~/components/not-found";
import { getThemeServerFn } from "~/lib/theme";
import { ThemeProvider, useTheme } from "~/components/theme-provider";

export const Route = createRootRoute({
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
        <Scripts />
      </body>
    </html>
  );
}
