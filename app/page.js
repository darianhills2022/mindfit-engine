import "./globals.css";

export default function Home() {
  return (
    <main className="notfound">
      <h1>MindFit Academy</h1>
      <p style={{ color: "#525a66", maxWidth: 460 }}>
        This is the white-label engine. Each partner therapist has their own
        branded page at <code>/their-slug</code>.
      </p>
      <a className="cta" href="/apply" style={{ marginTop: 18 }}>Become a partner</a>
    </main>
  );
}
