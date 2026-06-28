"use client";

import "../globals.css";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const BASE = "https://mindfit-engine.vercel.app";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | found | notfound | error
  const [partner, setPartner] = useState(null);
  const [copied, setCopied] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setState("loading");
    const { data, error } = await supabase.rpc("partner_link_by_email", { p_email: email });
    if (error) { setState("error"); return; }
    if (!data?.found) { setState("notfound"); return; }
    setPartner(data);
    setState("found");
  }

  const url = partner ? `${BASE}/${partner.slug}` : ""; // their branded page (for preview)
  // The link to actually SHARE: the affiliate share link sets tracking so enrollments
  // are credited to them. Falls back to the page URL until the share link is set.
  const shareLink = (partner && partner.affiliate_share_link) || url;
  const linkReady = !!(partner && partner.affiliate_share_link);
  const first = (partner?.display_name || "there").replace(/^(dr\.?\s+)/i, "").split(/[\s,]+/)[0];

  const messages = partner
    ? [
        {
          label: "Quick text / DM",
          text: `Hi! I just launched a mental-fitness program I think you'd love — guided practices you can do between our sessions. Take a look: ${shareLink}`,
        },
        {
          label: "Email to a client",
          text: `Hi [name],\n\nI wanted to share something I've put together for clients who want to keep building on our work between sessions. It's called MindFit Academy — guided programs, daily practices, and a supportive community.\n\nYou can see it and get started here: ${shareLink}\n\nWarmly,\n${partner.display_name}`,
        },
        {
          label: "Social post",
          text: `Excited to share MindFit Academy with my clients — a simple way to keep growing your mental fitness between sessions. Start here: ${shareLink}`,
        },
      ]
    : [];

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1800);
    } catch (_) {}
  }

  return (
    <main className="wel-wrap">
      <div className="wel-card">
        {state !== "found" ? (
          <>
            <span className="eyebrow dark">MindFit Academy · Partners</span>
            <h1>Welcome aboard 🎉</h1>
            <p className="wel-sub">Enter the email you applied with to get your personal page link and ready-to-send client messages.</p>
            <form onSubmit={onSubmit}>
              <input
                type="email"
                required
                placeholder="you@yourpractice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <button className="cta submit" type="submit" disabled={state === "loading"}>
                {state === "loading" ? "Finding your page…" : "Get my page link"}
              </button>
            </form>
            {state === "notfound" && (
              <div className="apply-error" style={{ marginTop: 14 }}>
                We couldn’t find a live page for that email yet. Your application may still be in review —
                we’ll email you the moment it’s approved.
              </div>
            )}
            {state === "error" && (
              <div className="apply-error" style={{ marginTop: 14 }}>Something went wrong. Please try again.</div>
            )}
          </>
        ) : (
          <>
            <span className="eyebrow dark">You’re live, {first} 🎉</span>

            <div className="wel-step">
              <div className="wel-stepnum">1</div>
              <div>
                <div className="wel-steptitle">Set up your payout account</div>
                <p className="wel-steptext">So your 50% is tracked and paid out, create your free affiliate account (use the same email you applied with). One-time, takes a minute.</p>
                <a className="wel-step-btn" href="https://www.aea-neuro-fitness-academy.com/affiliate_users/sign_up" target="_blank" rel="noreferrer">Set up payout account →</a>
              </div>
            </div>

            <h1 style={{ marginTop: 26 }}>Step 2 — Your link to share</h1>
            <p className="wel-sub">Share this link with your clients. They land on your branded page, and every enrollment is credited to you.</p>

            <div className="wel-urlbox">
              <a className="wel-url" href={shareLink} target="_blank" rel="noreferrer">{shareLink}</a>
              <button className="wel-copy" onClick={() => copy(shareLink, "url")}>
                {copied === "url" ? "Copied!" : "Copy link"}
              </button>
            </div>
            {!linkReady && (
              <p className="wel-sub" style={{ fontSize: 13, marginTop: -4 }}>
                Note: your tracking link is still being finalized — we’ll email you the moment it’s ready. For now this is your page link.
              </p>
            )}
            <a className="cta submit" href={url} target="_blank" rel="noreferrer" style={{ marginTop: 4 }}>Preview my page</a>

            <h2 className="wel-sec">Ready-to-send messages</h2>
            <p className="wel-sub" style={{ marginTop: 0 }}>Copy any of these and send to your clients.</p>
            {messages.map((m) => (
              <div className="wel-msg" key={m.label}>
                <div className="wel-msg-head">
                  <span>{m.label}</span>
                  <button className="wel-copy small" onClick={() => copy(m.text, m.label)}>
                    {copied === m.label ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
