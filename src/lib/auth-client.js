import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getAuthBaseUrl = () =>
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [
    jwtClient()
  ]
});
