import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "../utilits/firebase.config";
import axios from "../utilits/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRegistering = useRef(false);
  const googleProvider = new GoogleAuthProvider();

  // 1. Request Email OTP (for normal user registration)
  const requestEmailOtp = async (email) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/email-otp/send`, {
      email,
    });
  };

  // 2. Verify Email OTP
  const verifyEmailOtp = async (email, otp) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/email-otp/verify`, {
      email,
      otp,
    });
  };

  // 3. Register normal user and complete email verification via Firebase Admin SDK
  const registerUser = async (
    email,
    password,
    displayName,
    photoURL
  ) => {
    setLoading(true);
    isRegistering.current = true;

    try {
      // Create user in Firebase Authentication
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Update Firebase profile
      await updateProfile(result.user, {
        displayName,
        photoURL,
      });

      // Complete email verification status via Firebase Admin SDK on the backend
      const idToken = await result.user.getIdToken(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email-otp/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // Save user to MongoDB usersCollection (trusted backend assigns role: "user")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          email: result.user.email,
          displayName,
          photoURL,
          role: "user",
        }
      );

      // Sign out user cleanly so they can log in with their verified account
      await signOut(auth);

      return result;
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Firebase error code:", error.code);
      console.error("Backend error:", error.response?.data);

      if (auth.currentUser) {
        await signOut(auth).catch(() => {});
      }

      throw error;
    } finally {
      isRegistering.current = false;
      setLoading(false);
    }
  };

  // Login with email and password
  const loginUser = async (email, password) => {
    setLoading(true);

    try {
      // Authenticate with Firebase
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await result.user.reload();

      // Get JWT token
      const { data: tokenData } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jwt`,
        {
          email: result.user.email,
        }
      );

      if (!tokenData?.token) {
        throw new Error("Unable to get authentication token.");
      }

      localStorage.setItem("lumora-token", tokenData.token);

      // Get role from MongoDB
      const { data: userData } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${encodeURIComponent(
          result.user.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const role = userData?.role || "user";

      // Only normal users must verify their email. Admin bypasses completely.
      if (role !== "admin" && !result.user.emailVerified) {
        await signOut(auth);
        localStorage.removeItem("lumora-token");
        setUser(null);
        setUserRole(null);

        throw new Error(
          "Please verify your email address with the verification code before logging in."
        );
      }

      setUser(result.user);
      setUserRole(role);

      return result;
    } catch (error) {
      console.error("Login error code:", error.code);
      console.error("Login error message:", error.message);
      console.error("Login backend response:", error.response?.data);

      setLoading(false);
      throw error;
    }
  };

  // Login with Google
  const googleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: "user",
        }
      );

      return result;
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    setLoading(true);

    try {
      await signOut(auth);
      localStorage.removeItem("lumora-token");
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get JWT token
  const getToken = useCallback(async (email) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/jwt`,
      { email }
    );

    if (!data?.token) {
      throw new Error("JWT token was not returned.");
    }

    localStorage.setItem("lumora-token", data.token);

    return data.token;
  }, []);

  // Fetch role from MongoDB
  const fetchUserRole = useCallback(async (email) => {
    const token = localStorage.getItem("lumora-token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const role = data?.role || "user";
    setUserRole(role);

    return role;
  }, []);

  // Monitor Firebase authentication state
  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isRegistering.current) return;

      if (!currentUser) {
        localStorage.removeItem("lumora-token");
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        await currentUser.reload();

        const refreshedUser = auth.currentUser;

        if (!refreshedUser) return;

        // Load the existing role before enforcing verification
        const token = await getToken(refreshedUser.email);

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/${encodeURIComponent(
            refreshedUser.email
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const role = data?.role || "user";

        // Block unverified normal users, but allow admin
        if (role !== "admin" && !refreshedUser.emailVerified) {
          localStorage.removeItem("lumora-token");
          setUser(null);
          setUserRole(null);

          await signOut(auth);
          return;
        }

        if (!active) return;

        setUser(refreshedUser);
        setUserRole(role);
      } catch (error) {
        console.error("Authentication initialization error:", error);

        if (active) {
          localStorage.removeItem("lumora-token");
          setUser(null);
          setUserRole(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [getToken]);

  const authInfo = {
    user,
    userRole,
    loading,
    registerUser,
    requestEmailOtp,
    verifyEmailOtp,
    loginUser,
    googleLogin,
    logoutUser,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
