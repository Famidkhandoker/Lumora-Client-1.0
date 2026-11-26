import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FiCalendar, FiMapPin, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const statusOptions = [
    "assigned",
    "planning",
    "materials-prepared",
    "on-the-way",
    "setup-in-progress",
    "completed",
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/decorator/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Project status updated");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleMarkServiceCompleted = async (project) => {
    const isAdvanceDone =
      project.advance_paid ||
      project.isPaid ||
      project.payment_stage === "advance_paid" ||
      project.payment_stage === "fully_paid";

    if (!isAdvanceDone) {
      toast.error(
        "Advance payment (50%) must be paid before marking service as completed."
      );
      return;
    }

    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${project._id}/service-complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        "Service marked as completed! Customer can now pay the remaining 50%."
      );
      fetchProjects();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark service completed"
      );
    }
  };

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">
          My{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            Projects
          </span>
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="all">All Projects</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace("-", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">No projects found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-100 rounded-2xl shadow-xl p-6"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    {project.serviceName}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiCalendar />
                      <span>
                        {new Date(project.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMapPin />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Customer: <strong>{project.userName}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {project.userEmail}
                    </p>
                  </div>

                  {project.notes && (
                    <div className="bg-base-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {project.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:w-64">
                  <div className="mb-4">
                    <label className="label">
                      <span className="label-text font-medium">
                        Update Status
                      </span>
                    </label>
                    <select
                      value={project.status}
                      onChange={(e) =>
                        handleStatusUpdate(project._id, e.target.value)
                      }
                      className="select select-bordered w-full"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace("-", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {/* Small Mark as Completed button */}
                    {project.status !== "completed" &&
                      !project.service_completed && (
                        <button
                          type="button"
                          onClick={() => handleMarkServiceCompleted(project)}
                          disabled={!project.advance_paid && !project.isPaid}
                          className="btn btn-xs sm:btn-sm btn-outline btn-success w-full mt-2 gap-1.5"
                          title={
                            !project.advance_paid && !project.isPaid
                              ? "Advance payment (50%) required before completing service"
                              : "Mark service as completed to unlock customer final payment"
                          }
                        >
                          <FiCheckCircle size={14} /> Mark as Completed
                        </button>
                      )}

                    {project.service_completed && (
                      <div className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1 mt-2">
                        <span>✓ Service Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--lum-accent)]">
                      ৳{project.serviceCost}
                    </p>
                    <span
                      className={`badge ${project.status === "completed"
                          ? "badge-success"
                          : "badge-primary"
                        }`}
                    >
                      {project.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
