"use client";

import { useEffect } from "react";
import FilterPanel from "./FilterPanel";

export default function MobileFilterDrawer({
  open,
  setOpen,
  clearAll,
  ...filterProps
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`ridetail-overlay${open ? " open" : ""}`}
        style={{ zIndex: 100 }}
        onClick={() => setOpen(false)}
      />

      <div
        className={`ridetail-mobile-sidebar${open ? " open" : ""}`}
      >
        <div className="ridetail-mobile-sidebar-head">
          <span className="ridetail-sidebar-title">
            Filters &amp; Sort
          </span>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="ridetail-clear-btn"
              onClick={() => {
                clearAll();
                setOpen(false);
              }}
            >
              Clear all
            </button>

            <button
              type="button"
              className="ridetail-mobile-close"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>

        <FilterPanel mobile {...filterProps} />
      </div>
    </>
  );
}