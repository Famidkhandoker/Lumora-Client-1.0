// // src/contexts/AuthContext.jsx
// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth";
// import { auth } from "../utilits/firebase.config";
// import axios from "../utilits/axiosInstance";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const googleProvider = new GoogleAuthProvider();

//   // Register user
//   const registerUser = async (email, password, displayName, photoURL) => {
//     setLoading(true);
//     const result = await createUserWithEmailAndPassword(auth, email, password);

//     await updateProfile(result.user, {
//       displayName,
//       photoURL,
//     });
//     await sendEmailVerification(result.user);
//     // Save user to database
//     await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
//       email: result.user.email,
//       displayName,
//       photoURL,
//       role: "user",
//     });

//     return result;
//   };

//   Login user
//   const loginUser = (email, password) => {
//     setLoading(true);
//     return signInWithEmailAndPassword(auth, email, password);
//   };

  

//   // Google login
//   const googleLogin = async () => {
//     setLoading(true);
//     const result = await signInWithPopup(auth, googleProvider);

//     // Save user to database if new
//     await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
//       email: result.user.email,
//       displayName: result.user.displayName,
//       photoURL: result.user.photoURL,
//       role: "user",
//     });

//     return result;
//   };

//   // Logout user
//   const logoutUser = () => {
//     setLoading(true);
//     localStorage.removeItem("lumora-token");
//     return signOut(auth);
//   };

//   // Get JWT token
//   const getToken = useCallback(async (email) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/jwt`,
//       { email }
//     );
//     localStorage.setItem("lumora-token", data.token);
//     return data.token;
//   }, []);

