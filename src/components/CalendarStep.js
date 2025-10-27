import React from "react";
import "../App.css";

function CalendarStep({ selectedTools = [], nextStep, prevStep }) {
  return (
    <div className="form-card" style={{ textAlign: "center" }}>
      <h2 style={{ fontWeight: "700", color: "#002D72", marginBottom: "10px" }}>
        📅 Step 5 — Book Your Consultation
      </h2>

      <p style={{ color: "#333", marginBottom: "30px" }}>
        Schedule a short call with our onboarding specialists to discuss your
        SmarterStarts AI recommendations and get your tailored implementation plan.
      </p>

      <div
        style={{
          backgroundColor: "#f9fbff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          maxWidth: "700px",
          margin: "0 auto 20px",
        }}
      >
        <h3 style={{ color: "#1b5e20", fontWeight: "700", marginBottom: "10px" }}>
          ✅ Done For You — SmarterStarts Implementation Offer
        </h3>

        <p style={{ marginBottom: "15px", lineHeight: "1.6", color: "#333" }}>
          Your personalized tool recommendations have been saved.<br />
          Book a free consultation to get a tailored plan for seamless SaaS tool implementation.
        </p>

        {/* Display selected tools */}
        {selectedTools.length > 0 && (
          <p style={{ fontWeight: "500", marginBottom: "20px" }}>
            <span style={{ color: "#002D72" }}>You selected:</span>{" "}
            <strong>{selectedTools.join(", ")}</strong>
          </p>
        )}

        {/* Booking button */}
        <a
          href="https://calendar.app.google/RrukbCNLTkUuDyYG8"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button
            className="next-btn"
            style={{
              backgroundColor: "#1a73e8",
              border: "none",
              padding: "12px 28px",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Book Free Consultation →
          </button>
        </a>

        <p style={{ fontSize: "13px", color: "#666", marginTop: "10px" }}>
          Opens in a new tab — takes less than 30 seconds to book.
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="button-group" style={{ marginTop: "20px" }}>
        <button
          onClick={prevStep}
          className="back-btn"
          style={{
            marginRight: "10px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            padding: "10px 22px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <button
          onClick={nextStep}
          className="next-btn"
          style={{
            backgroundColor: "#1a73e8",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default CalendarStep;
