import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    service_name: "",
    cost: "",
    unit: "",
    service_category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services?limit=100`
      );
      setServices(data.services);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY
      }`,
      formData
    );
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("lumora-token");

    try {
      const serviceData = {
        ...formData,
        cost: parseFloat(formData.cost),
        createdByEmail: user.email,
      };

      if (editingService) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/services/${editingService._id}`,
          serviceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Service updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/services`,
          serviceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Service created successfully");
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({
        service_name: "",
        cost: "",
        unit: "",
        service_category: "",
        description: "",
        image: "",
      });
      fetchServices();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      cost: service.cost,
      unit: service.unit,
      service_category: service.service_category,
      description: service.description,
      image: service.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;

    try {
      const token = localStorage.getItem("lumora-token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Manage{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            Services
          </span>
        </h1>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              service_name: "",
              cost: "",
              unit: "",
              service_category: "",
              description: "",
              image: "",
            });
            setShowModal(true);
          }}
          className="btn bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none"
        >
          <FiPlus /> Add Service
        </button>
      </div>

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
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Unit</th>
                  <th>Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id}>
                    <td className="font-medium">{service.service_name}</td>
                    <td>
                      <span className="badge badge-primary">
                        {service.service_category}
                      </span>
                    </td>
                    <td className="font-bold">৳{service.cost}</td>
                    <td>{service.unit}</td>
                    <td>{service.bookingCount || 0}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="btn btn-sm btn-ghost text-blue-600"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="btn btn-sm btn-ghost text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-6">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Service Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.service_name}
                    onChange={(e) =>
                      setFormData({ ...formData, service_name: e.target.value })
                    }
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    value={formData.service_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        service_category: e.target.value,
                      })
                    }
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select</option>
                    <option value="home">Home</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="office">Office</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cost (BDT)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="e.g., sq-ft, event"
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none"
                >
                  {editingService ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default ManageServices;
