import { createClient } from "@supabase/supabase-js";

// Read-only public client. Uses the publishable (anon) key and only ever
// touches the `partner_public` view, which exposes safe branding columns
// for LIVE partners only.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export async function getPartnerBySlug(slug) {
  const { data, error } = await supabase
    .from("partner_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getPartnerBySlug", error.message);
    return null;
  }
  return data;
}

export async function getAllPartnerSlugs() {
  const { data } = await supabase.from("partner_public").select("slug");
  return (data || []).map((r) => r.slug);
}
