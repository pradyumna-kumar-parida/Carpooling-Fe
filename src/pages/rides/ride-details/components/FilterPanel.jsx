// src/pages/Rides/find-ride/components/FilterPanel.jsx

import varifiedBedge from "../../../../assets/Images/verifiedBedge.png";
import FilterSection  from "./FilterSection";
import {
  SORT_OPTIONS,
  DEPART_SLOTS,
  AMENITIES,
  SLOT_MAP,
} from "../constants/filterOptions";

export default function FilterPanel({
  sortBy,
  setSortBy,
  departSlot,
  setDepartSlot,
  verifiedOnly,
  setVerifiedOnly,
  amenityChecks,
  setAmenityChecks,
  mobile = false,
}) {
  return (
    <>
      {/* ── Sort ── */}
      <FilterSection title="Sort by">
        {SORT_OPTIONS.map((s) => (
          <label key={s.id} className="ridetail-radio-row">
            <span className="ridetail-radio-left">
              <input
                type="radio"
                className="ridetail-radio"
                name={mobile ? "sort-m" : "sort"}
                checked={sortBy === s.id}
                onChange={() => setSortBy(s.id)}
              />
              <span className="ridetail-radio-label">{s.label}</span>
            </span>
          </label>
        ))}
      </FilterSection>

      {/* ── Departure time ── */}
      <FilterSection title="Departure time">
        {DEPART_SLOTS.map((d) => (
          <div key={d.id} className="ridetail-check-row">
            <label className="ridetail-check-left">
              <input
                type="radio"
                className="ridetail-radio"
                name={mobile ? "depart-slot-m" : "depart-slot"}
                checked={departSlot === SLOT_MAP[d.id]}
                onChange={() => setDepartSlot(SLOT_MAP[d.id])}
              />
              <span className="ridetail-check-label">{d.label}</span>
            </label>
          </div>
        ))}
      </FilterSection>

      {/* ── Trust & Safety ── */}
      <FilterSection title="Trust & Safety">
        <div className="ridetail-check-row">
          <label className="ridetail-check-left">
            <input
              type="checkbox"
              className="ridetail-checkbox"
              checked={verifiedOnly}
              onChange={setVerifiedOnly}
            />
            <span className="ridetail-check-label">Verified Profile</span>
          </label>

          {!mobile && (
            <div className="ridetail-check-right">
              <span className="ridetail-verified-badge">
                <img src={varifiedBedge} alt="verified" loading="lazy" />
              </span>
            </div>
          )}
        </div>
      </FilterSection>

      {/* ── Amenities ── */}
      <FilterSection title="Amenities">
        {AMENITIES.map((a) => (
          <div key={a.id} className="ridetail-check-row">
            <label className="ridetail-check-left">
              <input
                type="checkbox"
                className="ridetail-checkbox"
                checked={!!amenityChecks[a.id]}
                onChange={() =>
                  setAmenityChecks((p) => ({ ...p, [a.id]: !p[a.id] }))
                }
              />
              <span className="ridetail-check-label">{a.label}</span>
            </label>
          </div>
        ))}
      </FilterSection>
    </>
  );
}