//   // Fetch user role
//   const fetchUserRole = useCallback(async (email) => {
//     try {
//       console.log("fetchUserRole - Fetching role for:", email);
//       const token = localStorage.getItem("lumora-token");
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/users/${email}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("fetchUserRole - User data:", data);
//       console.log("fetchUserRole - Setting role to:", data?.role || "user");
//       setUserRole(data?.role || "user");
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//       console.log("fetchUserRole - Setting default role: user");
//       setUserRole("user");
//     }
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (currentUser) {
//         await getToken(currentUser.email);
//         await fetchUserRole(currentUser.email);
//       } else {
//         setUserRole(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [getToken, fetchUserRole]);



//   const authInfo = {
//     user,
//     userRole,
//     loading,
//     registerUser,
//     loginUser,
//     googleLogin,
//     logoutUser,
//     setLoading,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
//   );
// };




// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
//   sendEmailVerification,
// } from "firebase/auth";

// import { auth } from "../utilits/firebase.config";
// import axios from "../utilits/axiosInstance";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Prevent auth listener from interfering with registration
//   const isRegistering = useRef(false);

//   const googleProvider = new GoogleAuthProvider();

//   // Register user with email verification
//   const registerUser = async (
//     email,
//     password,
//     displayName,
//     photoURL
//   ) => {
//     setLoading(true);
//     isRegistering.current = true;

//     try {
//       const result = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       await updateProfile(result.user, {
//         displayName,
//         photoURL,
//       });

//       // Send verification link to the user's email
//       await sendEmailVerification(result.user);

//       // Save user information to MongoDB
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/users`,
//         {
//           email: result.user.email,
//           displayName,
//           photoURL,
//           role: "user",
//         }
//       );

//       // Log out until the user verifies their email
//       await signOut(auth);

//       return result;
//     } catch (error) {
//       // Clean up an unverified Firebase session after failure
//       if (auth.currentUser && !auth.currentUser.emailVerified) {
//         await signOut(auth).catch(() => {});
//       }

//       throw error;
//     } finally {
//       isRegistering.current = false;
//       setLoading(false);
//     }
//   };

//   // Login with email and password
//   const loginUser = async (email, password) => {
//     setLoading(true);

//     try {
//       const result = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       // Refresh verification status from Firebase
//       await result.user.reload();

//       if (!result.user.emailVerified) {
//         await signOut(auth);

//         throw new Error(
//           "Please verify your email before logging in."
//         );
//       }

//       return result;
//     } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//   };

//   // Login with Google
//   const googleLogin = async () => {
//     setLoading(true);

//     try {
//       const result = await signInWithPopup(auth, googleProvider);

//       // Save or update user information in MongoDB
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/users`,
//         {
//           email: result.user.email,
//           displayName: result.user.displayName,
//           photoURL: result.user.photoURL,
//           role: "user",
//         }
//       );

//       return result;
//     } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//   };

//   // Logout user
//   const logoutUser = async () => {
//     setLoading(true);
//     localStorage.removeItem("lumora-token");

//     try {
//       await signOut(auth);
//       setUser(null);
//       setUserRole(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get JWT token
//   const getToken = useCallback(async (email) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/jwt`,
//       { email }
//     );

//     localStorage.setItem("lumora-token", data.token);

//     return data.token;
//   }, []);

//   // Fetch user role from MongoDB
//   const fetchUserRole = useCallback(async (email) => {
//     try {
//       const token = localStorage.getItem("lumora-token");

//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/users/${email}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUserRole(data?.role || "user");
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//       setUserRole("user");
//     }
//   }, []);

//   // Track Firebase authentication state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       // Do not interfere while registration is running
//       if (isRegistering.current) {
//         return;
//       }

//       try {
//         if (!currentUser) {
//           localStorage.removeItem("lumora-token");
//           setUser(null);
//           setUserRole(null);
//           return;
//         }

//         // Refresh the user's current Firebase status
//         await currentUser.reload();

//         // Block unverified email/password accounts
//         if (
//           currentUser.providerData.some(
//             (provider) => provider.providerId === "password"
//           ) &&
//           !currentUser.emailVerified
//         ) {
//           localStorage.removeItem("lumora-token");
//           setUser(null);
//           setUserRole(null);

//           await signOut(auth);
//           return;
//         }

//         setUser(auth.currentUser);

//         await getToken(currentUser.email);
//         await fetchUserRole(currentUser.email);
//       } catch (error) {
//         console.error("Authentication error:", error);

//         localStorage.removeItem("lumora-token");
//         setUser(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [getToken, fetchUserRole]);

//   const authInfo = {
//     user,
//     userRole,
//     loading,
//     registerUser,
//     loginUser,
//     googleLogin,
//     logoutUser,
//     setLoading,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




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
  sendEmailVerification,
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

  // Register normal user and send verification link
  const registerUser = async (
    email,
    password,
    displayName,
    photoURL
  ) => {
    setLoading(true);
    isRegistering.current = true;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName,
        photoURL,
      });

      await sendEmailVerification(result.user);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          email: result.user.email,
          displayName,
          photoURL,
          role: "user",
        }
      );

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

      // Only normal users must verify their email
      if (role !== "admin" && !result.user.emailVerified) {
        await signOut(auth);
        localStorage.removeItem("lumora-token");
        setUser(null);
        setUserRole(null);

        throw new Error(
          "Please verify your email using the link sent to your inbox."
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








// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth";

// import { auth } from "../utilits/firebase.config";
// import axios from "../utilits/axiosInstance";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Prevent the auth listener from interfering with registration.
//   const isRegistering = useRef(false);

//   const googleProvider = new GoogleAuthProvider();

//   // Step 1: Send OTP to the user's email.
//   const requestEmailOtp = async (email) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/email-otp/send`,
//       {
//         email: email.trim().toLowerCase(),
//       }
//     );

//     return data;
//   };

//   // Step 2: Verify the 6-digit OTP.
//   const verifyEmailOtp = async (email, otp) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/email-otp/verify`,
//       {
//         email: email.trim().toLowerCase(),
//         otp: String(otp).trim(),
//       }
//     );

//     return data;
//   };

//   // Step 3: Create account after the OTP has been verified.
//   const registerUser = async (email, password, displayName, photoURL) => {
//     setLoading(true);
//     isRegistering.current = true;

//     try {
//       const normalizedEmail = email.trim().toLowerCase();

//       const result = await createUserWithEmailAndPassword(
//         auth,
//         normalizedEmail,
//         password
//       );

//       await updateProfile(result.user, {
//         displayName,
//         photoURL,
//       });

//       // Complete OTP verification through the backend.
//       const firebaseIdToken = await result.user.getIdToken(true);

//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/email-otp/complete`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${firebaseIdToken}`,
//           },
//         }
//       );

//       // Refresh the Firebase user's email verification status.
//       await result.user.reload();

//       const currentUser = auth.currentUser;

//       if (!currentUser?.emailVerified) {
//         throw new Error(
//           "Email verification was not completed. Please try again."
//         );
//       }

//       // Save the verified user in MongoDB.
//       await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
//         email: currentUser.email,
//         displayName,
//         photoURL,
//         role: "user",
//       });

//       setUser(currentUser);

//       // Keep the existing Lumora JWT and role functionality.
//       await getToken(currentUser.email);
//       await fetchUserRole(currentUser.email);

//       return result;
//     } catch (error) {
//       // Do not leave an unverified email/password account signed in.
//       if (auth.currentUser && !auth.currentUser.emailVerified) {
//         await signOut(auth).catch(() => {});
//       }

//       throw error;
//     } finally {
//       isRegistering.current = false;
//       setLoading(false);
//     }
//   };

//   // Login with email and password.
//   const loginUser = async (email, password) => {
//     setLoading(true);

//     try {
//       const result = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       await result.user.reload();

//       if (!auth.currentUser?.emailVerified) {
//         await signOut(auth);

//         throw new Error(
//           "Please verify your email before logging in."
//         );
//       }

//       return result;
//     } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//   };

//   // Google login: keep the existing functionality.
//   const googleLogin = async () => {
//     setLoading(true);

//     try {
//       const result = await signInWithPopup(auth, googleProvider);

//       await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
//         email: result.user.email,
//         displayName: result.user.displayName,
//         photoURL: result.user.photoURL,
//         role: "user",
//       });

//       return result;
//     } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//   };

//   // Logout.
//   const logoutUser = async () => {
//     setLoading(true);
//     localStorage.removeItem("lumora-token");

//     try {
//       await signOut(auth);
//       setUser(null);
//       setUserRole(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get the existing Lumora JWT.
//   const getToken = useCallback(async (email) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/jwt`,
//       { email }
//     );

//     localStorage.setItem("lumora-token", data.token);

//     return data.token;
//   }, []);

//   // Fetch user role from MongoDB.
//   const fetchUserRole = useCallback(async (email) => {
//     try {
//       const token = localStorage.getItem("lumora-token");

//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/users/${email}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUserRole(data?.role || "user");
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//       setUserRole("user");
//     }
//   }, []);

//   // Track Firebase authentication state.
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       // Avoid interfering with the registration process.
//       if (isRegistering.current) return;

//       try {
//         if (!currentUser) {
//           localStorage.removeItem("lumora-token");
//           setUser(null);
//           setUserRole(null);
//           return;
//         }

//         await currentUser.reload();

//         const refreshedUser = auth.currentUser;

//         // Block unverified email/password accounts.
//         if (
//           refreshedUser?.providerData.some(
//             (provider) => provider.providerId === "password"
//           ) &&
//           !refreshedUser.emailVerified
//         ) {
//           localStorage.removeItem("lumora-token");
//           setUser(null);
//           setUserRole(null);

//           await signOut(auth);
//           return;
//         }

//         setUser(refreshedUser);

//         await getToken(refreshedUser.email);
//         await fetchUserRole(refreshedUser.email);
//       } catch (error) {
//         console.error("Authentication error:", error);

//         localStorage.removeItem("lumora-token");
//         setUser(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [getToken, fetchUserRole]);

//   const authInfo = {
//     user,
//     userRole,
//     loading,
//     requestEmailOtp,
//     verifyEmailOtp,
//     registerUser,
//     loginUser,
//     googleLogin,
//     logoutUser,
//     setLoading,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };