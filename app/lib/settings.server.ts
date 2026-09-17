/**
 * Storefront settings for the EU guarantee notice.
 *
 * Settings live in an app-owned metafield ($app:eu_guarantee / settings) on the
 * shop, so the theme app extension can read them in Liquid without a network
 * call on every product page view.
 */

export type NoticeSettings = {
  /** Master switch. When false the block renders nothing. */
  enabled: boolean;
  /** Comma-separated product types the notice should be hidden for. */
  excludedTypes: string;
  /** Comma-separated product tags the notice should be hidden for. */
  excludedTags: string;
  /** Recorded for support; the storefront always follows the shopper's language. */
  defaultLanguage: string;
};

export const DEFAULT_SETTINGS: NoticeSettings = {
  enabled: true,
  excludedTypes: "",
  excludedTags: "",
  defaultLanguage: "en",
};

const NAMESPACE = "$app:eu_guarantee";
const KEY = "settings";

type GraphqlClient = {
  (query: string, options?: { variables?: Record<string, unknown> }): Promise<Response>;
};

const SHOP_ID_QUERY = `#graphql
  query ShopId {
    shop {
      id
    }
  }
`;

const READ_QUERY = `#graphql
  query NoticeSettings($namespace: String!, $key: String!) {
    shop {
      id
      metafield(namespace: $namespace, key: $key) {
        value
      }
    }
  }
`;

const WRITE_MUTATION = `#graphql
  mutation SaveNoticeSettings($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DEFINITION_MUTATION = `#graphql
  mutation CreateNoticeSettingsDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

function coerce(raw: unknown): NoticeSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_SETTINGS };
  const value = raw as Record<string, unknown>;

  return {
    enabled: value.enabled !== false,
    excludedTypes: typeof value.excluded_types === "string" ? value.excluded_types : "",
    excludedTags: typeof value.excluded_tags === "string" ? value.excluded_tags : "",
    defaultLanguage:
      typeof value.default_language === "string" && value.default_language
        ? value.default_language
        : "en",
  };
}

/** Shape written to the metafield. Snake_case because Liquid reads these keys. */
function serialize(settings: NoticeSettings) {
  return JSON.stringify({
    enabled: settings.enabled,
    excluded_types: settings.excludedTypes.trim(),
    excluded_tags: settings.excludedTags.trim(),
    default_language: settings.defaultLanguage,
    // Bumped when the stored shape changes, so old values can be migrated.
    schema_version: 1,
  });
}

export async function readSettings(graphql: GraphqlClient): Promise<NoticeSettings> {
  const response = await graphql(READ_QUERY, {
    variables: { namespace: NAMESPACE, key: KEY },
  });
  const body = await response.json();
  const raw = body?.data?.shop?.metafield?.value;

  if (!raw) return { ...DEFAULT_SETTINGS };

  try {
    return coerce(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function writeSettings(
  graphql: GraphqlClient,
  settings: NoticeSettings,
): Promise<{ ok: boolean; errors: string[] }> {
  const shopResponse = await graphql(SHOP_ID_QUERY);
  const shopBody = await shopResponse.json();
  const ownerId = shopBody?.data?.shop?.id;

  if (!ownerId) {
    return { ok: false, errors: ["Could not read the shop. Try reloading the app."] };
  }

  const response = await graphql(WRITE_MUTATION, {
    variables: {
      metafields: [
        {
          ownerId,
          namespace: NAMESPACE,
          key: KEY,
          type: "json",
          value: serialize(settings),
        },
      ],
    },
  });

  const body = await response.json();
  const userErrors = body?.data?.metafieldsSet?.userErrors ?? [];

  return {
    ok: userErrors.length === 0,
    errors: userErrors.map((e: { message: string }) => e.message),
  };
}

/**
 * Creates the metafield definition so the value is readable from the
 * storefront. Safe to call repeatedly: an existing definition returns a
 * TAKEN error, which we ignore.
 */
export async function ensureSettingsDefinition(graphql: GraphqlClient): Promise<void> {
  try {
    const response = await graphql(DEFINITION_MUTATION, {
      variables: {
        definition: {
          name: "EU guarantee notice settings",
          namespace: NAMESPACE,
          key: KEY,
          type: "json",
          ownerType: "SHOP",
          access: {
            admin: "MERCHANT_READ",
            storefront: "PUBLIC_READ",
          },
        },
      },
    });
    await response.json();
  } catch {
    // Definitions are a convenience, not a requirement — never block the UI.
  }
}
