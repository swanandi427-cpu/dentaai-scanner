export default function FloatingCancerSupport() {
  return (
    <a
      href="/cancer-support"
      data-ocid="cancer_support.open_modal_button"
      style={{
        position: "fixed",
        bottom: "80px",
        right: "24px",
        zIndex: 9999,
        background: "linear-gradient(135deg,#dc2626,#ffd700)",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "50px",
        fontWeight: 700,
        fontSize: "14px",
        border: "2px solid #ffd700",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
        boxShadow: "0 4px 20px rgba(220,38,38,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span>♥ Cancer Support</span>
    </a>
  );
}
