/**
 * Tawk.to integration helpers (server-agnostic, safe in browser only).
 */

export interface InquiryPayload {
  product: string;
  id: string;
  oem?: string;
  category?: string;
  url: string;
}

declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      addEvent?: (eventName: string, attributes?: Record<string, unknown>) => void;
      setAttributes?: (attributes: Record<string, unknown>, callback?: () => void) => void;
      [key: string]: unknown;
    };
  }
}

function tawkReady(timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const check = () => {
      if (window.Tawk_API && typeof window.Tawk_API.addEvent === "function") {
        resolve(true);
      } else {
        setTimeout(check, 150);
      }
    };
    check();
    // Safety timeout — never hang the UI on Tawk
    setTimeout(() => resolve(false), timeoutMs);
  });
}

/**
 * Send a product inquiry into Tawk.to backend.
 * Uses setAttributes (visible in visitor card) + addEvent (visible in activity).
 * Waits for the Tawk script to be ready; never throws, never blocks UI.
 */
export async function sendTawkInquiry(info: InquiryPayload): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const ready = await tawkReady();
  if (!ready || !window.Tawk_API) {
    // Tawk blocked / not loaded within timeout — degrade silently
    console.info("[Tawk] not ready, inquiry logged locally", info);
    return false;
  }

  try {
    // 1) Set visitor attributes so agent sees product context in the visitor card
    if (typeof window.Tawk_API.setAttributes === "function") {
      window.Tawk_API.setAttributes({
        product: info.product,
        productId: info.id,
        oem: info.oem || "",
        category: info.category || "",
        inquiryUrl: info.url,
      });
    }

    // 2) Fire a structured event — appears in Tawk Activity feed
    if (typeof window.Tawk_API.addEvent === "function") {
      window.Tawk_API.addEvent("New Product Inquiry", {
        Product: info.product,
        ID: info.id,
        OEM: info.oem || "",
        URL: info.url,
      });
    }

    return true;
  } catch (e) {
    console.warn("[Tawk] inquiry dispatch failed silently", e);
    return false;
  }
}