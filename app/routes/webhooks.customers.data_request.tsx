import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR topic: a shopper asked the merchant for their data.
 *
 * This app stores no customer data. It keeps shop-level display settings and
 * the session record Shopify itself requires, so there is nothing to return.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} for ${shop} — no customer data is stored by this app`);

  return new Response();
};
