import { useState, useEffect } from "react";

const QUICK = [
  { label: "Instagram caption", text: "Write an Instagram caption for our latest product." },
  { label: "Launch email", text: "Write a short email announcing our new product launch." },
  { label: "Ad headlines", text: "Write 5 Google ad headlines for our best seller." },
];

function GeneratePanel({ brands, activeId, onSelect }) {
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [isMock, setIsMock] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedKey, setCopiedKey] = useState("");

  const selectedId = activeId;

  useEffect(() => {
    if (!selectedId) return;

    fetch(`http://localhost:5000/api/brands/${selectedId}/generations`)
      .then((response) => response.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Could not load history:", err));
  }, [selectedId, refreshKey]);

  // Hooks must all run before this early return
  if (brands.length === 0) {
    return (
      <section className="card">
        <h2>Generate content</h2>
        <p className="empty">Add a brand to start generating.</p>
      </section>
    );
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
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setResult(data.content);
      setIsMock(Boolean(data.mock));
      setStatus("success");
      setRefreshKey((k) => k + 1);
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
    <>
      <form className="card" onSubmit={handleGenerate}>
        <h2>Write for {selectedBrand?.name}</h2>

        <label className="field">
          <span>Brand</span>
          <select value={selectedId} onChange={(e) => onSelect(Number(e.target.value))}>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>What should it write?</span>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={3}
            placeholder="Describe the content you need, or pick a starter below"
            required
          />
        </label>

        <div className="quick">
          {QUICK.map((q) => (
            <button key={q.label} type="button" onClick={() => setTask(q.text)}>
              {q.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "loading" || !task.trim()}
        >
          {status === "loading" ? "Generating..." : "Generate"}
        </button>

        {status === "error" && <p className="msg-error">{error}</p>}

        {result && (
          <div style={{ marginTop: "16px" }}>
            {isMock && (
              <p className="notice">
                Mock mode: no API key is set, so this is placeholder text.
              </p>
            )}
            <div className="output">{result}</div>
            <div className="actions" style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => handleCopy(result, "result")}
              >
                {copiedKey === "result" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </form>

      {history.length > 0 && (
        <section className="card">
          <h2>History for {selectedBrand?.name}</h2>

          {history.map((item) => (
            <article key={item.id} className="history-item">
              <p className="task">{item.task}</p>
              <p className="meta">{new Date(item.created_at).toLocaleString()}</p>
              <div className="output">{item.content}</div>
              <div className="actions" style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleCopy(item.content, item.id)}
                >
                  {copiedKey === item.id ? "Copied" : "Copy"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default GeneratePanel;