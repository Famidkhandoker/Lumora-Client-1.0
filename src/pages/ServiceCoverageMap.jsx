import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { FiMapPin } from "react-icons/fi";

const ServiceCoverageMap = () => {
  const serviceAreas = [
    { name: "Dhaka Central", position: [23.8103, 90.4125], radius: 5000 },
    { name: "Gulshan", position: [23.7808, 90.4172], radius: 3000 },
    { name: "Banani", position: [23.7936, 90.4066], radius: 3000 },
    { name: "Dhanmondi", position: [23.7461, 90.3742], radius: 4000 },
    { name: "Mirpur", position: [23.8223, 90.3654], radius: 5000 },
    { name: "Uttara", position: [23.8759, 90.3795], radius: 5000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream/50 via-skysoft/20 to-peach/40 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Service{" "}
            <span className="bg-gradient-to-r from-sky to-primarydeep bg-clip-text text-transparent">
              Coverage
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We proudly serve these areas across Dhaka. If you&apos;re outside our
            current coverage, contact us for special arrangements!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="h-[600px]">
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {serviceAreas.map((area, index) => (
                <div key={index}>
                  <Marker position={area.position}>
                    <Popup>
                      <div className="text-center">
                        <strong className="text-primarydeep">{area.name}</strong>
                        <br />
                        <span className="text-sm">Service Available</span>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={area.position}
                    radius={area.radius}
                    pathOptions={{
                      color: "var(--lum-accent)",
                      fillColor: "var(--lum-primary)",
                      fillOpacity: 0.12,
                    }}
                  />
                </div>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Service Areas Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {serviceAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-100 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sky to-primarydeep rounded-full flex items-center justify-center">
                  <FiMapPin className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{area.name}</h3>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCoverageMap;
