import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { FiMail, FiUser, FiCalendar } from "react-icons/fi";

const MyProfile = () => {
  const { user, userRole } = useAuth();

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
            Profile
          </span>
        </h1>
        <p className="text-gray-600">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={user?.photoURL || "https://i.ibb.co/3YRjQxv/user.png"}
            alt={user?.displayName}
            className="w-32 h-32 rounded-full ring-4 ring-[var(--lum-accent)] object-cover"
          />

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiUser />
                <span className="font-medium">Full Name</span>
              </div>
              <p className="text-xl font-bold">{user?.displayName}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiMail />
                <span className="font-medium">Email Address</span>
              </div>
              <p className="text-xl font-bold">{user?.email}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiCalendar />
                <span className="font-medium">Account Type</span>
              </div>
              <span className="badge badge-lg bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
