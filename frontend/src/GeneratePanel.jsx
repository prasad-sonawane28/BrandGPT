import { useState } from "react";

function GeneratePanel({ brands }) {
  const [brandId, setBrandId] = useState("");
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  if (brands.length === 0) {
    return null; // nothing to generate for yet
  }

  // If the user hasn't picked a brand, default to the first one
  const selectedId = brandId || brands[0].id;

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
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleGenerate} style={{ marginTop: "2rem" }}>
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
        <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{result}</div>
      )}
    </form>
  );
}

export default GeneratePanel;