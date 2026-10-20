import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FiDollarSign, FiCheckCircle, FiCalendar, FiInbox } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({
    total: 0,
    payments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/decorator/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEarnings({
        total: data.totalEarnings,
        payments: data.payments,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group earnings by month for chart with proper sorting
  const monthlyData = earnings.payments
    .reduce((acc, payment) => {
      const date = new Date(payment.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const existing = acc.find((item) => item.month === monthYear);

      if (existing) {
        existing.earnings += payment.amount;
      } else {
        acc.push({
          month: monthYear,
          earnings: payment.amount,
          sortKey: date.getTime(),
        });
      }

      return acc;
    }, [])
    .sort((a, b) => a.sortKey - b.sortKey);

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.month}
          </p>
          <p className="text-[var(--lum-accent)] font-bold text-lg">
            ৳{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
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
            Earnings
          </span>
        </h1>
        <p className="text-gray-600">Track your income and payment history</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-[var(--lum-accent)]"></span>
        </div>
      ) : (
        <>
          {/* Total Earnings Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[var(--lum-primary)] via-[var(--lum-accent)] to-[#5B9BD5] rounded-3xl p-8 text-white mb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90 mb-2">Total Earnings</p>
                <p className="text-5xl font-bold">
                  ৳{earnings.total.toLocaleString()}
                </p>
                <p className="text-sm opacity-75 mt-2">
                  {earnings.payments.length} completed projects
                </p>
              </div>
              <FiDollarSign size={100} className="opacity-20" />
            </div>
          </motion.div>

          {/* Earnings Chart */}
          {monthlyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Monthly Earnings Trend
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--lum-text)", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "var(--lum-text)" }}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={() => "Monthly Earnings (৳)"}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{
                      fill: "var(--lum-accent)",
                      r: 6,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      fill: "var(--lum-primary)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="var(--lum-accent)" />
                      <stop offset="100%" stopColor="var(--lum-primary)" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Payment History
            </h2>

            {earnings.payments.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                  <FiInbox size={28} className="text-base-content/30" />
                </div>
                <p className="text-xl text-gray-600 mb-2">No payments yet</p>
                <p className="text-sm text-gray-500">
                  Complete projects to start earning
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {earnings.payments.map((payment, index) => (
                  <motion.div
                    key={payment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--lum-cream)] to-[var(--lum-skysoft)] rounded-xl hover:shadow-md transition-all border border-base-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--lum-accent)] to-[var(--lum-primary)] rounded-full flex items-center justify-center shadow-lg">
                        <FiCheckCircle className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {payment.serviceName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <FiCalendar size={14} />
                          <span>
                            {new Date(payment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Transaction: {payment.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-[var(--lum-accent)] to-[var(--lum-primary)] bg-clip-text text-transparent">
                        ৳{payment.amount.toLocaleString()}
                      </p>
                      <span className="badge badge-success badge-sm mt-1">
                        Received
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Earnings;
