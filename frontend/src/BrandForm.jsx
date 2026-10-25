import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/brands";

const emptyForm = {
  name: "",
  industry: "",
  description: "",
  target_audience: "",
  brand_voice: "",
  products: "",
};

function BrandForm({ onSaved, editingBrand, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const isEditing = Boolean(editingBrand);

  // When the user clicks Edit on a brand, copy its values into the form.
  // When editing ends, go back to an empty form.
  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name || "",
        industry: editingBrand.industry || "",
        description: editingBrand.description || "",
        target_audience: editingBrand.target_audience || "",
        brand_voice: editingBrand.brand_voice || "",
        products: editingBrand.products || "",
      });
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

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(
        `Brand "${formData.name}" ${isEditing ? "updated" : "created"}!`
      );
      setFormData(emptyForm);
      if (isEditing && onCancelEdit) onCancelEdit();
      if (onSaved) onSaved();
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ textAlign: "left", maxWidth: "480px" }}
    >
      <h2>{isEditing ? `Edit ${editingBrand.name}` : "Set up your brand"}</h2>

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
        {status === "loading"
          ? "Saving..."
          : isEditing
          ? "Save changes"
          : "Create brand"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "0.5rem" }}
        >
          Cancel
        </button>
      )}

      {message && <p className={status}>{message}</p>}
    </form>
  );
}

export default BrandForm;