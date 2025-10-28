import React, { useState, useEffect } from "react";
import "./App.css";

// Component Imports
import ProblemStep from "./components/ProblemStep";
import UserDetailsStep from "./components/UserDetailsStep";
import RecommendationsStep from "./components/RecommendationsStep";
import FeedbackStep from "./components/FeedbackStep";
import CalendarStep from "./components/Calendarstep";
import ThankYouStep from "./components/ThankYouStep";

function App() {
  // -----------------------------
  // Step & State Management
  // -----------------------------
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [recommendations, setRecommendations] = useState({
    text: "",
    tools: [],
  });
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("🧠 Preparing your experience...");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // -----------------------------
  // Backend URL
  // -----------------------------
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://smarterstarts1-backend.onrender.com"
      : "https://smarterstarts1-backend.onrender.com";

  // -----------------------------
  // ⚡ Optimized: Generate Recommendations Instantly
  // -----------------------------
  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setLoadingMessage("🧠 Sending your request...");

    try {
      // Send request (don't wait for Gemini to finish)
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // ✅ Instantly move forward with placeholder text
      if (data.status === "success") {
        setRecommendations({
          text: "✨ Generating your personalized SaaS tool recommendations... This will appear shortly!",
          tools: [],
        });

        localStorage.setItem(
          "smarterstarts_form",
          JSON.stringify({
            ...formData,
            recommendations: data.recommendations || "",
          })
        );

        console.log("🚀 Request sent instantly to backend:", data);
        nextStep(); // ✅ Immediate step change
      } else {
        alert("⚠️ Failed to start recommendations. Please try again.");
      }
    } catch (error) {
      console.error("❌ Backend connection error:", error);
      alert("Could not connect to SmarterStarts backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // 🌀 Dynamic Loading Screen Messages
  // ---------------------------------------------
  useEffect(() => {
    if (loading) {
      const messages = [
        "🧠 Analyzing your problem...",
        "🔍 Matching the best SaaS tools for your business...",
        "✨ Finalizing personalized recommendations..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // ---------------------------------------------
  // 🌀 Loading Screen
  // ---------------------------------------------
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          color: "#002D72",
          background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)",
          padding: "20px",
        }}
      >
        <div className="spinner" />
        <h2 style={{ marginTop: "25px", fontWeight: "600", fontSize: "20px" }}>
          {loadingMessage}
        </h2>
        <p style={{ color: "#555", marginTop: "10px" }}>
          Please hold on — this usually takes just a few seconds 💡
        </p>
      </div>
    );
  }

  // -----------------------------
  // UI Rendering by Step
  // -----------------------------
  return (
    <div className="app-container">
      {/* 🧠 Step 1: Problem Input */}
      {step === 1 && (
        <ProblemStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}

      {/* 👤 Step 2: User Details */}
      {step === 2 && (
        <UserDetailsStep
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          handleGenerateRecommendations={handleGenerateRecommendations}
          loading={loading}
        />
      )}

      {/* 🤖 Step 3: Show Recommendations */}
      {step === 3 && (
        <RecommendationsStep
          recommendations={recommendations.text}
          toolNames={recommendations.tools}
          selectedTools={selectedTools}
          setSelectedTools={setSelectedTools}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {/* ⭐ Step 4: Collect Feedback */}
      {step === 4 && (
        <FeedbackStep
          selectedTools={selectedTools}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {/* 📅 Step 5: Calendar Booking */}
      {step === 5 && (
        <CalendarStep
          selectedTools={selectedTools}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {/* 🎉 Step 6: Thank You Screen */}
      {step === 6 && <ThankYouStep />}
    </div>
  );
}

export default App;