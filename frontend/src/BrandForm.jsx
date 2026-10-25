import { useState } from "react";

const API_URL = "http://localhost:5000/api/brands";

const emptyForm = {
  name: "",
  industry: "",
  description: "",
  target_audience: "",
  brand_voice: "",
  products: "",
};

function BrandForm({ onCreated }) {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(`Brand "${formData.name}" created!`);
      setFormData(emptyForm);
            setFormData(emptyForm);
      if (onCreated) onCreated();
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
<form onSubmit={handleSubmit} style={{ textAlign: "left", maxWidth: "480px" }}>
      <h2>Set up your brand</h2>

      <label>
        Brand name *
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>

      <label>
        Industry
        <input
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          maxLength={100}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <label>
        Target audience
        <input
          name="target_audience"
          value={formData.target_audience}
          onChange={handleChange}
          maxLength={200}
        />
      </label>

      <label>
        Brand voice
        <input
          name="brand_voice"
          value={formData.brand_voice}
          onChange={handleChange}
          maxLength={200}
          placeholder="e.g. friendly, witty, professional"
        />
      </label>

      <label>
        Products / services
        <textarea
          name="products"
          value={formData.products}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving..." : "Create brand"}
      </button>

      {message && <p className={status}>{message}</p>}
    </form>
  );
}

export default BrandForm;