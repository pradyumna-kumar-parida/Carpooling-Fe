"use client";
// components/search/PassengerField.jsx

import { useState } from "react";
import { FiUser, FiMinus, FiPlus } from "react-icons/fi";
import { useClickOutside } from "../hooks/Useclickoutside";

export default function PassengerField({ count, setCount }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div
      className="fr-field fr-field-passenger"
      ref={ref}
      onClick={() => setOpen((o) => !o)}
    >
      <span className="fr-field-icon">
        <FiUser />
      </span>
      <span className="fr-field-value">
        {count} {count === 1 ? "passenger" : "passengers"}
      </span>
      {open && (
        <div className="fr-pax-popup" onClick={(e) => e.stopPropagation()}>
          <div className="fr-pax-row">
            <span className="fr-pax-label">Passengers</span>
            <div className="fr-pax-counter">
              <button
                className="fr-pax-btn"
                onClick={() => setCount((n) => Math.max(1, n - 1))}
                disabled={count <= 1}
              >
                <FiMinus />
              </button>
              <span className="fr-pax-count">{count}</span>
              <button
                className="fr-pax-btn"
                onClick={() => setCount((n) => Math.min(8, n + 1))}
                disabled={count >= 8}
              >
                <FiPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}