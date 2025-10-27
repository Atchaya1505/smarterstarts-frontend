import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../App.css";

function FeedbackStep({ selectedTools, nextStep, prevStep }) {
  // ⭐ Local state
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌐 Dynamic backend URL (works both locally and in production)
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://smarterstarts1-backend.onrender.com" // your Render backend
      : "https://smarterstarts1-backend.onrender.com";

  // 🧩 Handle feedback form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("⚠️ Please provide a rating before submitting.");
      return;
    }

    if (isSubmitting) return; // prevent double submissions
    setLoading(true);
    setIsSubmitting(true);

    try {
      // 🧠 Retrieve previously saved user/session data
      const userData = JSON.parse(localStorage.getItem("smarterstartsUser")) || {};
      const problem = localStorage.getItem("smarterstartsProblem") || "";
      const recommendations = localStorage.getItem("smarterstartsRecommendations") || "";
      const savedTools =
        JSON.parse(localStorage.getItem("smarterstartsSelectedTools")) ||
        selectedTools ||
        [];

      // 🧩 Build payload to send to backend
      const payload = {
        user: {
          name: userData.name || "",
          email: userData.email || "",
          company_size: userData.company_size || "",
          budget: userData.budget || "",
        },
        problem,
        recommendations,
        selected_tools: savedTools,
        rating,
        user_feedback: feedback,
        status: "Feedback Submitted",
        createdAt: new Date().toISOString(),
      };

      console.log("📤 Sending feedback payload:", payload);

      // 🚀 Send POST request to Flask backend
      const response = await fetch(`${API_BASE}/submit_feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse JSON result
      const result = await response.json();
      console.log("🪄 Backend response:", result);

      if (result.status === "success") {
        alert("✅ Feedback submitted successfully!");
        // 🧹 Clear stored data
        localStorage.removeItem("smarterstartsUser");
        localStorage.removeItem("smarterstartsProblem");
        localStorage.removeItem("smarterstartsRecommendations");
        localStorage.removeItem("smarterstartsSelectedTools");
        nextStep();
      } else {
        alert("⚠️ Backend error: " + result.message);
      }
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      alert("❌ Could not connect to backend. Please ensure Flask is running or deployed.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------
  // 🎨 UI Layout
  // ------------------------------------------
  return (
    <div className="form-card">
      <h2>
        <span role="img" aria-label="star">
          ⭐
        </span>{" "}
        Step 4 — Your Feedback
      </h2>

      <p>
        You selected:{" "}
        <strong style={{ color: "#002D72" }}>
          {selectedTools && selectedTools.length > 0
            ? selectedTools.join(", ")
            : "No tools selected"}
        </strong>
      </p>

      <form onSubmit={handleSubmit}>
        {/* ⭐ Rating Section */}
        <div className="rating-section">
          <h3 style={{ marginBottom: "8px" }}>Your Rating</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={30}
                onClick={() => setRating(star)}
                color={star <= rating ? "#ffc107" : "#e4e5e9"}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>

        {/* ✍️ Feedback Textarea */}
        <div className="feedback-section">
          <h3 style={{ marginBottom: "8px" }}>Your Feedback</h3>
          <textarea
            placeholder="Share your thoughts about the tool recommendations..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            required
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "10px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="button-group" style={{ marginTop: "20px" }}>
          <button type="button" onClick={prevStep} className="back-btn">
            ← Back
          </button>
          <button
            type="submit"
            className="next-btn"
            disabled={loading || isSubmitting}
          >
            {loading ? "Submitting..." : "Submit Feedback →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackStep;
