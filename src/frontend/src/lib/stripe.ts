/**
 * Stripe checkout helper — uses the platform Stripe extension.
 * The Stripe extension injects window.__stripeCheckout() at runtime.
 * All amounts are in Indian Rupees (₹ / INR).
 */

export interface CheckoutOptions {
  priceId?: string;
  /** Amount in rupees (for one-time checkout flows) */
  amountRupees?: number;
  currency?: string;
  productName?: string;
  successUrl: string;
  cancelUrl: string;
  /** Called with the Stripe session ID when checkout succeeds */
  onSuccess?: (sessionId: string) => Promise<void> | void;
  /** Called when the user cancels or checkout fails */
  onCancel?: () => void;
}

interface StripeExtensionCheckout {
  priceId?: string;
  amount?: number;
  currency?: string;
  productName?: string;
  successUrl: string;
  cancelUrl: string;
  onSuccess?: (sessionId: string) => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    __stripeCheckout?: (opts: StripeExtensionCheckout) => Promise<void>;
  }
}

/**
 * Open Stripe Checkout via the platform extension.
 *
 * Flow:
 *  1. If window.__stripeCheckout is injected (extension active) → use it.
 *  2. onSuccess(sessionId) is called when the user completes payment.
 *  3. If extension is not available, fall back gracefully.
 */
export async function createCheckout(options: CheckoutOptions): Promise<void> {
  const fn = window.__stripeCheckout;

  if (typeof fn === "function") {
    await fn({
      priceId: options.priceId,
      amount: options.amountRupees
        ? Math.round(options.amountRupees * 100) // convert to paise
        : undefined,
      currency: options.currency ?? "inr",
      productName: options.productName,
      successUrl: options.successUrl,
      cancelUrl: options.cancelUrl,
      onSuccess: options.onSuccess
        ? (sessionId: string) => {
            void options.onSuccess!(sessionId);
          }
        : undefined,
      onCancel: options.onCancel,
    });
    return;
  }

  // Graceful fallback: notify via email
  const subject = encodeURIComponent(
    `DantaNova Payment — ${options.productName ?? options.priceId ?? "Checkout"}`,
  );
  const body = encodeURIComponent(
    `Hello,\n\nI'd like to complete my payment for: ${options.productName ?? options.priceId ?? "DantaNova"}\n\nPlease contact me to proceed.`,
  );
  window.location.href = `mailto:DANTANOVA.14@gmail.com?subject=${subject}&body=${body}`;
}

/**
 * Generate a mock session ID for development / fallback use.
 * Replace with the real Stripe session ID in production.
 */
export function generateFallbackSessionId(): string {
  return `danta_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
