// src/pages/Rides/find-ride/components/FilterSection.jsx

import { useState } from "react";

export default function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ridetail-filter-section">
      <button
        className="ridetail-filter-title"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ overflow: "hidden" }}>
          <div className="ridetail-filter-body">{children}</div>
        </div>
      )}
    </div>
  );
}