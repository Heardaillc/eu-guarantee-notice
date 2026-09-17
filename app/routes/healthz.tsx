/**
 * Health check for the host. Returns 200 without touching Shopify or the
 * database, so a cold start is reported healthy as soon as the server is up.
 */
export const loader = () => new Response("ok", { status: 200 });
