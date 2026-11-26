// src/pages/dashboard/user/MyBookings.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FiTrash2, FiCreditCard, FiCalendar, FiMapPin, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setFetchError(null);
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${encodeURIComponent(
          user.email.toLowerCase()
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];
      setBookings(list);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      const msg = error.response?.data?.message || "Failed to fetch bookings";
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.email, authLoading, fetchBookings]);

  const handlePayment = (booking, type = "advance") => {
    navigate(`/checkout/${booking._id}?type=${type}`, {
      state: { booking, paymentType: type },
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("lumora-token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // 50/50 Payment details and stage calculation
  const getBookingPaymentState = (booking) => {
    const total = Number(booking.serviceCost || booking.totalAmount || 0);
    const advance =
      booking.advance_amount != null
        ? Number(booking.advance_amount)
        : Math.round(total * 0.5);
    const remaining =
      booking.remaining_amount != null
        ? Number(booking.remaining_amount)
        : total - advance;

    let stage = booking.payment_stage;
    let isAdvancePaid = Boolean(booking.advance_paid);
    let isFinalPaid = Boolean(booking.final_paid);
    let isCompleted = Boolean(
      booking.service_completed || booking.status === "completed"
    );

    if (isFinalPaid || booking.isPaid || stage === "fully_paid") {
      stage = "fully_paid";
    } else if (isAdvancePaid || stage === "advance_paid" || stage === "final_due") {
      // Flexible 50/50: Remaining payment is unlocked and payable at any time!
      stage = "final_due";
    } else {
      stage = "unpaid";
    }

    return {
      total,
      advance,
      remaining,
      stage, // 'unpaid' | 'final_due' | 'fully_paid'
      isAdvancePaid,
      isFinalPaid,
      isCompleted,
    };
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          My{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            Bookings
          </span>
        </h1>
        <p className="text-gray-600">
          View and manage your decoration bookings
        </p>
      </motion.div>

      {/* Error state with retry */}
      {fetchError && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-500" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={fetchBookings}
            className="btn btn-xs bg-red-600 hover:bg-red-700 text-white border-none"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-[var(--lum-accent)]"></span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
            <FiCalendar size={28} className="text-base-content/30" />
          </div>
          <p className="text-2xl text-gray-600 mb-4">No bookings yet</p>
          <a
            href="/services"
            className="btn bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none"
          >
            Browse Services
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking, index) => {
            const {
              total,
              advance,
              remaining,
              stage,
              isCompleted,
            } = getBookingPaymentState(booking);

            const decoratorDisplayName =
              booking.decoratorName || booking.decorator?.displayName;

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-base-100 rounded-2xl shadow-xl p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {booking.serviceName || "Decoration Service"}
                        </h3>

                        {/* Payment Stage Badges */}
                        {stage === "unpaid" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f59e0b] text-white">
                            Payment Pending
                          </span>
                        )}
                        {stage === "final_due" && !isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#5b9bd5] text-white">
                            Advance Paid · Work in progress
                          </span>
                        )}
                        {stage === "final_due" && isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f59e0b] text-white">
                            Final Payment Due · Service completed
                          </span>
                        )}
                        {stage === "fully_paid" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#d1fae5] text-[#065f46]">
                            Fully Paid
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-[var(--lum-accent)]">
                          ৳{total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          per {booking.serviceUnit || "event"}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FiCalendar />
                        <span>
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString()
                            : "Date not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FiMapPin />
                        <span>{booking.location || "Dhaka, Bangladesh"}</span>
                      </div>
                    </div>

                    {decoratorDisplayName ? (
                      <p className="text-sm text-gray-600">
                        Decorator: <strong>{decoratorDisplayName}</strong>
                      </p>
                    ) : booking.noDecoratorAvailable ? (
                      <p className="text-sm text-amber-600 font-medium">
                        Decorator: <em>No decorator available for this service</em>
                      </p>
                    ) : null}

                    {booking.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        Notes: {booking.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 items-start lg:items-end justify-start">
                    {/* Stage 1: Unpaid -> Pay 50% Advance & Cancel */}
                    {stage === "unpaid" && (
                      <>
                        <button
                          onClick={() => handlePayment(booking, "advance")}
                          disabled={paymentLoading === booking._id}
                          className="btn btn-sm bg-[#5b9bd5] hover:bg-[#4a89c4] text-white border-none shadow-sm flex items-center gap-1.5"
                        >
                          <FiCreditCard /> Pay 50% Advance · ৳{advance.toLocaleString()}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={paymentLoading === booking._id}
                          className="btn btn-sm btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
                        >
                          <FiTrash2 /> Cancel
                        </button>
                      </>
                    )}

                    {/* Stage 2 / Remaining Payment: Enabled at any time! */}
                    {stage === "final_due" && (
                      <button
                        onClick={() => handlePayment(booking, "final")}
                        disabled={paymentLoading === booking._id}
                        className="btn btn-sm bg-[#5b9bd5] hover:bg-[#4a89c4] text-white border-none shadow-sm flex items-center gap-1.5"
                      >
                        <FiCreditCard /> Pay Remaining 50% · ৳{remaining.toLocaleString()}
                      </button>
                    )}

                    {/* Stage 3: Fully Paid */}
                    {stage === "fully_paid" && (
                      <div className="btn btn-sm bg-[#10b981] hover:bg-[#10b981] text-white border-none cursor-default flex items-center gap-1 px-4">
                        ✓ Paid
                      </div>
                    )}
                  </div>
                </div>

                {/* Slim Progress Strip at Bottom of Each Card */}
                <div className="mt-5 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
                    {stage === "unpaid" && (
                      <>
                        <span>Advance 50% · ৳{advance.toLocaleString()} · Unpaid</span>
                        <span>Final 50% · ৳{remaining.toLocaleString()} · Locked</span>
                      </>
                    )}
                    {stage === "final_due" && (
                      <>
                        <span className="text-gray-600 font-medium">Advance 50% · Paid</span>
                        <span className="text-gray-600 font-medium">Final 50% · ৳{remaining.toLocaleString()} · Due now</span>
                      </>
                    )}
                    {stage === "fully_paid" && (
                      <>
                        <span className="text-gray-600 font-medium">Advance 50% · Paid</span>
                        <span className="text-gray-600 font-medium">Final 50% · Paid</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Left Bar: Advance 50% */}
                    <div
                      className={`h-1.5 sm:h-2 rounded-full transition-colors ${
                        stage === "unpaid" ? "bg-gray-200" : "bg-[#10b981]"
                      }`}
                    />

                    {/* Right Bar: Final 50% */}
                    <div
                      className={`h-1.5 sm:h-2 rounded-full transition-colors ${
                        stage === "fully_paid"
                          ? "bg-[#10b981]"
                          : stage === "final_due"
                          ? "bg-[#f59e0b]"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
