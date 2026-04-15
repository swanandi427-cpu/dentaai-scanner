async function createCheckout(options) {
  const fn = window.__stripeCheckout;
  if (typeof fn === "function") {
    await fn(options);
    return;
  }
  window.location.href = `mailto:DANTANOVA.14@gmail.com?subject=DantaNova Subscription - ${options.priceId}&body=I'd like to subscribe to the plan: ${options.priceId}`;
}
export {
  createCheckout
};
