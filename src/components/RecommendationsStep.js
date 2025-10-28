import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function RecommendationsStep({
  recommendations,
  selectedTools,
  setSelectedTools,
  nextStep,
  prevStep,
  formData,
}) {
  const [toolBlocks, setToolBlocks] = useState([]);
  const [toolNames, setToolNames] = useState([]);
  const [liveRecommendations, setLiveRecommendations] = useState(recommendations);

  // ------------------------------------------
  // 🧠 Firestore Live Poll (check every 10s for new data)
  // ------------------------------------------
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("smarterstartsUser") || "{}");
    const userEmail = savedUser?.email;

    if (!userEmail) return;

    const fetchUpdates = async () => {
      try {
        const response = await fetch(
          `https://firestore.googleapis.com/v1/projects/smarterstarts1/databases/(default)/documents/smarterstarts_sessions`
        );
        const json = await response.json();

        const sessions = json.documents || [];
        const userSession = sessions.find((doc) =>
          doc.fields?.user?.mapValue?.fields?.email?.stringValue === userEmail
        );

        if (userSession) {
          const rec =
            userSession.fields?.recommendations?.stringValue || "⚙️ Still generating...";
          if (rec && rec !== liveRecommendations) {
            console.log("🔄 Updated recommendations found in Firestore!");
            setLiveRecommendations(rec);
          }
        }
      } catch (err) {
        console.error("⚠️ Error checking Firestore:", err);
      }
    };

    // Poll Firestore every 10 seconds
    const interval = setInterval(fetchUpdates, 10000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------
  // 🧠 Split Gemini Output into Tool Blocks
  // ------------------------------------------
  useEffect(() => {
    const textToUse = liveRecommendations || recommendations;
    if (!textToUse || textToUse.trim().length === 0) return;

    const toolRegex = /(?:^|\n)(?:\*{0,3}|#{0,3})\s*\d+\.\s*([A-Za-z0-9][^\n]*)/g;
    const blocks = textToUse
      .split(/\n(?=\d+\.\s|###\s*\d+\.)/g)
      .filter((b) => b.trim().length > 0)
      .slice(0, 5);

    setToolBlocks(blocks);

    const names = [];
    let match;
    while ((match = toolRegex.exec(textToUse)) !== null) {
      const name = match[1]
        .replace(/\*\*/g, "")
        .replace(/[-:]/g, "")
        .replace(/\*/g, "")
        .trim();
      if (name && !names.includes(name)) names.push(name);
    }

    if (names.length === 0 && blocks.length > 0) {
      blocks.forEach((b) => {
        const firstLine = b.split("\n")[0];
        names.push(firstLine.replace(/^\d+\.\s*/, "").trim());
      });
    }

    setToolNames(names.slice(0, 5));
  }, [liveRecommendations, recommendations]);

  // ------------------------------------------
  // ✅ Tool Selection
  // ------------------------------------------
  const toggleTool = (tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  // ------------------------------------------
  // ✅ Save all selections before next step
  // ------------------------------------------
  const handleNext = () => {
    if (selectedTools.length === 0) {
      alert("⚠️ Please select at least one tool before continuing.");
      return;
    }

    try {
      localStorage.setItem("smarterstartsUser", JSON.stringify(formData || {}));
      localStorage.setItem("smarterstartsProblem", formData?.problem || "");
      localStorage.setItem(
        "smarterstartsRecommendations",
        liveRecommendations || ""
      );
      localStorage.setItem(
        "smarterstartsSelectedTools",
        JSON.stringify(selectedTools || [])
      );
      console.log("💾 Saved data to localStorage successfully!");
    } catch (err) {
      console.error("⚠️ Error saving to localStorage:", err);
    }

    nextStep();
  };

  // ------------------------------------------
  // 🚧 Loading placeholder if empty
  // ------------------------------------------
  if (
    !liveRecommendations ||
    liveRecommendations.includes("Generating") ||
    liveRecommendations.includes("Processing")
  ) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div className="spinner" style={{ margin: "0 auto 20px" }} />
        <h3>✨ Generating your personalized SaaS recommendations...</h3>
        <p style={{ color: "#555", marginTop: "10px" }}>
          This will only take a few moments — we’re analyzing your inputs to find the
          best matches 💡
        </p>
      </div>
    );
  }

  // ------------------------------------------
  // 🎨 Main UI Layout
  // ------------------------------------------
  return (
    <div
      style={{
        maxWidth: "950px",
        margin: "40px auto",
        padding: "30px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2>✨ <b>Step 3 — Your Personalized Recommendations</b></h2>
      <p style={{ color: "#555" }}>
        Based on your problem, company size, and budget — here are your top SaaS matches:
      </p>

      <div
        style={{
          background: "#f0f4ff",
          borderRadius: "10px",
          padding: "15px 20px",
          marginBottom: "25px",
          lineHeight: "1.6",
          color: "#333",
          border: "1px solid #c8d9ff",
        }}
      >
        I’ve analyzed your requirements and shortlisted the top 5 SaaS tools for your
        needs — balancing usability, scalability, and affordability.
      </div>

      <h4
        style={{
          background: "#eef3ff",
          borderRadius: "8px",
          padding: "10px 15px",
          color: "#333",
          border: "1px solid #c6d3ff",
        }}
      >
        Here are the top 5 SaaS tools for you:
      </h4>

      {toolBlocks.map((block, index) => (
        <div
          key={index}
          style={{
            margin: "15px 0",
            padding: "20px",
            background: "#f8faff",
            border: "1px solid #cdd9ff",
            borderRadius: "12px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <ReactMarkdown
            children={block}
            components={{
              strong: ({ node, ...props }) => (
                <strong style={{ color: "#0b5394" }} {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li style={{ marginBottom: "6px" }} {...props} />
              ),
              p: ({ node, ...props }) => (
                <p style={{ marginBottom: "8px" }} {...props} />
              ),
            }}
          />
        </div>
      ))}

      {/* ✅ Tool Multi-Select */}
      <div
        style={{
          background: "#f8faff",
          borderRadius: "10px",
          border: "1px solid #c8d9ff",
          padding: "20px",
          marginTop: "40px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>
          ✅ Which of these tools would you like to explore further?
        </h3>
        <p style={{ color: "#555", marginBottom: "15px" }}>
          (Select one or more tools you’re most interested in)
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {toolNames.map((tool, i) => (
            <div
              key={i}
              onClick={() => toggleTool(tool)}
              style={{
                textAlign: "center",
                padding: "12px 15px",
                borderRadius: "10px",
                background: selectedTools.includes(tool) ? "#e3ebff" : "#fff",
                border: selectedTools.includes(tool)
                  ? "2px solid #4476ff"
                  : "1px solid #cdd9ff",
                color: selectedTools.includes(tool) ? "#1e40af" : "#333",
                cursor: "pointer",
                fontWeight: 500,
                transition: "0.2s",
                boxShadow: selectedTools.includes(tool)
                  ? "0 0 6px rgba(68,118,255,0.4)"
                  : "none",
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <button
          onClick={prevStep}
          style={{
            background: "#f0f0f0",
            color: "#333",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={selectedTools.length === 0}
          style={{
            background: selectedTools.length === 0 ? "#ccc" : "#4476ff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor:
              selectedTools.length === 0 ? "not-allowed" : "pointer",
            opacity: selectedTools.length === 0 ? 0.7 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default RecommendationsStep;