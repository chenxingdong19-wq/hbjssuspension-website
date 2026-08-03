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

export interface FullInquiryPayload {
  name: string;
  company?: string;
  email: string;
  country?: string;
  product: string;
  message: string;
  url: string;
}

async function postToWeb3Forms(fields: Record<string, unknown>, subject: string, fromName: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: fromName,
        ...fields,
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

/**
 * Send a product inquiry as an email via Web3Forms (quick "Inquire" button).
 * Never throws — returns boolean so caller can degrade gracefully.
 */
export async function sendInquiryToEmail(info: InquiryPayload): Promise<boolean> {
  return postToWeb3Forms(
    {
      product: info.product,
      id: info.id,
      oem: info.oem || "",
      category: info.category || "",
      url: info.url,
    },
    `New Product Inquiry: ${info.product}`,
    "HBJS Suspension Website"
  );
}

/**
 * Send a full Request-a-Quote form as an email via Web3Forms.
 * Never throws — returns boolean so caller can degrade gracefully.
 */
export async function sendFullInquiryToEmail(info: FullInquiryPayload): Promise<boolean> {
  return postToWeb3Forms(
    {
      name: info.name,
      company: info.company || "",
      email: info.email,
      country: info.country || "",
      product: info.product,
      message: info.message,
      url: info.url,
    },
    `Request a Quote: ${info.product || "General Inquiry"}`,
    `${info.name || "Website Visitor"}`
  );
}