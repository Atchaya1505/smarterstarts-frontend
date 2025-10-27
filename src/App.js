import React, { useState } from "react";
import "./App.css";

// Component Imports
import ProblemStep from "./components/ProblemStep";
import UserDetailsStep from "./components/UserDetailsStep";
import RecommendationsStep from "./components/RecommendationsStep";
import FeedbackStep from "./components/FeedbackStep";
import CalendarStep from "./components/CalendarStep"; // ✅ Correct capitalization
import ThankYouStep from "./components/ThankYouStep";

function App() {
  // -----------------------------
  // Step & State Management
  // -----------------------------
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [recommendations, setRecommendations] = useState({ text: "", tools: [] });
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);

  // Step Navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // -----------------------------
  // Backend URL (Dynamic)
  // -----------------------------
  const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://smarterstarts1-backend.onrender.com"
    : "https://smarterstarts1-backend.onrender.com"; // force HTTPS even in dev

  // -----------------------------
  // Backend: Generate Recommendations
  // -----------------------------
  const handleGenerateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        // ✅ Store AI response in local state
        setRecommendations({
          text: data.recommendations || "",
          tools: data.tool_names || [],
        });

        // ✅ Save full context for later steps (Feedback)
        localStorage.setItem(
          "smarterstarts_form",
          JSON.stringify({
            ...formData,
            recommendations: {
              text: data.recommendations,
              tools: data.tool_names,
            },
          })
        );

        console.log("💾 Saved form + recommendations to localStorage:", {
          ...formData,
          recommendations: data.recommendations,
        });

        nextStep();
      } else {
        alert("⚠️ Failed to generate recommendations. Please try again.");
      }
    } catch (error) {
      console.error("❌ Backend connection error:", error);
      alert("Could not connect to SmarterStarts backend. Please try again or check logs.");
    } finally {
      setLoading(false);
    }
  };

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
