import { useState, useEffect } from "react";
import axios from "../../../utilits/axiosInstance";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEye,
  FiSettings,
  FiCheck,
  FiX,
  FiPhone,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiUser,
  FiUsers,
  FiClock,
} from "react-icons/fi";

const ManageDecorators = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [editPhone, setEditPhone] = useState("");
  const [updatingServices, setUpdatingServices] = useState(false);

  // Assign Section State
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const [usersRes, servicesRes, bookingsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/services?limit=100`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersRes.data || []);
      setServices(servicesRes.data.services || []);
      const bData = bookingsRes.data || [];
      setBookings(bData);

      // Auto-select first booking for assign section if available
      if (bData.length > 0 && !selectedBookingId) {
        setSelectedBookingId(bData[0]._id);
      }
    } catch (err) {
      console.error("Error fetching admin decorator data:", err);
      toast.error("Failed to load decorator data");
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler
  const handleRoleUpdate = async (userId, newRole, isApproved = true) => {
    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/role`,
        { role: newRole, isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        isApproved
          ? "Decorator approved successfully"
          : "Decorator disabled successfully"
      );
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  // Open Manage Services Modal
  const openManageServices = (decorator) => {
    setSelectedDecorator(decorator);
    setSelectedServices(decorator.services || []);
    setEditPhone(decorator.phone || "+880 1712 345678");
    setManageModalOpen(true);
  };

  // Toggle service selection in modal
  const toggleService = (serviceId) => {
    const sIdStr = serviceId.toString();
    setSelectedServices((prev) =>
      prev.includes(sIdStr)
        ? prev.filter((id) => id !== sIdStr)
        : [...prev, sIdStr]
    );
  };

  // Save updated services & phone
  const handleSaveServices = async () => {
    if (!selectedDecorator) return;
    setUpdatingServices(true);

    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/decorators/${selectedDecorator._id}/services`,
        {
          services: selectedServices,
          phone: editPhone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Decorator services updated successfully");
      setManageModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error updating services:", err);
      toast.error("Failed to update services");
    } finally {
      setUpdatingServices(false);
    }
  };

  // Handle assigning an eligible decorator to the selected booking
  const handleAssignToBooking = async (decorator) => {
    if (!selectedBookingId) {
      toast.error("Please select a booking first");
      return;
    }

    setAssigningId(decorator._id);
    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBookingId}/assign`,
        {
          decoratorId: decorator._id,
          decoratorEmail: decorator.email,
          decoratorName: decorator.displayName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Assigned ${decorator.displayName} to booking!`);
      fetchData();
    } catch (err) {
      console.error("Error assigning decorator:", err);
      toast.error(err.response?.data?.message || "Failed to assign decorator");
    } finally {
      setAssigningId(null);
    }
  };

  // Decorators filter & stats
  const allDecorators = users.filter((u) => u.role === "decorator");
  const approvedDecorators = allDecorators.filter((u) => u.isApproved);
  const pendingDecorators = allDecorators.filter((u) => !u.isApproved);

  // Search filtered users/decorators
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (u.displayName || "").toLowerCase().includes(q);
    const emailMatch = (u.email || "").toLowerCase().includes(q);
    const phoneMatch = (u.phone || "").toLowerCase().includes(q);
    const serviceMatch = (u.servicesProvided || []).some((s) =>
      s.toLowerCase().includes(q)
    );
    return nameMatch || emailMatch || phoneMatch || serviceMatch;
  });

  // Selected booking for assign section
  const currentBooking = bookings.find((b) => b._id === selectedBookingId);

  // Filter eligible decorators for currentBooking (Rule: Approved AND provides booking's service)
  const eligibleDecorators = allDecorators.filter((dec) => {
    // Rule 1: Must be approved
    if (!dec.isApproved) return false;

    // Rule 2: Must provide this booking's service
    if (!currentBooking) return true;

    // If booking has a serviceId, check against decorator's services array
    if (currentBooking.serviceId && Array.isArray(dec.services) && dec.services.length > 0) {
      return dec.services.some(
        (sId) => sId.toString() === currentBooking.serviceId.toString()
      );
    }

    // Fallback: match by service name/category
    if (dec.servicesProvided && currentBooking.serviceName) {
      return dec.servicesProvided.some(
        (sp) =>
          sp.toLowerCase().includes((currentBooking.serviceCategory || "").toLowerCase()) ||
          currentBooking.serviceName.toLowerCase().includes(sp.toLowerCase())
      );
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Manage{" "}
            <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
              Decorators
            </span>
          </h1>
          <p className="text-gray-600 mt-1">
            Manage decorator accounts, approvals and services
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search decorators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10 pr-4 text-sm rounded-xl bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Top Stats Cards (Matching Reference Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0070e0] to-[#54a0ff] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <FiUsers className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium opacity-90">Total Decorators</p>
            <h3 className="text-3xl font-extrabold mt-1">{allDecorators.length}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#009432] to-[#2ed573] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <FiCheck className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium opacity-90">Approved</p>
            <h3 className="text-3xl font-extrabold mt-1">{approvedDecorators.length}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#f39c12] to-[#f1c40f] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium opacity-90">Pending Approval</p>
            <h3 className="text-3xl font-extrabold mt-1">{pendingDecorators.length}</h3>
          </div>
        </div>
      </div>

      {/* Decorators Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#0070e0]"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-[#f8fafc] border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 pl-6">Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Services Provided</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((user) => {
                  const isDecorator = user.role === "decorator";
                  const servicesList = user.servicesProvided || [];

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Profile Photo */}
                      <td className="py-4 pl-6">
                        <img
                          src={user.photoURL || "/images/decorators/ryin.jpg"}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces";
                          }}
                        />
                      </td>

                      {/* Name */}
                      <td className="font-semibold text-gray-900">
                        {user.displayName}
                      </td>

                      {/* Email */}
                      <td className="text-gray-600 font-normal">{user.email}</td>

                      {/* Phone */}
                      <td className="text-gray-600 font-normal">
                        {user.phone || "+880 1712 345678"}
                      </td>

                      {/* Role */}
                      <td>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : isDecorator
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {isDecorator ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.isApproved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span>{user.isApproved ? "✔" : "⏳"}</span>
                            <span>{user.isApproved ? "Approved" : "Pending"}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">User</span>
                        )}
                      </td>

                      {/* Services Provided */}
                      <td>
                        {isDecorator && servicesList.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {servicesList.slice(0, 2).map((srv, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {srv}
                              </span>
                            ))}
                            {servicesList.length > 2 && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600">
                                +{servicesList.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {isDecorator ? "No services assigned" : "-"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* View Details button */}
                          <button
                            onClick={() => {
                              setSelectedDecorator(user);
                              setViewModalOpen(true);
                            }}
                            className="btn btn-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border-none rounded-lg flex items-center gap-1 font-medium"
                            title="View full details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Manage Services button (for decorators) */}
                          {isDecorator && (
                            <button
                              onClick={() => openManageServices(user)}
                              className="btn btn-xs bg-[#0070e0] hover:bg-[#005bb5] text-white border-none rounded-lg flex items-center gap-1 font-medium"
                              title="Manage services and profile"
                            >
                              <FiSettings className="w-3.5 h-3.5" />
                              <span>Manage</span>
                            </button>
                          )}

                          {/* Role toggle / Approve / Disable buttons */}
                          {user.role === "user" && (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "decorator", true)}
                              className="btn btn-xs btn-outline btn-primary rounded-lg text-xs"
                            >
                              Make Decorator
                            </button>
                          )}

                          {isDecorator && !user.isApproved && (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "decorator", true)}
                              className="btn btn-xs btn-success text-white rounded-lg text-xs"
                            >
                              Approve
                            </button>
                          )}

                          {isDecorator && user.isApproved && (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "decorator", false)}
                              className="btn btn-xs btn-warning text-white rounded-lg text-xs"
                            >
                              Disable
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION: ASSIGN DECORATOR TO BOOKING (Reference Screen) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-7 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-[#0070e0] font-bold text-lg">
              👔
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Decorator to Booking
              </h2>
              <p className="text-xs text-gray-500">
                Only approved decorators providing the required service can be assigned
              </p>
            </div>
          </div>

          {/* Booking Selector Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
              Select Booking:
            </span>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="select select-bordered select-sm rounded-xl text-xs bg-white border-gray-200 font-medium w-full sm:w-72"
            >
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  #{b._id.slice(-6).toUpperCase()} - {b.serviceName} ({b.userName || b.userEmail})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentBooking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Card: Booking Details */}
            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-200/80 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-200 pb-3">
                <FiCalendar className="text-[#0070e0] w-4 h-4" />
                <span>Booking Details</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-semibold text-gray-900">
                    #{currentBooking._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {currentBooking.serviceName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-semibold text-gray-900">
                    {currentBooking.userName || currentBooking.userEmail}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(currentBooking.bookingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full font-semibold ${
                      currentBooking.status === "assigned"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {currentBooking.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Current Decorator:</span>
                  <span className="font-bold text-[#0070e0]">
                    {currentBooking.decoratorName || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Eligible Decorators */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <FiUser className="text-[#0070e0] w-4 h-4" />
                <span>Eligible Decorators</span>
                <span className="text-xs font-normal text-gray-500">
                  (Approved decorators offering this service)
                </span>
              </div>

              {eligibleDecorators.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-sm">
                  <p className="font-medium">
                    No approved decorators currently offer the service &quot;{currentBooking.serviceName}&quot;.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click &quot;Manage&quot; in the table above to grant this service to an approved decorator.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {eligibleDecorators.map((dec) => {
                    const isCurrentlyAssigned =
                      currentBooking.decoratorEmail === dec.email ||
                      currentBooking.decoratorId === dec._id.toString();

                    return (
                      <div
                        key={dec._id}
                        className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                          isCurrentlyAssigned
                            ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                            : "border-gray-200 bg-white hover:border-blue-300 shadow-sm"
                        }`}
                      >
                        <div className="text-center">
                          <img
                            src={dec.photoURL || "/images/decorators/ryin.jpg"}
                            alt={dec.displayName}
                            className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-white shadow-md mb-2.5"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces";
                            }}
                          />
                          <h4 className="font-bold text-sm text-gray-900 truncate">
                            {dec.displayName}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate flex items-center justify-center gap-1 mt-0.5">
                            <FiMail className="w-3 h-3" />
                            <span>{dec.email}</span>
                          </p>
                          <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1 mt-0.5">
                            <FiPhone className="w-3 h-3" />
                            <span>{dec.phone || "+880 1712 345678"}</span>
                          </p>

                          <div className="flex flex-wrap gap-1 justify-center mt-2.5">
                            {(dec.servicesProvided || []).slice(0, 2).map((srv, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 text-center">
                          {isCurrentlyAssigned ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100/70 px-3 py-1.5 rounded-lg w-full justify-center">
                              ✓ Currently Assigned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssignToBooking(dec)}
                              disabled={assigningId === dec._id}
                              className="btn btn-sm w-full bg-[#0070e0] hover:bg-[#005bb5] text-white border-none rounded-xl text-xs font-semibold"
                            >
                              {assigningId === dec._id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : currentBooking.decoratorId ? (
                                "Reassign"
                              ) : (
                                "Assign"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No bookings available.</p>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: MANAGE SERVICES (Reference Screenshot 3)          */}
      {/* ======================================================== */}
      {manageModalOpen && selectedDecorator && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl rounded-3xl p-6 sm:p-8 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <FiSettings className="w-5 h-5 text-[#0070e0]" />
                <h3 className="font-bold text-xl text-gray-900">
                  Manage Services – {selectedDecorator.displayName}
                </h3>
              </div>
              <button
                onClick={() => setManageModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Modal Content: Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Decorator Info */}
              <div className="text-center md:text-left space-y-3 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                <img
                  src={selectedDecorator.photoURL || "/images/decorators/ryin.jpg"}
                  alt={selectedDecorator.displayName}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto md:mx-0 border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces";
                  }}
                />
                <div>
                  <h4 className="font-bold text-base text-gray-900">
                    {selectedDecorator.displayName}
                  </h4>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 mt-1">
                    Decorator
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-gray-200">
                  <p className="flex items-center gap-1.5 truncate">
                    <FiMail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{selectedDecorator.email}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <FiPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+880 1712 345678"
                      className="input input-xs input-bordered w-full rounded-md text-xs bg-white"
                      title="Edit phone number"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-gray-500 block mb-1">
                    Current Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      selectedDecorator.isApproved
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <span>{selectedDecorator.isApproved ? "✔" : "⏳"}</span>
                    <span>
                      {selectedDecorator.isApproved ? "Approved" : "Pending"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Right Column: Services Selection Grid */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm text-gray-900">
                  Services Provided
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = selectedServices.includes(srv._id.toString());
                    return (
                      <button
                        key={srv._id}
                        type="button"
                        onClick={() => toggleService(srv._id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "border border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="truncate">{srv.service_name}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-2">
                  <span>ℹ</span>
                  <span>Select the services this decorator can provide:</span>
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action border-t border-gray-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setManageModalOpen(false)}
                className="btn btn-sm btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveServices}
                disabled={updatingServices}
                className="btn btn-sm bg-[#0070e0] hover:bg-[#005bb5] text-white border-none rounded-xl px-5 font-semibold"
              >
                {updatingServices ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Update Services"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setManageModalOpen(false)}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW DETAILS                                      */}
      {/* ======================================================== */}
      {viewModalOpen && selectedDecorator && (
        <div className="modal modal-open">
          <div className="modal-box rounded-3xl p-6 sm:p-7 max-w-md bg-white shadow-2xl">
            <div className="text-center space-y-3">
              <img
                src={selectedDecorator.photoURL || "/images/decorators/ryin.jpg"}
                alt={selectedDecorator.displayName}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-white shadow-lg"
              />
              <h3 className="font-bold text-xl text-gray-900">
                {selectedDecorator.displayName}
              </h3>
              <p className="text-xs text-gray-500">{selectedDecorator.email}</p>
              <p className="text-xs text-gray-600 font-medium">
                {selectedDecorator.phone || "+880 1712 345678"}
              </p>

              <div className="pt-2 flex justify-center gap-2">
                <span className="badge badge-primary">{selectedDecorator.role}</span>
                <span
                  className={`badge ${
                    selectedDecorator.isApproved ? "badge-success" : "badge-warning"
                  } text-white`}
                >
                  {selectedDecorator.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Services Offered
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedDecorator.servicesProvided || []).length > 0 ? (
                  selectedDecorator.servicesProvided.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100"
                    >
                      {srv}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No services assigned yet</span>
                )}
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => setViewModalOpen(false)}
                className="btn btn-sm btn-ghost w-full rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setViewModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ManageDecorators;
