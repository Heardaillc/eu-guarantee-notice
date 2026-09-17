/**
 * Public privacy policy. Shopify requires a reachable privacy policy URL before
 * an app can be listed, and merchants link to it from the listing.
 *
 * German first, English below — most merchants affected by the notice
 * obligation sell in German-speaking markets.
 */

const UPDATED = "17. September 2026";
const CONTACT = "noah@heardai.us";

export const meta = () => [
  { title: "Datenschutzerklärung — EU Guarantee Notice" },
  { name: "robots", content: "index" },
];

export default function Privacy() {
  return (
    <main style={styles.page}>
      <article style={styles.sheet}>
        <h1 style={styles.h1}>Datenschutzerklärung</h1>
        <p style={styles.meta}>Stand: {UPDATED}</p>

        <h2 style={styles.h2}>Kurzfassung</h2>
        <p style={styles.p}>
          Die App zeigt den amtlichen EU-Hinweis zur gesetzlichen Gewährleistung
          in Ihrem Shop an. Sie verarbeitet <strong>keine personenbezogenen
          Daten von Kundinnen und Kunden</strong> und speichert keine
          Bestelldaten.
        </p>

        <h2 style={styles.h2}>Welche Daten verarbeitet werden</h2>
        <ul style={styles.list}>
          <li>
            <strong>Shop-Kennung und Zugriffstoken:</strong> notwendig, damit die
            App mit Ihrem Shop verbunden bleibt. Wird bei der Deinstallation
            gelöscht.
          </li>
          <li>
            <strong>Produkttyp und Tags:</strong> werden gelesen, um den Hinweis
            für ausgenommene Produkte auszublenden. Sie werden nicht gespeichert.
          </li>
          <li>
            <strong>Ihre Einstellungen:</strong> werden als Metafeld in Ihrem
            eigenen Shopify-Shop abgelegt, nicht auf unseren Servern.
          </li>
        </ul>

        <h2 style={styles.h2}>Was nicht verarbeitet wird</h2>
        <p style={styles.p}>
          Keine Namen, Adressen, E-Mail-Adressen, Zahlungsdaten oder
          Bestellinhalte. Der Hinweis wird als statische Grafik ausgeliefert und
          verfolgt das Verhalten der Besucher nicht: keine Cookies, kein
          Tracking, keine Analyse.
        </p>

        <h2 style={styles.h2}>Weitergabe an Dritte</h2>
        <p style={styles.p}>
          Es werden keine Daten verkauft oder zu Werbezwecken weitergegeben. Zum
          Betrieb der App werden Hosting- und Datenbankdienstleister eingesetzt,
          die ausschließlich die oben genannten technischen Daten verarbeiten.
        </p>

        <h2 style={styles.h2}>Aufbewahrung und Löschung</h2>
        <p style={styles.p}>
          Bei der Deinstallation werden die Sitzungsdaten Ihres Shops gelöscht.
          Anfragen nach Art. 15–17 DSGVO beantworten wir über die
          Shopify-Standardverfahren sowie unter {CONTACT}.
        </p>

        <h2 style={styles.h2}>Verantwortlich</h2>
        <p style={styles.p}>
          HeardAI LLC · {CONTACT}
        </p>

        <hr style={styles.rule} />

        <h1 style={styles.h1}>Privacy policy</h1>
        <p style={styles.meta}>Last updated: 17 September 2026</p>

        <h2 style={styles.h2}>In short</h2>
        <p style={styles.p}>
          This app displays the official EU legal guarantee notice in your store.
          It processes <strong>no personal data about your customers</strong> and
          stores no order data.
        </p>

        <h2 style={styles.h2}>What is processed</h2>
        <ul style={styles.list}>
          <li>
            <strong>Shop domain and access token:</strong> required to stay
            connected to your store. Deleted when the app is uninstalled.
          </li>
          <li>
            <strong>Product type and tags:</strong> read so the notice can be
            hidden on excluded products. They are not stored.
          </li>
          <li>
            <strong>Your settings:</strong> saved as a metafield inside your own
            Shopify store, not on our servers.
          </li>
        </ul>

        <h2 style={styles.h2}>What is not processed</h2>
        <p style={styles.p}>
          No names, addresses, email addresses, payment details or order
          contents. The notice is served as a static image and does not track
          visitors: no cookies, no tracking, no analytics.
        </p>

        <h2 style={styles.h2}>Sharing</h2>
        <p style={styles.p}>
          Nothing is sold or shared for advertising. Hosting and database
          providers process only the technical data listed above so the app can
          run.
        </p>

        <h2 style={styles.h2}>Retention and deletion</h2>
        <p style={styles.p}>
          Session data is deleted on uninstall. Data requests are handled through
          Shopify's standard channels and at {CONTACT}.
        </p>

        <h2 style={styles.h2}>Controller</h2>
        <p style={styles.p}>HeardAI LLC · {CONTACT}</p>

        <p style={styles.footer}>
          <a href="/support" style={styles.link}>
            Support
          </a>
        </p>
      </article>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#FFFBF5",
    color: "#1f1b16",
    minHeight: "100vh",
    padding: "48px 16px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
    lineHeight: 1.6,
  },
  sheet: {
    maxWidth: 680,
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #e8dfd2",
    borderRadius: 12,
    padding: "40px 36px",
  },
  h1: { fontSize: "1.6rem", margin: "0 0 4px" },
  h2: { fontSize: "1.05rem", margin: "28px 0 6px" },
  p: { margin: "0 0 12px" },
  list: { margin: "0 0 12px", paddingLeft: 20 },
  meta: { margin: "0 0 20px", color: "#7a6a55", fontSize: "0.9rem" },
  rule: { margin: "40px 0", border: 0, borderTop: "1px solid #e8dfd2" },
  footer: { marginTop: 32, fontSize: "0.9rem" },
  link: { color: "#1f1b16" },
};
