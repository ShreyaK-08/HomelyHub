import React, { useEffect, useState } from "react";
import "../../css/Payment.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  initiateCheckoutSession,
  verifyPayment,
} from "../../store/Payment/payment-action";
import {
  selectPaymentDetails,
  selectPaymentStatus,
  paymentActions,
} from "../../store/Payment/payment-slice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useParams();
  const [showPaymentGateaway, setShowPaymentGateaway] = useState(false);

  const reduxPaymentDetails = useSelector(selectPaymentDetails);

  const savedBooking = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(`booking_${propertyId}`) || "null");
    } catch {
      return null;
    }
  })();

  const paymentDetails =
    (location.state && location.state.checkinDate ? location.state : null) ||
    (reduxPaymentDetails && reduxPaymentDetails.checkinDate ? reduxPaymentDetails : null) ||
    savedBooking ||
    {};

  const {
    checkinDate,
    checkoutDate,
    totalPrice = 0,
    propertyName = "HomelyHub Stay",
    guests = 1,
    nights = 1,
  } = paymentDetails;

  const { loading, error, orderData } = useSelector(selectPaymentStatus);

  const handleBooking = async () => {
    if (!checkinDate || !checkoutDate || !totalPrice) {
      toast.error("Missing booking information. Please re-select dates.");
      return;
    }

    const paymentData = {
      amount: totalPrice,
      propertyId,
      fromDate: checkinDate,
      toDate: checkoutDate,
      guests,
    };

    try {
      await dispatch(initiateCheckoutSession(paymentData));
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await dispatch(
        verifyPayment({
          orderId: orderData?.orderId || `order_${Date.now()}`,
          bookingDetails: {
            propertyId,
            fromDate: checkinDate,
            toDate: checkoutDate,
            guests,
            price: totalPrice,
            nights,
          },
          forceStatus: "success",
        })
      );

      toast.success("🎉 Payment Successful! Booking Confirmed!");
      try {
        sessionStorage.removeItem(`booking_${propertyId}`);
      } catch (e) {
        console.warn(e);
      }
      setTimeout(() => navigate("/user/mybookings"), 1000);
      dispatch(paymentActions.resetPayment());
    } catch {
      toast.error("Payment failed!");
    }
  };

  const handleCancelPayment = () => {
    dispatch(paymentActions.resetPayment());
    setShowPaymentGateaway(false);
    toast.error("Payment Cancelled");
    navigate(`/propertylist/${propertyId}`);
  };

  useEffect(() => {
    if (orderData && !showPaymentGateaway) {
      setShowPaymentGateaway(true);
    }
  }, [orderData, showPaymentGateaway]);
  if (showPaymentGateaway && orderData) {
    return (
      <div className="payment-gateway-overlay">
        <div className="payment-gateway-modal">

          <div className="gateway-header">
            <div className="gateway-logo">
              <h2>🏠 HomelyHub</h2>
              <span>Payment Gateway</span>
            </div>
            <div className="secure-badge">
              <span>🔒 Secure Payment</span>
            </div>
          </div>

          <div className="gateway-content">
            <div className="merchant-info">
              <h3>
                Payment to: <strong>HomelyHub</strong>
              </h3>
              <p>
                Order ID: <strong>{orderData.orderId}</strong>
              </p>
            </div>

            <div className="payment-summary">
              <div className="summary-item">
                <span>Property:</span>
                <span>{propertyName}</span>
              </div>
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{checkinDate}</span>
              </div>
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{checkoutDate}</span>
              </div>
              <div className="summary-item">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="summary-item">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              <div className="summary-item total-amount">
                <span>
                  <strong>Total Amount:</strong>
                </span>
                <span>
                  <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                </span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="gateway-actions">
              <button
                onClick={handleCancelPayment}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel Payment
              </button>
              <button
                onClick={handleConfirmPayment}
                className="confirm-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    Confirm Payment ₹{totalPrice.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </div>

            <div className="security-info">
              <p>
                <span>🛡️</span>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Booking</h1>
        <p>{propertyName}</p>
      </div>

      <div className="payment-content">

        <div className="booking-summary-card">
          <h3>Booking Details</h3>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>{checkinDate}</span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>{checkoutDate}</span>
          </div>
          <div className="detail-row">
            <span>Guests:</span>
            <span>{guests}</span>
          </div>
          <div className="detail-row">
            <span>Nights:</span>
            <span>{nights}</span>
          </div>
          <div className="detail-row total-row">
            <strong>Total Amount:</strong>
            <strong>₹{totalPrice}</strong>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-action">
          <button
            onClick={handleBooking}
            disabled={loading}
            className="book-now-btn"
          >
            {loading ? "Processing..." : `Proceed to Payment ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
