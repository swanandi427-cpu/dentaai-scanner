async function createCheckout(options) {
  const fn = window.__stripeCheckout;
  if (typeof fn === "function") {
    await fn({
      priceId: options.priceId,
      amount: options.amountRupees ? Math.round(options.amountRupees * 100) : void 0,
      currency: options.currency ?? "inr",
      productName: options.productName,
      successUrl: options.successUrl,
      cancelUrl: options.cancelUrl,
      onSuccess: options.onSuccess ? (sessionId) => {
        void options.onSuccess(sessionId);
      } : void 0,
      onCancel: options.onCancel
    });
    return;
  }
  const subject = encodeURIComponent(
    `DantaNova Payment — ${options.productName ?? options.priceId ?? "Checkout"}`
  );
  const body = encodeURIComponent(
    `Hello,

I'd like to complete my payment for: ${options.productName ?? options.priceId ?? "DantaNova"}

Please contact me to proceed.`
  );
  window.location.href = `mailto:DANTANOVA.14@gmail.com?subject=${subject}&body=${body}`;
}
function generateFallbackSessionId() {
  return `danta_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
export {
  createCheckout,
  generateFallbackSessionId
};
