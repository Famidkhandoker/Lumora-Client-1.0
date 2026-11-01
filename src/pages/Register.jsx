import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "../utilits/axiosInstance";
import { Logo } from "../components/Logo";

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    photoFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // OTP Verification States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const { registerUser, requestEmailOtp, verifyEmailOtp, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Upload profile photo to ImageBB
  const uploadToImageBB = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
      fd
    );

    return response.data.data.url;
  };

  // Handle profile photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photoFile: file,
    }));

    setPhotoPreview(URL.createObjectURL(file));
  };

  // Step 1: Send OTP to user's email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    const email = formData.email.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await requestEmailOtp(email);
      setOtpSent(true);
      setResendCountdown(60);
      toast.success(response.data?.message || "Verification code sent to your email!");
    } catch (error) {
      console.error("OTP send error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the 6-digit OTP
  const handleVerifyOtp = async () => {
    const email = formData.email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyEmailOtp(email, cleanOtp);
      setOtpVerified(true);
      toast.success(response.data?.message || "Email verified successfully!");
    } catch (error) {
      console.error("OTP verify error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Invalid or expired verification code.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Allow user to reset and change email
  const handleChangeEmail = () => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendCountdown(0);
  };

  // Step 3: Final account creation once OTP is verified
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Guard: OTP must be verified first
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (!otpVerified) {
      await handleVerifyOtp();
      return;
    }

    // Validate inputs
    if (!formData.displayName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      let photoURL = "https://i.ibb.co/3YRjQxv/user.png";

      if (formData.photoFile) {
        photoURL = await uploadToImageBB(formData.photoFile);
      }

      await registerUser(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.displayName.trim(),
        photoURL
      );

      toast.success("Account created successfully! Please sign in to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      if (error?.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please log in.";
      } else if (error?.code === "auth/weak-password") {
        message = "Password must contain at least 6 characters.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await googleLogin();
      toast.success("Google login successful!");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Google sign-up failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream/60 via-white to-skysoft/40 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-base-100 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-base-200 p-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-base-content mb-1">
              Create your account
            </h1>
            <p className="text-xs text-base-content/60">
              {!otpSent
                ? "Enter your details to get started."
                : !otpVerified
                ? "Enter the 6-digit code sent to your email."
                : "Email verified. Complete your registration below."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text">Full name</span>
              </label>

              <div className="relative">
                <FiUser
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                />

                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full pl-10 text-sm"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-control">
              <div className="flex items-center justify-between pb-1.5">
                <label className="label-text">Email address</label>
                {otpVerified ? (
                  <span className="badge badge-success badge-sm gap-1 text-white">
                    <FiCheckCircle size={12} /> Verified
                  </span>
                ) : otpSent ? (
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs text-primarydeep hover:underline"
                  >
                    Change email
                  </button>
                ) : null}
              </div>

              <div className="relative">
                <FiMail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="input input-bordered w-full pl-10 text-sm"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={otpSent}
                />
              </div>
            </div>

            {/* 6-Digit Email OTP Verification Box (shown when OTP is sent & not yet verified) */}
            {otpSent && !otpVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-skysoft/20 p-4 rounded-xl border border-sky/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primarydeep flex items-center gap-1.5">
                    <FiShield size={14} /> 6-Digit Verification Code
                  </label>
                  {resendCountdown > 0 ? (
                    <span className="text-[11px] text-base-content/50">
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-[11px] text-primarydeep font-semibold hover:underline"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="input input-bordered w-full text-center text-lg tracking-[0.4em] font-mono font-bold"
                  placeholder="123456"
                  disabled={loading}
                />

                <p className="text-[11px] text-base-content/60 text-center">
                  Check your inbox and spam folder for the 6-digit code.
                </p>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="btn btn-sm btn-primary w-full"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </motion.div>
            )}

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                <FiLock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="input input-bordered w-full pl-10 pr-10 text-sm"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text">
                  Profile photo{" "}
                  <span className="text-base-content/40 font-normal">
                    (optional)
                  </span>
                </span>
              </label>

              <div className="flex items-center gap-3">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-sky/40 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center flex-shrink-0">
                    <FiUser
                      size={18}
                      className="text-base-content/30"
                    />
                  </div>
                )}

                <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-1.5 border-dashed border-base-300 hover:border-sky cursor-pointer transition-colors group">
                  <FiUpload
                    size={15}
                    className="text-base-content/40 group-hover:text-sky transition-colors"
                  />

                  <span className="text-sm text-base-content/50 group-hover:text-base-content/70 transition-colors truncate">
                    {formData.photoFile
                      ? formData.photoFile.name
                      : "Choose a photo"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Action Button */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !formData.email}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Send Verification Code"
                )}
              </button>
            ) : !otpVerified ? (
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Verify Code & Continue"
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          </form>

          <div className="divider my-5 text-xs">
            OR CONTINUE WITH
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline w-full gap-2 text-sm"
          >
            <FcGoogle size={20} />
            Google
          </button>

          <p className="text-center text-sm text-base-content/50 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primarydeep font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
