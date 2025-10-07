import { useContext, useEffect, useState } from "react";
import { getAllStations, getNearbyStations, reportPrice } from "../services/stationService";
import { Heart } from "lucide-react";
import { FaFacebook, FaXTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa6";
import { useSEO } from "../components/useSEO";

// Reusable filter inputs
function StationFilters({ filters, onChange }) {
  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        name="name"
        placeholder="Search by name"
        value={filters.name}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />

      <select
        name="fuelType"
        value={filters.fuelType}
        onChange={onChange}
        className="border p-2 rounded w-full"
      >
        <option value="">All Fuel Types</option>
        <option value="PMS">PMS (Petrol)</option>
        <option value="AGO">AGO (Diesel)</option>
        <option value="DPK">DPK (Kerosene)</option>
      </select>

      <div className="flex space-x-2">
        <input
          type="number"
          name="minPrice"
          placeholder="Min ₦"
          value={filters.minPrice}
          onChange={onChange}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max ₦"
          value={filters.maxPrice}
          onChange={onChange}
          className="border p-2 rounded w-1/2"
        />
      </div>
    </div>
  );
}



export default function FuelStationsCards() {
  const [stations, setStations] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    fuelType: "",
    name: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [expandedId, setExpandedId] = useState(null);
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  const [loadingNearby, setLoadingNearby] = useState(false);

const handleSearchNearby = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  setLoadingNearby(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { longitude, latitude } = position.coords;
      try {
        const data = await getNearbyStations(longitude, latitude);
        setStations(data);
        setPagination({ page: 1, pages: 1 }); // Reset pagination for nearby results
      } catch (error) {
        console.error("Error fetching nearby stations:", error);
        alert("Could not fetch nearby stations.");
      } finally {
        setLoadingNearby(false);
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Unable to get your location.");
      setLoadingNearby(false);
    }
  );
};

 useSEO({
    title: "Stations - Fuel Price Directory",
    description: "Compare fuel prices and find the nearest stations in Nigeria.",
    keywords: "fuel stations, petrol price, diesel, nearest station, Nigeria fuel",
    image: "",
  });

  const handleClearFilters = () => {
  setFilters({
    page: 1,
    limit: 20,
    fuelType: "",
    name: "",
    minPrice: "",
    maxPrice: "",
  });
  setPagination({ page: 1, pages: 1 });
  loadStations();
};



  useEffect(() => {
    loadStations();
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const loadStations = async () => {
    const data = await getAllStations(filters);
    setStations(data.stations);
    setPagination({ page: data.page, pages: data.pages });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };


  const handleReportPrice = async (stationId, priceId) => {
  if (!stationId || !priceId) {
    alert("Invalid price entry.");
    return;
  }

  const confirmReport = window.confirm(
    "Are you sure you want to report this price as incorrect?"
  );
  if (!confirmReport) return;

  try {
    const res = await reportPrice({ stationId, priceId });
    alert("Price reported successfully. Thank you!");
  } catch (err) {
    console.error("Error reporting price:", err);
    alert(err.response?.data?.error || "Could not report price.");
  }
};



  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 w-full">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          Stations
          {loadingNearby && (
            <span className="text-sm text-gray-500 animate-pulse">Finding nearby...</span>
          )}
        </h2>
        {/* Search Nearby Button */}
        {/* Search Nearby + Clear Filters Buttons */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={handleSearchNearby}
            disabled={loadingNearby}
            className={`${
              loadingNearby
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded shadow`}
          >
            {loadingNearby ? "Searching..." : "Search Nearby"}
          </button>

          <button
            onClick={handleClearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
          >
            Clear Filters
          </button>
        </div>


        {/* Filters */}
        <StationFilters filters={filters} onChange={handleFilterChange} />

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((s) => {
            const latest = s.prices?.slice(-1)[0];
            const isFav = favourites.includes(s._id);

            return (
              <div
                key={s._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative"
              >
                {/* Heart (Favourite) button */}
                <button
                  onClick={() => toggleFavourite(s._id)}
                  className="absolute top-1 right-1 mr-2"
                >
                  <Heart
                    size={22}
                    className={`${
                      isFav ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Card header */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h3 className="text-lg font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-500">
                      {s.prices?.length
                        ? [...new Set(s.prices.map((p) => p.fuelType))].join(", ")
                        : "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Address:</span>{" "}
                      <span className="text-xs">{s.address || "N/A"}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">
                      ₦{latest?.price || "N/A"}
                    </p>
                    <button
                      onClick={() => toggleExpand(s._id)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      {expandedId === s._id ? "Hide" : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Expandable details */}
                {expandedId === s._id && (
                  <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-700 relative pb-10">
                    <p>
                      <span className="font-semibold">Queue:</span>{" "}
                      <span className="text-gray-500">
                        {s.prices?.length
                          ? (() => {
                              const latest = s.prices
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt) - new Date(a.updatedAt)
                                )[0];
                              const status = latest?.queueStatus || "N/A";
                              return (
                                status.charAt(0).toUpperCase() +
                                status.slice(1).toLowerCase()
                              );
                            })()
                          : "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Updated At:</span>{" "}
                      <span className="text-gray-500">
                        {s.prices?.length
                          ? (() => {
                              const latest = s.prices
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt) - new Date(a.updatedAt)
                                )[0];
                              return new Date(latest.updatedAt).toLocaleString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              );
                            })()
                          : "N/A"}
                      </span>
                    </p>

                    {/* Share Buttons - only visible when expanded */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-gray-100 p-1 rounded-full shadow-sm">
                      {/* Report Button */}
                      <button
                        onClick={() => handleReportPrice(s._id, latest?._id)}
                        title="Report incorrect price"
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        ⚠️
                      </button>
                      <a
                        href={`https://x.com/intent/tweet?text=Check out ${encodeURIComponent(
                          s.name
                        )} fuel station at ${encodeURIComponent(
                          s.address || "N/A"
                        )} — Price: ₦${
                          latest?.price || "N/A"
                        } per litre!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        <FaXTwitter size={16} />
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}&quote=Check out ${s.name} fuel station at ${
                          s.address || "N/A"
                        } — Price: ₦${latest?.price || "N/A"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        <FaFacebook size={16} />
                      </a>

                      <a
                        href={`https://api.whatsapp.com/send?text=Check out ${encodeURIComponent(
                          s.name
                        )} fuel station at ${encodeURIComponent(
                          s.address || "N/A"
                        )} — Price: ₦${latest?.price || "N/A"} per litre.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-500"
                      >
                        <FaWhatsapp size={16} />
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700"
                      >
                        <FaLinkedin size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={pagination.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
