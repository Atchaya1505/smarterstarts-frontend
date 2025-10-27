import React from "react";

function ProblemStep({ formData, setFormData, nextStep }) {
  const handleChange = (e) => {
    setFormData({ ...formData, problem: e.target.value });
  };

  const handleNext = () => {
    const problemValue = (formData.problem || "").trim(); // ✅ safe fallback

    if (!problemValue) {
      alert("Please describe your problem before continuing.");
      return;
    }
    nextStep();
  };

  return (
    <div className="form-container">
      <h2>💡 Welcome to SmarterStarts AI Tool Finder</h2>
      <p>Let's find the best SaaS tools for your needs.</p>

      <textarea
        name="problem"
        rows="4"
        placeholder="Describe the problem you're trying to solve..."
        value={formData.problem || ""} // ✅ prevents undefined
        onChange={handleChange}
      />

      <button className="btn-primary" onClick={handleNext}>
        Next →
      </button>
    </div>
  );
}

export default ProblemStep;
