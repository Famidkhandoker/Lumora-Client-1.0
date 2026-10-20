// src/pages/dashboard/user/MyBookings.jsx
// FIXED VERSION - No more redirectToCheckout error!

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FiTrash2, FiCreditCard, FiCalendar, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (booking) => {
    setPaymentLoading(booking._id);

    try {
      const token = localStorage.getItem("lumora-token");

      // Create checkout session
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
        {
          bookingId: booking._id,
          amount: booking.serviceCost,
          serviceName: booking.serviceName,
          userEmail: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // FIXED: Use window.location.href instead of redirectToCheckout
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
      setPaymentLoading(null);
    }
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

  const getStatusColor = (status, isPaid) => {
    if (!isPaid) return "badge-warning";
    if (status === "completed") return "badge-success";
    if (status === "assigned") return "badge-info";
    return "badge-primary";
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
          {bookings.map((booking, index) => (
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
                        {booking.serviceName}
                      </h3>
                      <span
                        className={`badge ${getStatusColor(
                          booking.status,
                          booking.isPaid
                        )}`}
                      >
                        {booking.isPaid ? booking.status : "Payment Pending"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--lum-accent)]">
                        {/* ৳{booking.serviceCost.toLocaleString()} */}
                        ৳{Number(booking.serviceCost || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {/* per {booking.serviceUnit} */}
                        per {booking.serviceUnit || "event"}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiCalendar />
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMapPin />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  {booking.decoratorName && (
                    <p className="text-sm text-gray-600">
                      Decorator: <strong>{booking.decoratorName}</strong>
                    </p>
                  )}

                  {booking.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  {!booking.isPaid && (
                    <>
                      <button
                        onClick={() => handlePayment(booking)}
                        disabled={paymentLoading === booking._id}
                        className="btn btn-sm bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none hover:scale-105 transition-transform"
                      >
                        {paymentLoading === booking._id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FiCreditCard /> Pay Now
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={paymentLoading === booking._id}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        <FiTrash2 /> Cancel
                      </button>
                    </>
                  )}
                  {booking.isPaid && (
                    <div className="flex items-center space-x-2">
                      <div className="badge badge-success badge-lg gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-4 h-4 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Paid
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
