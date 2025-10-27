import React from "react";

function ThankYouStep() {
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 style={{ fontSize: "2rem", color: "#111827", fontWeight: "700" }}>
        🎉 Thank You!
      </h2>
      <p style={{ color: "#374151", marginTop: "15px", lineHeight: "1.6" }}>
        Your SmarterStarts consultation has been successfully booked.
        <br />
        We’ll reach out soon to confirm your session and next steps.
      </p>

      <div
        style={{
          marginTop: "40px",
          display: "inline-block",
          padding: "12px 30px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "500",
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/")}
      >
        Back to Home →
      </div>

      <p style={{ marginTop: "30px", color: "#6b7280" }}>Step 6 of 6</p>
    </div>
  );
}

export default ThankYouStep;
