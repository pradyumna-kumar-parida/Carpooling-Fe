import React from "react";
import RazorpayImg from "../../../../assets/images/razorpay.svg";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import ArcLoader from "../../../../components/Loader";
import Image from "next/image";

const PaymentCard = ({
  paymentSuccess,
  totalAmount,
  processing,
  razorpayLoaded,
  handlePayNow,
}) => {
  return (
    <div className="ridepay-payment">
      {!paymentSuccess ? (
        <>
          <h2 className="ridepay-payment-title">Complete Payment</h2>

          <div className="ridepay-razorpay-info">
            <div className="ridepay-razorpay-logo">
              <Image
                src={RazorpayImg}
                alt="Razorpay"
                width={150}
                height={50}
                style={{
                  width: "30%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <p className="ridepay-razorpay-desc">
              Pay securely using UPI, Cards, Net Banking, or Wallets.
            </p>
          </div>

          <div className="ridepay-amount-display">
            <span className="ridepay-amount-label">You Pay</span>
            <span className="ridepay-amount-value">₹{totalAmount}</span>
          </div>

          <button
            className="ridepay-btn-primary"
            onClick={handlePayNow}
            disabled={processing || !razorpayLoaded}
          >
            {processing ? "Opening Payment..." : `Pay ₹${totalAmount}`}
          </button>

          <p className="ridepay-secure-note">
            <FaLock /> 256-bit SSL encrypted | Secured by Razorpay
          </p>
        </>
      ) : (
        <div className="ridepay-success">
          <div className="ridepay-success-icon">
            <FaCheckCircle />
          </div>
          <h2 className="ridepay-success-title">Payment Successful!</h2>
          <p className="ridepay-success-text">
            Your booking is confirmed. Redirecting…
          </p>
          <div className="ridepay-success-amount">₹{totalAmount} Paid</div>
          <ArcLoader />
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
