import { useState, useEffect } from "react";

function GeneratePanel({ brands }) {
  const [brandId, setBrandId] = useState("");
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [isMock, setIsMock] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedKey, setCopiedKey] = useState("");

  // Which brand is selected? Fall back to the first one if the chosen one was deleted.
  const selectedId = brands.some((b) => String(b.id) === String(brandId))
    ? brandId
    : brands[0]?.id;

  // Load the history whenever the selected brand changes,
  // or when refreshKey changes (we bump it after each new generation).
  useEffect(() => {
    if (!selectedId) return;

    fetch(`http://localhost:5000/api/brands/${selectedId}/generations`)
      .then((response) => response.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Could not load history:", err));
  }, [selectedId, refreshKey]);

  // Hooks must all run before this early return (see the notes below)
  if (brands.length === 0) {
    return null; // nothing to generate for yet
  }

  const selectedBrand = brands.find((b) => String(b.id) === String(selectedId));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/brands/${selectedId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.content);
      setIsMock(Boolean(data.mock));
      setStatus("success");
      setRefreshKey((k) => k + 1); // triggers the history effect to reload
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <form onSubmit={handleGenerate} style={{ textAlign: "left", maxWidth: "480px" }}>
        <h2>Generate content</h2>

        <label>
          Brand
          <select value={selectedId} onChange={(e) => setBrandId(e.target.value)}>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          What should it write?
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={3}
            placeholder="e.g. Write an Instagram caption for our new trail running shoe"
            required
          />
        </label>

        <button type="submit" disabled={status === "loading" || !task.trim()}>
          {status === "loading" ? "Generating..." : "Generate"}
        </button>

        {status === "error" && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div style={{ marginTop: "1rem" }}>
            {isMock && (
              <p style={{ color: "orange", margin: "0 0 0.5rem" }}>
                Mock mode: no API key set, so this is placeholder text.
              </p>
            )}
            <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
            <button
              type="button"
              onClick={() => handleCopy(result, "result")}
              style={{ marginTop: "0.5rem" }}
            >
              {copiedKey === "result" ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </form>

      {history.length > 0 && (
        <div style={{ marginTop: "2rem", textAlign: "left" }}>
          <h3>History for {selectedBrand?.name}</h3>

          {history.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: "0 0 0.25rem" }}>
                <strong>{item.task}</strong>
              </p>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", opacity: 0.7 }}>
                {new Date(item.created_at).toLocaleString()}
              </p>
              <div style={{ whiteSpace: "pre-wrap" }}>{item.content}</div>
              <button
                type="button"
                onClick={() => handleCopy(item.content, item.id)}
                style={{ marginTop: "0.5rem" }}
              >
                {copiedKey === item.id ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GeneratePanel;