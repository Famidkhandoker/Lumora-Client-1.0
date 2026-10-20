import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FiCalendar, FiMapPin, FiUser, FiSun } from "react-icons/fi";

const TodaySchedule = () => {
  const { user } = useAuth();
  const [todayProjects, setTodayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySchedule();
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/decorator/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const today = new Date().toDateString();
      const todayBookings = data.filter(
        (booking) => new Date(booking.bookingDate).toDateString() === today
      );

      setTodayProjects(todayBookings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Today's{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            Schedule
          </span>
        </h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : todayProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[var(--lum-cream)] to-[var(--lum-skysoft)] rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--lum-accent)]/10 flex items-center justify-center mx-auto mb-5">
            <FiSun size={36} className="text-[var(--lum-accent)]" />
          </div>
          <h2 className="text-3xl font-bold mb-2">No Projects Today!</h2>
          <p className="text-gray-600 text-lg">
            Enjoy your free time or catch up on pending tasks
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {todayProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-100 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">
                    {project.serviceName}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[var(--lum-skysoft)] rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{project.userName}</p>
                        <p className="text-sm text-gray-600">
                          {project.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[var(--lum-skysoft)] rounded-full flex items-center justify-center">
                        <FiMapPin className="text-[var(--lum-accent)]" />
                      </div>
                      <p className="text-base-content">{project.location}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCalendar className="text-green-600" />
                      </div>
                      <p className="text-gray-700">
                        Today -{" "}
                        {new Date(project.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {project.notes && (
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-sm">
                        <strong>Special Notes:</strong> {project.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-[var(--lum-accent)] mb-2">
                    ৳{project.serviceCost}
                  </div>
                  <span
                    className={`badge badge-lg ${project.status === "completed"
                        ? "badge-success"
                        : project.status === "setup-in-progress"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                  >
                    {project.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;
