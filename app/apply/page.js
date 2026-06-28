"use client";

import "../globals.css";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.25-8.25 1.4 1.4z" />
  </svg>
);

const OFFERINGS = [
  { key: "annual", name: "MindFit Academy — Annual", price: "$1,000 / year", note: "Best value for committed clients" },
  { key: "monthly", name: "MindFit Academy — Monthly", price: "$99 / month", note: "Flexible, month to month" },
  { key: "happiness", name: "Happiness Bootcamp", price: "$250 one-time", note: "A focused happiness-habits program" },
];

export default function ApplyPage() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState(null);
  const [offers, setOffers] = useState({ annual: true, monthly: true, happiness: true });
  const [form, setForm] = useState({
    full_name: "",
    display_name: "",
    credentials: "",
    short_bio: "",
    email: "",
    phone: "",
    practice_name: "",
    practice_location: "",
    practice_website: "",
    brand_color: "#7CC00B",
    client_audience_note: "",
    license_number: "",
    license_state: "",
    agreement_accepted: false,
    company_website: "", // honeypot
  });

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };
  const toggleOffer = (k) => setOffers((o) => ({ ...o, [k]: !o[k] }));
  const allOn = offers.annual && offers.monthly && offers.happiness;
  const anyOffer = offers.annual || offers.monthly || offers.happiness;

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    if (form.company_website) { setStatus("done"); return; }
    if (!anyOffer) { setErrorMsg("Please choose at least one offering to sell."); return; }
    if (!form.agreement_accepted) { setErrorMsg("Please accept the partner agreement to continue."); return; }

    const sells_mindfit = offers.annual || offers.monthly;
    const sells_happiness = offers.happiness;
    const offer_tier = offers.annual && offers.monthly ? "both" : offers.annual ? "annual" : offers.monthly ? "monthly" : "both";

    setStatus("submitting");
    try {
      let headshot_url = null;
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${Date.now()}-${safe}`;
        const up = await supabase.storage.from("headshots").upload(path, file);
        if (up.error) throw new Error("Headshot upload failed: " + up.error.message);
        headshot_url = supabase.storage.from("headshots").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.rpc("submit_partner_application", {
        p_full_name: form.full_name,
        p_display_name: form.display_name,
        p_credentials: form.credentials,
        p_short_bio: form.short_bio,
        p_email: form.email,
        p_offer_tier: offer_tier,
        p_agreement_accepted: form.agreement_accepted,
        p_license_number: form.license_number,
        p_license_state: form.license_state,
        p_headshot_url: headshot_url,
        p_practice_name: form.practice_name || null,
        p_practice_location: form.practice_location || null,
        p_practice_website: form.practice_website || null,
        p_phone: form.phone || null,
        p_brand_color: form.brand_color || null,
        p_sells_mindfit: sells_mindfit,
        p_sells_happiness: sells_happiness,
        p_client_audience_note: form.client_audience_note || null,
      });
      if (error) throw new Error(error.message);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="ap-wrap">
        <div className="ap-done">
          <div className="ap-done-badge">✓</div>
          <h1>Application received</h1>
          <p>
            Thanks for applying to become a MindFit Academy partner. We’ll verify your license and
            review your details, then email your live branded page and welcome kit. No further action
            needed on your end.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="ap-wrap">
      <div className="ap-grid">
        <aside className="ap-aside">
          <span className="ap-eyebrow">MindFit Academy · Partner Program</span>
          <h1>Turn your sessions into lasting change — and recurring income.</h1>
          <p className="ap-aside-sub">
            Get your own branded mental-fitness program to share with clients between sessions. We
            build everything; you just share your link.
          </p>
          <ul className="ap-perks">
            <li><span><Check /></span> Your own branded page, live in 24 hours</li>
            <li><span><Check /></span> Keep <strong>50%</strong> of every enrollment</li>
            <li><span><Check /></span> Zero tech or setup on your side</li>
            <li><span><Check /></span> Ready-to-send messages for your clients</li>
          </ul>
        </aside>

        <form className="ap-card" onSubmit={onSubmit}>
          <h2 className="ap-h2">Apply to become a partner</h2>
          <p className="ap-lead">Takes about 3 minutes. Fill it out once — we handle the rest.</p>

          <h3 className="ap-sec">Your identity &amp; branding</h3>
          <div className="ap-2col">
            <label>Full name *<input required value={form.full_name} onChange={set("full_name")} /></label>
            <label>How your name should appear *<input required placeholder="Dr. Sarah Klein, LMFT" value={form.display_name} onChange={set("display_name")} /></label>
            <label>Credentials *<input required placeholder="LMFT, LCSW, PsyD…" value={form.credentials} onChange={set("credentials")} /></label>
            <label>Practice name<input value={form.practice_name} onChange={set("practice_name")} /></label>
          </div>
          <label>Short bio *<textarea required rows={4} placeholder="A sentence or two clients will see on your page." value={form.short_bio} onChange={set("short_bio")} /></label>
          <div className="ap-2col">
            <label>Headshot<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
            <label>Brand accent color<input type="color" value={form.brand_color} onChange={set("brand_color")} /></label>
          </div>

          <h3 className="ap-sec">Contact</h3>
          <div className="ap-2col">
            <label>Email *<input required type="email" value={form.email} onChange={set("email")} /></label>
            <label>Phone<input value={form.phone} onChange={set("phone")} /></label>
            <label>Practice website<input placeholder="https://…" value={form.practice_website} onChange={set("practice_website")} /></label>
            <label>City / State<input placeholder="Austin, TX" value={form.practice_location} onChange={set("practice_location")} /></label>
          </div>

          <h3 className="ap-sec ap-sec-row">
            What would you like to offer?
            <button type="button" className="ap-selectall" onClick={() => setOffers({ annual: !allOn, monthly: !allOn, happiness: !allOn })}>
              {allOn ? "Clear all" : "Select all three"}
            </button>
          </h3>
          <p className="ap-hint">Pick any combination — one, two, or all three. You can change this later.</p>
          <div className="ap-offers">
            {OFFERINGS.map((o) => {
              const on = offers[o.key];
              return (
                <button type="button" key={o.key} className={`ap-offer${on ? " on" : ""}`} onClick={() => toggleOffer(o.key)}>
                  <span className="ap-offer-box">{on && <Check />}</span>
                  <span className="ap-offer-main">
                    <span className="ap-offer-name">{o.name}</span>
                    <span className="ap-offer-note">{o.note}</span>
                  </span>
                  <span className="ap-offer-price">{o.price}</span>
                </button>
              );
            })}
          </div>
          <label style={{ marginTop: 16 }}>Who do you serve? <span className="ap-opt">(optional — helps us tailor your page)</span>
            <input value={form.client_audience_note} onChange={set("client_audience_note")} placeholder="e.g. busy professionals, teens, couples" />
          </label>

          <h3 className="ap-sec">License verification</h3>
          <div className="ap-2col">
            <label>License number *<input required value={form.license_number} onChange={set("license_number")} /></label>
            <label>Licensing state / board *<input required value={form.license_state} onChange={set("license_state")} /></label>
          </div>

          <label className="ap-agree">
            <input type="checkbox" checked={form.agreement_accepted} onChange={set("agreement_accepted")} />
            <span>I agree to the MindFit Academy <a href="/agreement" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "#4d7700", textDecoration: "underline", fontWeight: 700 }}>partner agreement</a>, including the 50/50 revenue share, and confirm I am a currently licensed therapist.</span>
          </label>

          <input
            type="text" name="company_website" tabIndex={-1} autoComplete="off"
            value={form.company_website} onChange={set("company_website")}
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true"
          />

          {errorMsg && <div className="apply-error">{errorMsg}</div>}

          <button className="ap-submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting…" : "Submit application"}
          </button>
          <p className="ap-fine">After a quick license + accuracy review, your page goes live and you’ll get a welcome email. We never publish before review.</p>
        </form>
      </div>
    </main>
  );
}
