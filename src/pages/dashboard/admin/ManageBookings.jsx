import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDecorator, setSelectedDecorator] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const [bookingsRes, decoratorsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/decorators`),
      ]);

      setBookings(bookingsRes.data);
      setDecorators(decoratorsRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDecorator = async () => {
    if (!selectedDecorator) {
      toast.error("Please select a decorator");
      return;
    }

    try {
      const token = localStorage.getItem("lumora-token");
      const decorator = decorators.find((d) => d.email === selectedDecorator);

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBooking._id}/assign`,
        {
          decoratorId: decorator._id,
          decoratorEmail: decorator.email,
          decoratorName: decorator.displayName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Decorator assigned successfully");
      setSelectedBooking(null);
      setSelectedDecorator("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign decorator");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Manage{" "}
        <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
          Bookings
        </span>
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Decorator</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.userName}</td>
                    <td className="font-medium">{booking.serviceName}</td>
                    <td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          booking.isPaid || booking.payment_stage === "fully_paid"
                            ? "badge-success"
                            : booking.advance_paid || booking.payment_stage === "advance_paid" || booking.payment_stage === "final_due"
                            ? "badge-info"
                            : "badge-warning"
                        }`}
                      >
                        {booking.isPaid || booking.payment_stage === "fully_paid"
                          ? "Fully Paid"
                          : booking.advance_paid || booking.payment_stage === "advance_paid" || booking.payment_stage === "final_due"
                          ? "Advance Paid"
                          : "Pending"}
                      </span>
                    </td>
                    <td>{booking.decoratorName || "-"}</td>
                    <td>
                      <span className="badge badge-primary">
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {(booking.isPaid || booking.advance_paid || booking.payment_stage === "advance_paid") && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setSelectedDecorator(booking.decoratorEmail || "");
                          }}
                          className={`btn btn-sm ${
                            booking.decoratorEmail
                              ? "btn-outline btn-info"
                              : "btn-primary"
                          }`}
                        >
                          {booking.decoratorEmail ? "Change" : "Assign"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-2">
              {selectedBooking.decoratorEmail ? "Change" : "Assign"} Decorator
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Booking: <span className="font-semibold text-gray-800">{selectedBooking.serviceName}</span> for {selectedBooking.userName}
            </p>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Select Approved Decorator</span>
              </label>
              <select
                value={selectedDecorator}
                onChange={(e) => setSelectedDecorator(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Choose a decorator</option>
                {decorators
                  .filter((dec) => dec.isApproved !== false)
                  .map((dec) => (
                    <option key={dec.email} value={dec.email}>
                      {dec.displayName} {dec.phone ? `(${dec.phone})` : ""} - {dec.servicesProvided?.join(", ") || dec.specialty || "Approved Decorator"}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setSelectedDecorator("");
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDecorator}
                className="btn btn-primary"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedBooking(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
