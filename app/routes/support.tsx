/**
 * Public support page. Shopify requires a support contact and a help URL for
 * the listing, and fast support is the main way a small app earns reviews.
 */

const CONTACT = "noah@heardai.us";

export const meta = () => [
  { title: "Support — EU Guarantee Notice" },
  { name: "robots", content: "index" },
];

export default function Support() {
  return (
    <main style={styles.page}>
      <article style={styles.sheet}>
        <h1 style={styles.h1}>Support</h1>
        <p style={styles.p}>
          Schreiben Sie an <a href={`mailto:${CONTACT}`} style={styles.link}>{CONTACT}</a>.
          Antwort in der Regel innerhalb eines Werktages. Fragen auf Deutsch und
          Englisch sind willkommen.
        </p>
        <p style={styles.p}>
          Email <a href={`mailto:${CONTACT}`} style={styles.link}>{CONTACT}</a> —
          usually answered within one business day, in German or English.
        </p>

        <h2 style={styles.h2}>Einrichtung / Setup</h2>
        <ol style={styles.list}>
          <li>App installieren.</li>
          <li>
            Im Theme-Editor: Produktvorlage öffnen → <em>Block hinzufügen</em> →{" "}
            <em>Apps</em> → <em>EU guarantee notice</em>.
          </li>
          <li>Block unter dem Preis platzieren und speichern.</li>
        </ol>

        <h2 style={styles.h2}>Häufige Fragen</h2>

        <h3 style={styles.h3}>In welcher Sprache erscheint der Hinweis?</h3>
        <p style={styles.p}>
          In der Sprache, in der die Kundin oder der Kunde den Shop gerade
          ansieht. Alle 24 EU-Amtssprachen sind enthalten; außerhalb davon wird
          die englische Fassung gezeigt.
        </p>

        <h3 style={styles.h3}>Kann ich Text oder Farben ändern?</h3>
        <p style={styles.p}>
          Nein — und das ist Absicht. Die Verordnung (EU) 2025/1960 verbietet
          Änderungen an Wortlaut, Farben, Layout und QR-Code. Die App liefert die
          amtliche Datei der Kommission unverändert aus. Anpassbar sind nur
          Platzierung, Auslösetext und Rahmen.
        </p>

        <h3 style={styles.h3}>Für welche Produkte gilt der Hinweis nicht?</h3>
        <p style={styles.p}>
          Geschenkkarten werden automatisch ausgenommen. Weitere Produkttypen und
          Tags lassen sich in den Einstellungen ausschließen, etwa Dienstleistungen
          oder digitale Produkte.
        </p>

        <h3 style={styles.h3}>Muss der Hinweis sofort sichtbar sein?</h3>
        <p style={styles.p}>
          Nein. Eine verschachtelte Darstellung ist zulässig, solange der
          vollständige Hinweis beim ersten Klick, Mouse-over oder Aufklappen
          erscheint. Genau so arbeitet die Standardeinstellung.
        </p>

        <h3 style={styles.h3}>Ab wann gilt die Pflicht?</h3>
        <p style={styles.p}>
          Ab dem 27. September 2026 für Verkäufe an Verbraucherinnen und
          Verbraucher in der EU.
        </p>

        <p style={styles.note}>
          Diese App unterstützt bei der Anzeige eines gesetzlich vorgeschriebenen
          Hinweises. Sie ersetzt keine Rechtsberatung; für die Einhaltung bleiben
          Händlerinnen und Händler selbst verantwortlich.
        </p>

        <p style={styles.footer}>
          <a href="/privacy" style={styles.link}>
            Datenschutz / Privacy
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
  h1: { fontSize: "1.6rem", margin: "0 0 12px" },
  h2: { fontSize: "1.05rem", margin: "28px 0 6px" },
  h3: { fontSize: "0.98rem", margin: "18px 0 4px" },
  p: { margin: "0 0 12px" },
  list: { margin: "0 0 12px", paddingLeft: 20 },
  note: {
    marginTop: 28,
    paddingTop: 16,
    borderTop: "1px solid #e8dfd2",
    color: "#7a6a55",
    fontSize: "0.9rem",
  },
  footer: { marginTop: 24, fontSize: "0.9rem" },
  link: { color: "#1f1b16" },
};
