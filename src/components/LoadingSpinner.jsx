import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full border-[3px] border-base-200 border-t-[#e8a803]"
      />
      <p className="text-sm text-base-content/40 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
