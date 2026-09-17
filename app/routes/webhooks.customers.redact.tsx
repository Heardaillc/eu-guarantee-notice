import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR topic: delete a shopper's data.
 *
 * This app stores no customer data, so there is nothing to delete. The 200
 * response confirms the request was received and handled.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} for ${shop} — no customer data is stored by this app`);

  return new Response();
};
