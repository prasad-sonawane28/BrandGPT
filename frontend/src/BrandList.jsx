function BrandList({ brands, activeId, onSelect, onEdit, onDelete }) {
  return (
    <section className="card">
      <h2>Your brands</h2>

      {brands.length === 0 ? (
        <p className="empty">
          No brands yet. Add your first brand and BrandGPT will write in its voice.
        </p>
      ) : (
        brands.map((brand) => (
          <article
            key={brand.id}
            className={`brand ${String(brand.id) === String(activeId) ? "active" : ""}`}
            tabIndex={0}
            onClick={() => onSelect(brand.id)}
            onKeyDown={(e) => {
              if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(brand.id);
              }
            }}
          >
            <h3>{brand.name}</h3>
            {brand.industry && <span className="chip">{brand.industry}</span>}
            {brand.description && <p>{brand.description}</p>}
            {brand.target_audience && <p>Audience: {brand.target_audience}</p>}
            {brand.brand_voice && <p>Voice: {brand.brand_voice}</p>}
            {brand.products && <p>Products: {brand.products}</p>}

            <div className="actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={(e) => { e.stopPropagation(); onEdit(brand); }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-danger"
                onClick={(e) => { e.stopPropagation(); onDelete(brand); }}
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

export default BrandList;