import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/brands";

const FIELDS = [
  { name: "name", label: "Brand name", required: true, max: 100, full: true },
  { name: "industry", label: "Industry", max: 100 },
  { name: "target_audience", label: "Target audience", max: 200 },
  { name: "brand_voice", label: "Brand voice", max: 200, full: true, placeholder: "e.g. friendly, witty, professional" },
  { name: "description", label: "Description", multiline: true, full: true },
  { name: "products", label: "Products / services", multiline: true, full: true },
];

const emptyForm = Object.fromEntries(FIELDS.map((f) => [f.name, ""]));

function BrandForm({ onSaved, editingBrand, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const isEditing = Boolean(editingBrand);

  // Copy the brand into the form when editing starts; clear it when editing ends
  useEffect(() => {
    if (editingBrand) {
      setFormData(
        Object.fromEntries(FIELDS.map((f) => [f.name, editingBrand[f.name] || ""]))
      );
    } else {
      setFormData(emptyForm);
    }
  }, [editingBrand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const url = isEditing ? `${API_URL}/${editingBrand.id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setMessage(`Saved "${formData.name}".`);
      setFormData(emptyForm);
      if (isEditing && onCancelEdit) onCancelEdit();
      if (onSaved) onSaved();
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{isEditing ? `Edit ${editingBrand.name}` : "Add a brand"}</h2>

      <div className="form-grid">
        {FIELDS.map((f) => (
          <label key={f.name} className={`field ${f.full ? "full" : ""}`}>
            <span>{f.label}{f.required && " *"}</span>
            {f.multiline ? (
              <textarea
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                rows={2}
              />
            ) : (
              <input
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                maxLength={f.max}
                required={f.required}
                placeholder={f.placeholder}
              />
            )}
          </label>
        ))}
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Saving..." : isEditing ? "Save changes" : "Save brand"}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {message && <p className={`msg-${status}`}>{message}</p>}
    </form>
  );
}

export default BrandForm;