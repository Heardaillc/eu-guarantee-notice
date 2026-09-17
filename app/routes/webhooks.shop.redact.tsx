import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Mandatory GDPR topic: 48 hours after a shop uninstalls, delete its data.
 *
 * Sessions are normally removed on app/uninstalled; this is the backstop.
 * Display settings live in the shop's own metafield and are removed with the
 * app, so nothing else is held here.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} for ${shop} — clearing any remaining sessions`);

  await db.session.deleteMany({ where: { shop } });

  return new Response();
};
