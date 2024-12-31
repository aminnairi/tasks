import { createClient } from "@todo/core"
import { createFetchAdapter } from "@renkei/fetch";

export const client = createClient({
  adapter: createFetchAdapter(),
  server: "http://localhost:8000"
});