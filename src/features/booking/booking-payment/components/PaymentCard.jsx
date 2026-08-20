import React from "react";
import RazorpayImg from "../../../../assets/images/razorpay.svg";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { IoMdAlarm } from "react-icons/io";

import Image from "next/image";

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const PaymentCard = ({
  paymentSuccess,
  totalAmount,
  processing,
  razorpayLoaded,
  handlePayNow,
  remainingMs, // ms left, ticked down by the parent (device-clock-proof)
  isExpired, // single source of truth, owned by the parent
}) => {
  return (
    <div className="ridepay-payment">
      {!paymentSuccess ? (
        <>
          <h2 className="ridepay-payment-title">Complete Payment</h2>

          {/* Countdown Alert */}
          <div className="ridepay-payment-alert">
            <div className="ridepay-payment-alert-top">
              {/* <span className="ridepay-payment-icon">
                <IoMdAlarm />
              </span> */}

              <div>
                {/* <h4>
                  {isExpired
                    ? "Your payment time has expired"
                    : `Complete your payment within ${formatTime(remainingMs)}`}
                </h4> */}
                <p>
                  Your seats are temporarily reserved. Complete payment within{" "}
                  <strong>5 minutes</strong>, or your reservation will be
                  cancelled automatically.
                </p>
              </div>
            </div>
          </div>

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

          {/* <div className="ridepay-amount-display">
            <span className="ridepay-amount-label">You Pay</span>
            <span className="ridepay-amount-value">₹{totalAmount}</span>
          </div> */}

          <button
            className="ridepay-btn-primary"
            onClick={handlePayNow}
            disabled={processing || !razorpayLoaded || isExpired}
          >
            {isExpired
              ? "Payment Time Expired"
              : processing
                ? "Opening Payment..."
                : `Pay ₹${totalAmount}`}
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
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
