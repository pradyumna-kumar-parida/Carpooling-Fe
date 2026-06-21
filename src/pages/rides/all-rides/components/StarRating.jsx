import { FaStar } from "react-icons/fa";

export default function StarRating({ rating }) {
  return (
    <span className="ridetail-star-wrap">
      <FaStar />
      <span className="ridetail-star-val">
        {Number(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}