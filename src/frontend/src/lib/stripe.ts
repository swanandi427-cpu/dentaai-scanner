/**
 * Stripe checkout helper — uses the platform Stripe extension.
 * Replace STRIPE_PUBLISHABLE_KEY with your real key when going live.
 */

interface CheckoutOptions {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckout(options: CheckoutOptions): Promise<void> {
  // The Stripe extension exposes a global checkout function via the platform.
  // When the extension is active, window.__stripeCheckout is injected at runtime.
  // For now we redirect to a contact form as a graceful fallback.
  const fn = (
    window as Window &
      typeof globalThis & {
        __stripeCheckout?: (opts: CheckoutOptions) => Promise<void>;
      }
  ).__stripeCheckout;

  if (typeof fn === "function") {
    await fn(options);
    return;
  }

  // Fallback: open contact sales email
  window.location.href =
    `mailto:DANTANOVA.14@gmail.com?subject=DantaNova Subscription - ${options.priceId}` +
    `&body=I'd like to subscribe to the plan: ${options.priceId}`;
}
