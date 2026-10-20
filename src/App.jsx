import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { router } from "./routes/Routes";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import PromoModal from "./components/PromoModal";

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <RouterProvider router={router} />
        <PromoModal />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
