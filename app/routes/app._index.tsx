import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  DEFAULT_SETTINGS,
  ensureSettingsDefinition,
  readSettings,
  writeSettings,
  type NoticeSettings,
} from "../lib/settings.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  await ensureSettingsDefinition(admin.graphql);
  const settings = await readSettings(admin.graphql);

  return {
    settings,
    shopDomain: session.shop,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const form = await request.formData();

  const settings: NoticeSettings = {
    enabled: form.get("enabled") === "true",
    excludedTypes: String(form.get("excludedTypes") ?? ""),
    excludedTags: String(form.get("excludedTags") ?? ""),
    defaultLanguage: String(form.get("defaultLanguage") ?? DEFAULT_SETTINGS.defaultLanguage),
  };

  const result = await writeSettings(admin.graphql, settings);

  return { saved: result.ok, errors: result.errors, settings };
};

export default function Settings() {
  const { settings: saved, shopDomain } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const [enabled, setEnabled] = useState(saved.enabled);
  const [excludedTypes, setExcludedTypes] = useState(saved.excludedTypes);
  const [excludedTags, setExcludedTags] = useState(saved.excludedTags);

  const isSaving = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (fetcher.data?.saved) {
      shopify.toast.show("Settings saved");
    } else if (fetcher.data?.errors?.length) {
      shopify.toast.show(fetcher.data.errors[0], { isError: true });
    }
  }, [fetcher.data, shopify]);

  const save = () =>
    fetcher.submit(
      {
        enabled: String(enabled),
        excludedTypes,
        excludedTags,
        defaultLanguage: saved.defaultLanguage,
      },
      { method: "POST" },
    );

  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor?template=product`;

  return (
    <s-page heading="EU guarantee notice">
      <s-button slot="primary-action" onClick={save} {...(isSaving ? { loading: true } : {})}>
        Save
      </s-button>

      <s-section heading="Step 1 — add the notice to your product page">
        <s-paragraph>
          Open the theme editor, choose a product template, then{" "}
          <s-text>Add block → Apps → EU guarantee notice</s-text>. Put it near the
          price or the add-to-cart button, where shoppers will see it before they buy.
        </s-paragraph>
        <s-stack direction="inline" gap="base">
          <s-button href={themeEditorUrl} target="_blank">
            Open theme editor
          </s-button>
        </s-stack>
      </s-section>

      <s-section heading="Step 2 — settings">
        <s-stack direction="block" gap="base">
          <s-checkbox
            label="Show the notice on my storefront"
            details="Turn this off to hide the notice everywhere without removing the block."
            checked={enabled}
            onChange={(event: { currentTarget: { checked: boolean } }) =>
              setEnabled(event.currentTarget.checked)
            }
          />

          <s-text-field
            label="Hide for these product types"
            details="Comma separated. Use for anything the legal guarantee doesn't cover, such as services or digital downloads."
            placeholder="Digital download, Service"
            value={excludedTypes}
            onChange={(event: { currentTarget: { value: string } }) =>
              setExcludedTypes(event.currentTarget.value)
            }
          />

          <s-text-field
            label="Hide for these product tags"
            details="Comma separated."
            placeholder="b2b-only, sample"
            value={excludedTags}
            onChange={(event: { currentTarget: { value: string } }) =>
              setExcludedTags(event.currentTarget.value)
            }
          />
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="What this does">
        <s-paragraph>
          From 27 September 2026, shops selling to consumers in the EU must show the
          Commission's harmonised notice about the two-year legal guarantee.
        </s-paragraph>
        <s-paragraph>
          The notice is shown in the language the shopper is browsing in, using the
          Commission's own artwork. The law does not allow the wording, colours or
          layout to be changed, so only placement and the trigger text are adjustable.
        </s-paragraph>
      </s-section>

      <s-section slot="aside" heading="Gift cards">
        <s-paragraph>
          Gift cards are excluded automatically. You don't need to add them above.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
