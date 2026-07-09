import { createMiddleware } from "hono/factory";
import { Bindings } from "hono/types";

export const rateLimiter = createMiddleware<{Bindings: CloudflareBindings}>