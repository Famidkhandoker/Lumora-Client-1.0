import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiXCircle, FiArrowLeft, FiCreditCard, FiHelpCircle, FiShield } from "react-icons/fi";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiXCircle size={48} className="text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Payment{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Cancelled
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Your payment was cancelled. No charges were made to your account.
          </motion.p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8 text-left"
          >
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              What happened?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You cancelled the payment process</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your booking is still saved and waiting for payment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No money was charged to your card</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/dashboard/my-bookings")}
              className="btn btn-lg bg-gradient-to-r from-[#e8a803] to-[#f59e0b] text-white border-none hover:scale-105 transition-transform"
            >
              <FiCreditCard />
              Try Payment Again
            </button>
            <button
              onClick={() => navigate("/services")}
              className="btn btn-lg btn-outline"
            >
              <FiArrowLeft />
              Browse More Services
            </button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-amber-50 rounded-xl text-left"
          >
            <div className="flex items-start gap-2 mb-2">
              <FiHelpCircle size={16} className="text-[#e8a803] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-semibold">Need help?</p>
            </div>
            <p className="text-sm text-gray-600 pl-6">
              If you&apos;re having issues with payment, please contact our support
              team at{" "}
              <a
                href="mailto:support@lumora.com"
                className="text-[#e8a803] font-semibold hover:underline"
              >
                support@lumora.com
              </a>
            </p>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500"
          >
            <FiShield size={13} className="text-gray-400" />
            <span>All payments are secured by Stripe. Your information is encrypted and safe.</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
