import driverApprovalImage from "../../assets/images/driver-approval.png";
import Image from "next/image";
import "../../styles/find-ride.css";
export default function DriverApproval() {
  return (
    <div className="approval-ride">
      <Image
        src={driverApprovalImage}
        alt="approval image"
        className="approval-image"
      />
    </div>
  );
}
