import React from "react";

function UserDetailsStep({
  formData,
  setFormData,
  prevStep,
  handleGenerateRecommendations,
  loading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h2>📩 Step 2 — Please share your details</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
      />

      <select
        name="company_size"
        value={formData.company_size}
        onChange={handleChange}
      >
        <option value="">Select Company Size</option>
        <option value="Solo">Solo</option>
        <option value="SMB">SMB (1–50 employees)</option>
        <option value="Mid">Mid (51–200 employees)</option>
        <option value="Enterprise">Enterprise (200+ employees)</option>
      </select>

      <input
        type="number"
        name="budget"
        placeholder="Budget (optional)"
        value={formData.budget}
        onChange={handleChange}
      />

      <div className="btn-container">
        <button onClick={prevStep} className="btn back">
          ← Back
        </button>
        <button
          onClick={handleGenerateRecommendations}
          className="btn next"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Recommendations →"}
        </button>
      </div>

      <p style={{ marginTop: "25px", color: "#6b7280" }}>Step 2 of 6</p>
    </div>
  );
}

export default UserDetailsStep;
