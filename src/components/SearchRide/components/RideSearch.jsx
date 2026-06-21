"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FRSearchBar from "../../SearchRide";
import { findRidesApi } from "../../../services/rideService";

export default function AllRidesPage() {
  const searchParams = useSearchParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const passengers = searchParams.get("passengers");

    if (!from || !to || !date) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    findRidesApi({ from, to, date, passengers })
      .then((res) => {
        if (cancelled) return;
        setRides(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch rides:", err);
        setErrorMsg("Something went wrong while fetching rides.");
        setRides([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });


    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main>
      <FRSearchBar />

      {loading && <p className="fr-status">Loading rides...</p>}
      {!loading && errorMsg && <p className="fr-status fr-status-error">{errorMsg}</p>}
      {!loading && !errorMsg && rides.length === 0 && (
        <p className="fr-status">No rides found for this search.</p>
      )}

      {!loading && rides.length > 0 && (
        <ul className="ride-results">
          {rides.map((ride) => (
            <li key={ride.id} className="ride-card">
              {/* render ride details here */}
              {ride.source_address} → {ride.destination_address}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}



