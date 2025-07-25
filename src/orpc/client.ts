import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { router } from "~/orpc/router";

type Client = RouterClient<typeof router>;

const getORPCClient = createIsomorphicFn()
  .server(() => {
    return createRouterClient(router, {
      context: async () => ({ headers: getHeaders() }),
    });
  })
  .client((): Client => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });

    return createORPCClient(link);
  });

export const rpc = getORPCClient();
export const orpc = createTanstackQueryUtils(rpc);
