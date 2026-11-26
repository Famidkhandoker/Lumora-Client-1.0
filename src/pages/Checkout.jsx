import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import toast from "react-hot-toast";

const Checkout = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [paying, setPaying] = useState(false);

  // Card Form State (Right side)
  const [cardData, setCardData] = useState({
    cardNumber: "•••• •••• •••• 4242",
    expiry: "12 / 28",
    cvc: "123",
    cardholderName: user?.displayName || "Famid Khandoker",
    country: "Bangladesh",
    saveInfo: true,
  });

  useEffect(() => {
    if (!booking) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      if (bookingId) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooking(data);
      } else {
        if (!user?.email) return;
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/user/${encodeURIComponent(user.email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const unpaid = data.bookings?.find((b) => !b.isPaid) || data.bookings?.[0];
        if (unpaid) setBooking(unpaid);
      }
    } catch (error) {
      console.error("Error fetching booking for checkout:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  // Helper formatters
  const formatBDT = (amount) => {
    return `BDT ${Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Nov 15, 2025";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const str = String(timeStr).trim();

    // Already in 12-hour format e.g. "06:00 PM" or "6:00 pm"
    const twelveHourMatch = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHourMatch) {
      const hours = twelveHourMatch[1].padStart(2, "0");
      const minutes = twelveHourMatch[2];
      const modifier = twelveHourMatch[3].toUpperCase();
      return `${hours}:${minutes} ${modifier}`;
    }

    // 24-hour format from HTML time input e.g. "18:00", "06:00", "18:00:00"
    const twentyFourMatch = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (twentyFourMatch) {
      let hours = parseInt(twentyFourMatch[1], 10);
      const minutes = twentyFourMatch[2];
      const modifier = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
    }

    // ISO string or full datetime
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const modifier = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
      }
    } catch {
      // fallback
    }

    return str;
  };

  const queryParams = new URLSearchParams(location.search);
  const requestedType = queryParams.get("type") || location.state?.paymentType;

  // Determine 50/50 stage: 'advance' or 'final'
  const paymentType =
    requestedType ||
    (booking?.advance_paid && !booking?.final_paid ? "final" : "advance");

  // Dynamic values calculation
  const totalAmount = Number(
    booking?.serviceCost || booking?.totalAmount || 28000
  );

  const advanceAmount =
    booking?.advance_amount != null
      ? Number(booking.advance_amount)
      : Math.round(totalAmount * 0.5);

  const remainingAmount =
    booking?.remaining_amount != null
      ? Number(booking.remaining_amount)
      : totalAmount - advanceAmount;

  const payingNowAmount =
    paymentType === "final" ? remainingAmount : advanceAmount;
  
  // Calculate dynamic breakdown based on booking data
  // Standard breakdown matching Lumora's pricing logic
  const serviceCharge = booking?.serviceCharge 
    ? Number(booking.serviceCharge) 
    : Math.round(totalAmount * 0.70); // ~70% base service charge

  const decoratorCharge = booking?.decoratorCharge || booking?.decorationCharge
    ? Number(booking.decoratorCharge || booking.decorationCharge)
    : Math.round(totalAmount * 0.15); // ~15% decorator fee

  const vat = booking?.vat 
    ? Number(booking.vat) 
    : Math.round(totalAmount * 0.15); // 15% VAT

  const discount = booking?.discount ? Number(booking.discount) : 0;

  // Handle Right-Side Payment Submission
  const handlePay = async (e) => {
    e.preventDefault();

    // Edge-case stage validations
    if (paymentType === "final") {
      const isAdvanceDone = booking?.advance_paid || booking?.isPaid;
      if (!isAdvanceDone) {
        toast.error("Advance payment (50%) must be paid before final payment.");
        return;
      }
      if (booking?.final_paid || booking?.payment_stage === "fully_paid") {
        toast.error("Final payment has already been completed.");
        return;
      }
    } else {
      if (
        booking?.advance_paid ||
        booking?.isPaid ||
        booking?.payment_stage === "fully_paid"
      ) {
        toast.error("Advance payment has already been completed.");
        return;
      }
    }

    setPaying(true);

    try {
      const token = localStorage.getItem("lumora-token");
      const currentBookingId = booking?._id || bookingId;

      // Call payments endpoint to record payment with 50/50 type
      const paymentPayload = {
        bookingId: currentBookingId,
        userEmail: user?.email || "famidkhandoker2023@gmail.com",
        userName: user?.displayName || cardData.cardholderName,
        serviceName: booking?.serviceName || "Decoration Service",
        amount: payingNowAmount,
        totalAmount: totalAmount,
        payment_type: paymentType,
        paymentType: paymentType,
        currency: "bdt",
        paymentMethod: "card",
        transactionId: `txn_${paymentType}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        paymentPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        paymentType === "final"
          ? "Final payment completed! Booking is now fully paid."
          : "Advance payment (50%) completed successfully!"
      );
      navigate(
        `/payment/success?booking_id=${currentBookingId}&payment_id=${
          data.insertedId || data.payment?._id || ""
        }&type=${paymentType}`
      );
    } catch (err) {
      console.error("Payment submission error:", err);
      toast.error(
        err.response?.data?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#0070e0]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: PAYMENT SUMMARY (Matching Reference Image)   */}
        {/* ========================================================= */}
        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-4">
          
          {/* 1. Header with back arrow, logo and Sandbox badge */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              title="Go back"
            >
              <FiArrowLeft className="w-4 h-4 text-gray-800" />
            </button>

            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
              B
            </div>

            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Lumora sandbox
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0f172a] text-white ml-0.5 shadow-sm">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              Sandbox
            </span>
          </div>

          {/* 2. Top Event / Booking Image Card Container */}
          <div className="w-full h-32 sm:h-36 rounded-2xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex items-center justify-center">
            {booking?.serviceImage || booking?.image ? (
              <img
                src={booking.serviceImage || booking.image}
                alt="Event Decoration"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white" />
            )}
          </div>

          {/* 3. Main Payment Summary Card */}
          <div className="rounded-2xl bg-white border border-gray-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6">
            
            {/* Header + Big Amount */}
            <div>
              <div className="text-[12px] sm:text-[13px] font-normal text-gray-500 mb-1">
                Paying now · {paymentType === "final" ? "Final payment (50%)" : "Advance payment (50%)"}
              </div>
              <div className="text-3xl sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
                {formatBDT(payingNowAmount)}
              </div>
            </div>

            {/* Event & Booking Information */}
            <div className="space-y-3.5 pt-1">
              {/* Event Type */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Event Type</span>
                <span className="font-semibold text-gray-900 text-right">
                  {booking?.serviceCategory || booking?.serviceName || "Wedding"}
                </span>
              </div>

              {/* Booking Date */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Booking Date</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4 text-gray-800" />
                  <span>{formatDate(booking?.bookingDate)}</span>
                </span>
              </div>

              {/* Time */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Time</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <FiClock className="w-4 h-4 text-gray-800" />
                  <span>
                    {formatTime(
                      booking?.bookingTime ||
                      booking?.eventTime ||
                      booking?.time ||
                      booking?.selectedTime
                    ) || "Not specified"}
                  </span>
                </span>
              </div>

              {/* Location */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Location</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1.5 max-w-[65%] truncate justify-end">
                  <FiMapPin className="w-4 h-4 text-gray-800 shrink-0" />
                  <span className="truncate">{booking?.location || "Dhaka, Bangladesh"}</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Pricing Breakdown */}
            <div className="space-y-3">
              {/* Service Charge */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Service Charge</span>
                <span className="font-semibold text-gray-900">
                  {formatBDT(serviceCharge)}
                </span>
              </div>

              {/* Decorator Charge */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">Decorator Charge</span>
                <span className="font-semibold text-gray-900">
                  {formatBDT(decoratorCharge)}
                </span>
              </div>

              {/* VAT (15%) */}
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500 font-normal">VAT (15%)</span>
                <span className="font-semibold text-gray-900">
                  {formatBDT(vat)}
                </span>
              </div>

              {/* Discount if present */}
              {discount > 0 && (
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-normal">Discount</span>
                  <span className="font-semibold text-emerald-600">
                    - {formatBDT(discount)}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Total Section */}
            <div className="pt-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatBDT(totalAmount)}
                </span>
              </div>
              <p className="text-[12px] text-gray-400 text-right mt-1 font-normal">
                Inclusive of all charges
              </p>
            </div>

            {/* 50/50 Payment Breakdown Box */}
            <div className="bg-[#f0f7ff] border border-sky-100 rounded-xl p-3.5 space-y-1.5">
              {paymentType === "advance" ? (
                <>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#0070e0] font-semibold">
                      Advance now (50%)
                    </span>
                    <span className="text-[#0070e0] font-bold">
                      {formatBDT(advanceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">
                      Remaining after service (50%)
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {formatBDT(remainingAmount)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      Advance paid ✓
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {formatBDT(advanceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#0070e0] font-semibold">
                      Final now (50%)
                    </span>
                    <span className="text-[#0070e0] font-bold">
                      {formatBDT(remainingAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: STRIPE PAYMENT FORM (Unchanged functionality) */}
        {/* ========================================================= */}
        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-5 pt-1 lg:pt-0">
          
          {/* Apple Pay & Link Express Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="bg-black hover:bg-neutral-900 text-white rounded-lg h-11 flex items-center justify-center font-semibold text-sm transition-opacity shadow-sm gap-1.5 active:scale-[0.99]"
            >
              <FaApple className="w-4 h-4 mb-0.5" />
              <span>Pay</span>
            </button>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="bg-[#00D66F] hover:bg-[#00be63] text-black rounded-lg h-11 flex items-center justify-center font-bold text-sm transition-opacity shadow-sm gap-1 active:scale-[0.99]"
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 border-black inline-block -mr-0.5" />
              <span>link</span>
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-wider">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <form onSubmit={handlePay} className="space-y-5">
            {/* Contact information */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
                Contact information
              </label>
              <div className="flex items-center bg-[#f8fafc] border border-gray-200/90 rounded-lg px-3.5 py-2.5 text-sm text-gray-800">
                <span className="text-gray-400 w-16 shrink-0 text-[13px]">Email</span>
                <span className="font-normal text-gray-800 truncate">
                  {user?.email || "famidkhandoker2023@gmail.com"}
                </span>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-800 mb-2">
                Payment method
              </label>

              <div className="border border-gray-200/90 rounded-xl bg-white overflow-hidden shadow-sm">
                {/* Card radio selection */}
                <div className="p-3.5 border-b border-gray-100 flex items-center gap-2 text-sm font-semibold text-gray-900 bg-white">
                  <FiCreditCard className="w-4 h-4 text-gray-700" />
                  <span>Card</span>
                </div>

                <div className="p-4 space-y-3 bg-white">
                  {/* Card information */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Card information
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full border border-gray-200 rounded-t-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                        placeholder="1234 1234 1234 1234"
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 opacity-70">
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1 rounded">VISA</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">MC</span>
                        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1 rounded">AMEX</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 -mt-[1px]">
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="border border-gray-200 rounded-bl-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 -mr-[1px]"
                        placeholder="MM / YY"
                      />
                      <input
                        type="text"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="border border-gray-200 rounded-br-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                        placeholder="CVC"
                      />
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Cardholder name
                    </label>
                    <input
                      type="text"
                      value={cardData.cardholderName}
                      onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                      placeholder="Full name on card"
                    />
                  </div>

                  {/* Country or region */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Country or region
                    </label>
                    <select
                      value={cardData.country}
                      onChange={(e) => setCardData({ ...cardData, country: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save information checkbox */}
            <div className="flex items-start gap-2.5 pt-0.5">
              <input
                type="checkbox"
                id="saveInfo"
                checked={cardData.saveInfo}
                onChange={(e) => setCardData({ ...cardData, saveInfo: e.target.checked })}
                className="checkbox checkbox-xs rounded border-gray-300 mt-0.5"
              />
              <label htmlFor="saveInfo" className="text-xs text-gray-600 leading-tight cursor-pointer">
                <span className="font-medium text-gray-800 block">Save my information for faster checkout</span>
                <span className="text-[11px] text-gray-400">
                  Pay securely at Lumora sandbox and everywhere Link is accepted.
                </span>
              </label>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={paying}
              className="w-full bg-[#0070e0] hover:bg-[#005bb5] active:bg-[#0052a3] text-white font-medium py-3 rounded-lg shadow-sm transition-all duration-150 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {paying ? (
                <>
                  <span className="loading loading-spinner loading-xs text-white"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay {formatBDT(payingNowAmount)}</span>
              )}
            </button>

            {/* Footer */}
            <div className="text-center text-[11px] text-gray-400 space-x-2 pt-1">
              <span>Powered by <strong className="text-gray-600 font-semibold">stripe</strong></span>
              <span>•</span>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
