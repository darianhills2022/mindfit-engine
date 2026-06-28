import "../globals.css";
import { getPartnerBySlug } from "../../lib/supabase";

export const revalidate = 300; // refresh partner data every 5 min

function normHex(hex) {
  let h = (hex || "#7CC00B").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return { r, g, b };
}
function lum({ r, g, b }) { return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
function onBrand(hex) { return lum(normHex(hex)) > 0.62 ? "#10141a" : "#ffffff"; }
function darken(hex, f) {
  const { r, g, b } = normHex(hex);
  const d = (v) => Math.round(v * (1 - f));
  return `#${[d(r), d(g), d(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
// A reliably-readable ink version of the brand for text on white.
function brandInk(hex) {
  let f = 0.25;
  while (lum(normHex(darken(hex, f))) > 0.42 && f < 0.85) f += 0.05;
  return darken(hex, f);
}

export async function generateMetadata({ params }) {
  const p = await getPartnerBySlug(params.slug);
  if (!p) return { title: "MindFit Academy" };
  return {
    title: `${p.display_name} · MindFit Academy`,
    description: p.short_bio?.slice(0, 150),
  };
}

const Check = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.25-8.25 1.4 1.4z" />
  </svg>
);

export default async function PartnerPage({ params }) {
  const p = await getPartnerBySlug(params.slug);

  if (!p) {
    return (
      <main className="notfound">
        <h1>Page not found</h1>
        <p style={{ color: "#525a66" }}>This MindFit partner page isn’t live yet.</p>
      </main>
    );
  }

  const brand = p.brand_color || "#7CC00B";
  const styleVars = {
    "--brand": brand,
    "--ink": brandInk(brand),
    "--on": onBrand(brand),
  };
  const showAnnual = p.offer_tier === "annual" || p.offer_tier === "both";
  const showMonthly = p.offer_tier === "monthly" || p.offer_tier === "both";
  const firstName = (p.display_name || "Your therapist").replace(/^(dr\.?\s+)/i, "").split(/[\s,]+/)[0];
  const credSuffix =
    p.credentials && !new RegExp(`\\b${p.credentials.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(p.display_name || "")
      ? `, ${p.credentials}`
      : "";
  const fullName = `${p.display_name}${credSuffix}`;
  // Shared Kajabi offer checkout URLs (same for every partner). The per-partner
  // affiliate referral code is appended so sales attribute to that therapist.
  const OFFER = {
    annual: "https://www.aea-neuro-fitness-academy.com/offers/xk2ocnsq/checkout",
    monthly: "https://www.aea-neuro-fitness-academy.com/offers/EJi92Bo7/checkout",
    happiness: "https://www.aea-neuro-fitness-academy.com/offers/NFhWDLun/checkout",
  };
  // Plain checkout URLs. Attribution is handled by the Kajabi affiliate cookie,
  // which is set when a client arrives via the therapist's personal share link.
  const annualLink = OFFER.annual;
  const monthlyLink = OFFER.monthly;
  const happinessLink = OFFER.happiness;

  const benefits = [
    { t: "Guided programs", d: "Structured courses that build real mental-fitness skills, one session at a time." },
    { t: "Daily practice", d: "Short, practical exercises you can do between appointments to keep momentum." },
    { t: "A supportive community", d: "Grow alongside others on the same path, with encouragement that sticks." },
    { t: "Progress you can feel", d: "Track your wins and watch the small habits compound into lasting change." },
  ];

  return (
    <div className="pp" style={styleVars}>
      <header className="pp-nav">
        <div className="pp-nav-in">
          <span className="pp-brandname">{p.practice_name || p.display_name}</span>
          <a className="pp-navcta" href="#offers">Get started</a>
        </div>
      </header>

      <section className="pp-hero">
        <div className="pp-hero-in">
          <div className="pp-hero-text">
            <span className="pp-eyebrow">Mental fitness, guided by {firstName}</span>
            <h1>{p.custom_offer_headline || "Build a stronger, calmer mind — between every session."}</h1>
            <p className="pp-lede">{p.short_bio}</p>
            <div className="pp-hero-cta">
              <a className="pp-btn primary" href="#offers">Start today</a>
              <a className="pp-btn ghost" href="#offers">See the options</a>
            </div>
            <div className="pp-cred">
              <span className="pp-dot" /> {fullName}{p.practice_location ? ` · ${p.practice_location}` : ""}
            </div>
          </div>
          <div className="pp-hero-photo">
            {p.headshot_url ? (
              <img src={p.headshot_url} alt={p.display_name} />
            ) : (
              <div className="pp-photo-ph">{(firstName[0] || "M").toUpperCase()}</div>
            )}
            <span className="pp-badge">{p.credentials || "Licensed"}</span>
          </div>
        </div>
      </section>

      <section className="pp-benefits">
        <div className="pp-section-in">
          <h2>What’s inside MindFit Academy</h2>
          <p className="pp-section-sub">A complete mental-fitness program {firstName} hand-picks for clients ready to keep growing outside the therapy room.</p>
          <div className="pp-grid">
            {benefits.map((b, i) => (
              <div className="pp-bcard" key={i}>
                <span className="pp-bicon"><Check /></span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-note">
        <div className="pp-note-in">
          {p.headshot_url && <img className="pp-note-photo" src={p.headshot_url} alt={p.display_name} />}
          <div>
            <div className="pp-quotemark">“</div>
            <p className="pp-note-text">{p.client_audience_note
              ? `I created this for ${p.client_audience_note.toLowerCase()} — a way to keep building between our sessions, at your own pace.`
              : `Therapy is powerful, but the real change happens in the days between our sessions. MindFit Academy is how I help you keep that momentum going.`}</p>
            <div className="pp-note-by">— {fullName}</div>
          </div>
        </div>
      </section>

      <section className="pp-pricing" id="offers">
        <div className="pp-section-in">
          <h2>Choose your starting point</h2>
          <p className="pp-section-sub">Every plan is the full MindFit Academy experience, offered through {firstName}.</p>
          <div className="pp-plans">
            {p.sells_mindfit && showAnnual && (
              <div className="pp-plan featured">
                <span className="pp-tag">Best value</span>
                <h3>MindFit Academy — Annual</h3>
                <div className="pp-price">$1,000<small>/ year</small></div>
                <p className="pp-plan-sub">A full year of guided mental fitness.</p>
                <ul>
                  <li><Check /> Every course &amp; guided program</li>
                  <li><Check /> Daily practices &amp; tools</li>
                  <li><Check /> Member community access</li>
                  <li><Check /> Best price — 2 months free vs monthly</li>
                </ul>
                <a className="pp-btn primary wide" href={annualLink}>Enroll for a year</a>
              </div>
            )}
            {p.sells_mindfit && showMonthly && (
              <div className="pp-plan">
                <h3>MindFit Academy — Monthly</h3>
                <div className="pp-price">$99<small>/ month</small></div>
                <p className="pp-plan-sub">Full access, month to month.</p>
                <ul>
                  <li><Check /> Every course &amp; guided program</li>
                  <li><Check /> Daily practices &amp; tools</li>
                  <li><Check /> Member community access</li>
                  <li><Check /> Flexible monthly billing</li>
                </ul>
                <a className="pp-btn outline wide" href={monthlyLink}>Start monthly</a>
              </div>
            )}
            {p.sells_happiness && (
              <div className="pp-plan">
                <h3>Happiness Bootcamp</h3>
                <div className="pp-price">$250<small>/ once</small></div>
                <p className="pp-plan-sub">A focused program to build daily happiness habits.</p>
                <ul>
                  <li><Check /> Step-by-step happiness program</li>
                  <li><Check /> Practical daily exercises</li>
                  <li><Check /> Yours to keep</li>
                </ul>
                <a className="pp-btn outline wide" href={happinessLink}>Join the bootcamp</a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pp-final">
        <div className="pp-final-in">
          <h2>Ready to keep growing?</h2>
          <p>Join {firstName}’s clients building stronger minds with MindFit Academy.</p>
          <a className="pp-btn onbrand" href="#offers">Get started today</a>
        </div>
      </section>

      <footer className="pp-foot">
        Offered by {p.practice_name || p.display_name} in partnership with AEA Institute · MindFit Academy.
      </footer>
    </div>
  );
}
