import { createAuthClient } from "better-auth/react";

const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
});

export { signIn, signUp, signOut, useSession };
