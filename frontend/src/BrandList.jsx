function BrandList({ brands }) {
  if (brands.length === 0) {
    return <p>No brands yet. Create your first one above.</p>;
  }

  return (
    <div>
      <h2>Your brands</h2>

      {brands.map((brand) => (
        <div
          key={brand.id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem" }}>{brand.name}</h3>
          {brand.industry && <p><strong>Industry:</strong> {brand.industry}</p>}
          {brand.description && <p>{brand.description}</p>}
          {brand.target_audience && (
            <p><strong>Audience:</strong> {brand.target_audience}</p>
          )}
          {brand.brand_voice && (
            <p><strong>Voice:</strong> {brand.brand_voice}</p>
          )}
          {brand.products && <p><strong>Products:</strong> {brand.products}</p>}
        </div>
      ))}
    </div>
  );
}

export default BrandList;