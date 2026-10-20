import { useState, useEffect } from "react";
import axios from "../../../utilits/axiosInstance";
import toast from "react-hot-toast";

const ManageDecorators = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data);
    } catch {
      console.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole, isApproved = true) => {
    try {
      const token = localStorage.getItem("lumora-token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/role`,
        { role: newRole, isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User role updated");
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Manage{" "}
        <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
          Decorators
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="font-medium">{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${user.role === "admin"
                          ? "badge-error"
                          : user.role === "decorator"
                            ? "badge-primary"
                            : "badge-ghost"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role === "decorator" && (
                        <span
                          className={`badge ${user.isApproved ? "badge-success" : "badge-warning"
                            }`}
                        >
                          {user.isApproved ? "Approved" : "Pending"}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {user.role === "user" && (
                          <button
                            onClick={() =>
                              handleRoleUpdate(user._id, "decorator")
                            }
                            className="btn btn-sm btn-primary"
                          >
                            Make Decorator
                          </button>
                        )}
                        {user.role === "decorator" && !user.isApproved && (
                          <button
                            onClick={() =>
                              handleRoleUpdate(user._id, "decorator", true)
                            }
                            className="btn btn-sm btn-success"
                          >
                            Approve
                          </button>
                        )}
                        {user.role === "decorator" && user.isApproved && (
                          <button
                            onClick={() =>
                              handleRoleUpdate(user._id, "decorator", false)
                            }
                            className="btn btn-sm btn-warning"
                          >
                            Disable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDecorators;
