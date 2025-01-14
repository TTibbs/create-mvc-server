import { serve } from "@hono/node-server";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

// Start the server
serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server is running on http://localhost:${PORT}`);
