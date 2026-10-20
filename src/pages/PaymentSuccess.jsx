import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FiCheckCircle, FiArrowRight, FiMail } from "react-icons/fi";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    verifyPayment();
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    if (!sessionId || !bookingId) {
      navigate("/dashboard/my-bookings");
      return;
    }

    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify-payment`,
        { sessionId, bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setPaymentDetails(data.payment);
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle size={48} className="text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Payment{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Successful!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Thank you for your payment. Your booking has been confirmed!
          </motion.p>

          {/* Payment Details */}
          {paymentDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 text-left"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">
                    {paymentDetails.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600 text-xl">
                    ৳{paymentDetails.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {paymentDetails.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>
                    {new Date(paymentDetails.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/dashboard/my-bookings")}
              className="btn btn-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none hover:scale-105 transition-transform"
            >
              View My Bookings
              <FiArrowRight />
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-lg btn-outline"
            >
              Back to Home
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-amber-50 rounded-xl"
          >
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FiMail size={15} className="text-[#e8a803] flex-shrink-0 mt-0.5" />
              <div>
                <p>
                  A confirmation email has been sent to{" "}
                  <strong>{paymentDetails?.userEmail}</strong>
                </p>
                <p className="mt-1">
                  Our team will contact you shortly to confirm the decoration details.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
