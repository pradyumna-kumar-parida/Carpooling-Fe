import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import {
  formatTime,
  formatDate,
  secondsToHM,
} from "../utils/bookingHelpers";

export default function TripTimeline({ ride }) {
  return (
    <div className="ride-confirm-card ride-timeline-card">
      <h3 className="summary-date">
        {formatDate(ride?.ride_date)}
      </h3>

      <div className="timeline-route">
        {/* Origin */}
        <div className="timeline-stop">
          <div className="timeline-marker">
            <IoLocationOutline />
            <div className="timeline-line" />
          </div>

          <div className="timeline-content">
            <div className="timeline-time">
              {formatTime(ride?.departure_time)}
            </div>

            <div className="timeline-duration">
              {secondsToHM(ride?.duration_seconds)}
            </div>

            <div className="timeline-location">
              <h3 className="location-city">
                {ride?.source_address?.split(",")[0]}
              </h3>

              <p className="location-address">
                {ride?.source_address}
              </p>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="timeline-stop">
          <div className="timeline-marker">
            <FaLocationDot />
          </div>

          <div className="timeline-content">
            <div className="timeline-time">
              {formatTime(
                ride?.estimated_reach_time
              )}
            </div>

            <div className="timeline-location">
              <h3 className="location-city">
                {ride?.destination_address?.split(",")[0]}
              </h3>

              <p className="location-address">
                {ride?.destination_address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}