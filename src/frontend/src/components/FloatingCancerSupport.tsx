import { HeartHandshake } from "lucide-react";

export default function FloatingCancerSupport() {
  return (
    <>
      <style>{`
        @keyframes cancerPulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(255,107,107,0.6), 0 0 0 0 rgba(255,107,107,0.4);
          }
          50% {
            box-shadow: 0 4px 30px rgba(255,215,0,0.8), 0 0 0 10px rgba(255,107,107,0);
          }
        }
      `}</style>
      <a
        href="/cancer-support"
        aria-label="Support cancer patients"
        data-ocid="cancer_support.open_modal_button"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "50px",
          background: "linear-gradient(135deg, #ff6b6b, #ffd700)",
          color: "#000",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(255,107,107,0.6)",
          border: "2px solid #ffd700",
          animation: "cancerPulse 2s ease-in-out infinite",
        }}
      >
        <HeartHandshake
          style={{ width: "18px", height: "18px", flexShrink: 0 }}
        />
        <span>Cancer Support</span>
      </a>
    </>
  );
}
