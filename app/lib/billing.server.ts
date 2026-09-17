/**
 * Plan gating.
 *
 * Plans themselves are configured in Shopify's dashboard (managed pricing), so
 * the app never handles money: Shopify bills the merchant and pays out. Here we
 * only ask which plan a shop is on, to decide whether paid features are shown.
 */

export const PRO_PLAN = "Pro";

type BillingApi = {
  check: (options: { plans: string[]; isTest: boolean }) => Promise<{
    hasActivePayment: boolean;
  }>;
};

/**
 * True when the shop is on a paid plan.
 *
 * Failures resolve to false rather than throwing: a billing hiccup should hide
 * a paid feature, never break the settings screen or the storefront notice —
 * which is the part merchants are relying on for compliance.
 */
export async function hasProPlan(
  billing: BillingApi,
  { isTest = true }: { isTest?: boolean } = {},
): Promise<boolean> {
  try {
    const { hasActivePayment } = await billing.check({
      plans: [PRO_PLAN],
      isTest,
    });
    return hasActivePayment;
  } catch {
    return false;
  }
}
