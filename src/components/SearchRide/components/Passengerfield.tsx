"use client";
// components/search/PassengerField.jsx

import { useState, type Dispatch, type SetStateAction } from "react";
import { FiUser, FiMinus, FiPlus } from "react-icons/fi";
import { useClickOutside } from "../hooks/Useclickoutside";

type PassengerFieldProps = {
  count: number;
  setCountAction: Dispatch<SetStateAction<number>>;
};

export default function PassengerField({ count, setCountAction }: PassengerFieldProps) {
  const [open, setOpen] = useState<boolean>(false);
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
                onClick={() => setCountAction((n) => Math.max(1, n - 1))}
                disabled={count <= 1}
              >
                <FiMinus />
              </button>
              <span className="fr-pax-count">{count}</span>
              <button
                className="fr-pax-btn"
                onClick={() => setCountAction((n) => Math.min(8, n + 1))}
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