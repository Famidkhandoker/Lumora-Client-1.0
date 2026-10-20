
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import axios from "../utilits/axiosInstance";
import { FiSearch, FiFilter } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/service-categories`
        );
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category !== "all") params.append("category", category);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sort) params.append("sort", sort);
        params.append("page", currentPage);
        params.append("limit", 12);

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/services?${params.toString()}`
        );

        setServices(data.services);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search, category, minPrice, maxPrice, sort, currentPage]);

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8a80310] via-[#fbbf2420] to-[#fcd34d10] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-[#e8a803] to-[#f59e0b] bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the perfect decoration package for your special occasion
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-10 text-sm"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min price (BDT)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input input-bordered w-full text-sm"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max price (BDT)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input input-bordered w-full text-sm"
            />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered w-full text-sm"
            >
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={handleReset} className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-base-content">
              <FiFilter size={14} /> Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-xl">
                <Skeleton height={200} />
                <div className="card-body">
                  <Skeleton count={3} />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No services found</p>
            <button onClick={handleReset} className="btn btn-primary mt-4">
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => {
              const handleMouseEnter = () => {
                if (cardRefs.current[index]) {
                  gsap.to(cardRefs.current[index], {
                    y: -15,
                    scale: 1.03,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                    duration: 0.5,
                    ease: "power3.out",
                  });
                }
              };

              const handleMouseLeave = () => {
                if (cardRefs.current[index]) {
                  gsap.to(cardRefs.current[index], {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                    duration: 0.5,
                    ease: "power3.out",
                  });
                }
              };

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}

                >
                  <Link to={`/services/${service._id}`}>
                    <div
                      ref={(el) => (cardRefs.current[index] = el)}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="card p-4 rounded-2xl bg-base-100 shadow-xl group h-full"
                      style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                    >
                      <figure className="relative h-48 overflow-hidden">
                        <img
                          src={
                            service.image ||
                            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600"
                          }
                          alt={service.service_name}
                          className="w-full roun h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                          <span className="text-xs font-bold text-[#e8a803]">
                            {service.service_category}
                          </span>
                        </div>
                      </figure>
                      <div className="card-body ">
                        <h3 className="card-title text-lg">
                          {service.service_name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 poppins-regular">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="text-xl font-bold text-[#e8a803]">
                              BDT {service.cost}
                            </span>
                            <span className="text-xs text-gray-500">
                              /{service.unit}
                            </span>
                          </div>
                          <button className="btn btn-sm bg-gradient-to-r from-[#e8a803] to-[#f59e0b] text-white border-none hover:shadow-lg">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="join-item btn"
              >
                «
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="join-item btn"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
