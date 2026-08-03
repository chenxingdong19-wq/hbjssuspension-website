/**
 * Product inquiry → Web3Forms → corporate email.
 * Pure front-end, no backend needed.
 */

const WEB3FORMS_ACCESS_KEY = "1e8646a2-8536-4ea5-94ec-e0a3d85fbf2f";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface InquiryPayload {
  product: string;
  id: string;
  oem?: string;
  category?: string;
  url: string;
}

/**
 * Send a product inquiry as an email via Web3Forms.
 * Never throws — returns boolean so caller can degrade gracefully.
 */
export async function sendInquiryToEmail(info: InquiryPayload): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Product Inquiry: ${info.product}`,
        from_name: "HBJS Suspension Website",
        // Structured body fields — surfaced in the email Web3Forms sends
        product: info.product,
        id: info.id,
        oem: info.oem || "",
        category: info.category || "",
        url: info.url,
      }),
    });

    if (!res.ok) {
      console.warn("[inquiry] Web3Forms responded", res.status);
      return false;
    }

    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return json.success === true;
  } catch (e) {
    console.warn("[inquiry] failed silently", e);
    return false;
  }
}