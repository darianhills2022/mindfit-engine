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

function initials(n) {
  return String(n || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
}

export default function ReviewPage() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState([]);
  const [live, setLive] = useState([]);
  const [err, setErr] = useState("");
  const [flash, setFlash] = useState("");
  const [busy, setBusy] = useState(null);
  const [linkDrafts, setLinkDrafts] = useState({});
  const [savingLink, setSavingLink] = useState(null);
  const [savedLink, setSavedLink] = useState(null);

  async function load(code) {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase.rpc("review_list", { p_passcode: code });
    setLoading(false);
    if (error) {
      setErr(error.message.includes("Invalid passcode") ? "That passcode isn't right." : error.message);
      return false;
    }
    setPending(data?.pending || []);
    setLive(data?.live || []);
    return true;
  }

  async function onUnlock(e) {
    e.preventDefault();
    const ok = await load(passcode);
    if (ok) setAuthed(true);
  }

  async function act(id, action) {
    setBusy(id);
    setFlash("");
    const { data, error } = await supabase.rpc("review_set_status", {
      p_passcode: passcode,
      p_id: id,
      p_action: action,
    });
    setBusy(null);
    if (error) { setErr(error.message); return; }
    const moved = pending.find((p) => p.id === id);
    setPending((list) => list.filter((p) => p.id !== id));
    if (action === "approve" && moved) {
      setLive((list) => [{ ...moved, slug: data?.slug || moved.slug }, ...list]);
      setFlash(`${data?.display_name || "Partner"} is now live at ${BASE}/${data?.slug || ""}`);
    } else if (action === "reject") {
      setFlash("Application set aside (paused).");
    }
  }

  async function saveShareLink(id) {
    setSavingLink(id);
    const link = linkDrafts[id] ?? "";
    const { data, error } = await supabase.rpc("set_partner_share_link", {
      p_passcode: passcode,
      p_id: id,
      p_link: link,
    });
    setSavingLink(null);
    if (error) { setErr(error.message); return; }
    setLive((list) => list.map((p) => (p.id === id ? { ...p, affiliate_share_link: data?.affiliate_share_link || null } : p)));
    setSavedLink(id);
    setTimeout(() => setSavedLink((s) => (s === id ? null : s)), 1800);
  }

  if (!authed) {
    return (
      <main className="rev-gate">
        <form className="rev-gatecard" onSubmit={onUnlock}>
          <span className="eyebrow dark">MindFit Academy</span>
          <h1>Partner Review</h1>
          <p>Enter the team passcode to review and approve partner applications.</p>
          <input
            type="password"
            placeholder="Team passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
          />
          {err && <div className="apply-error">{err}</div>}
          <button className="cta submit" type="submit" disabled={loading}>
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="rev-wrap">
      <div className="rev-inner">
        <div className="rev-head">
          <div>
            <h1>Partner Review Queue</h1>
            <p className="rev-sub">Approve licensed therapists to take their site live.</p>
          </div>
          <button className="rev-refresh" onClick={() => load(passcode)} disabled={loading}>
            {loading ? "…" : "Refresh"}
          </button>
        </div>

        <div className="rev-stats">
          <div className="stat"><b>{pending.length}</b><span>Pending</span></div>
          <div className="stat"><b>{live.length}</b><span>Live</span></div>
        </div>

        {flash && <div className="flash">{flash}</div>}
        {err && <div className="apply-error">{err}</div>}

        <h2 className="rev-sec">Pending review</h2>
        {pending.length === 0 ? (
          <div className="rev-empty">No applications waiting. New submissions from the apply form land here.</div>
        ) : (
          pending.map((p) => (
            <div className="rev-card" key={p.id}>
              {p.headshot_url ? (
                <img className="rev-ph" src={p.headshot_url} alt="" />
              ) : (
                <div className="rev-ph rev-ph-ph">{initials(p.display_name)}</div>
              )}
              <div className="rev-body">
                <div className="rev-name">{p.display_name}</div>
                <div className="rev-meta">
                  {[p.credentials, p.practice_location, p.email, p.phone].filter(Boolean).join(" · ")}
                </div>
                <div className="rev-bio">{p.short_bio}</div>
                <div className="rev-tags">
                  <span className="tag lic">License: {p.license_number || "—"} ({p.license_state || "—"})</span>
                  {p.sells_mindfit && <span className="tag">MindFit Academy</span>}
                  {p.sells_happiness && <span className="tag">Happiness Bootcamp</span>}
                  <span className="tag">{p.offer_tier === "both" ? "Annual + Monthly" : p.offer_tier === "annual" ? "Annual" : "Monthly"}</span>
                </div>
                <div className="rev-actions">
                  <button className="approve" disabled={busy === p.id} onClick={() => act(p.id, "approve")}>
                    {busy === p.id ? "Working…" : "Approve & go live"}
                  </button>
                  <button className="reject" disabled={busy === p.id} onClick={() => act(p.id, "reject")}>Reject</button>
                </div>
              </div>
            </div>
          ))
        )}

        <h2 className="rev-sec">Live partners</h2>
        {live.length === 0 ? (
          <div className="rev-empty">No live partners yet.</div>
        ) : (
          live.map((p) => (
            <div className="rev-livecard" key={p.id}>
              <div className="rev-livehead">
                {p.headshot_url ? (
                  <img className="rev-ph small" src={p.headshot_url} alt="" />
                ) : (
                  <div className="rev-ph small rev-ph-ph">{initials(p.display_name)}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="rev-livename">{p.display_name}</div>
                  <a className="rev-url" href={`${BASE}/${p.slug}`} target="_blank" rel="noreferrer">{BASE}/{p.slug}</a>
                </div>
                {p.affiliate_share_link
                  ? <span className="rev-badge ok">✓ Tracking link set</span>
                  : <span className="rev-badge warn">No tracking link</span>}
              </div>
              <div className="rev-linkrow">
                <input
                  className="rev-linkinput"
                  placeholder="Paste this therapist's Kajabi affiliate share link…"
                  value={linkDrafts[p.id] ?? p.affiliate_share_link ?? ""}
                  onChange={(e) => setLinkDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                />
                <button className="approve" disabled={savingLink === p.id} onClick={() => saveShareLink(p.id)}>
                  {savingLink === p.id ? "Saving…" : savedLink === p.id ? "Saved!" : "Save"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
