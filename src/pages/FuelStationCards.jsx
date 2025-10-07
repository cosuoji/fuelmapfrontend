import { useEffect, useState } from "react";
import { getAllStations } from "../services/stationService";
import { Heart } from "lucide-react";

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
    maxPrice: ""
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [expandedId, setExpandedId] = useState(null);
  const [favourites, setFavourites] = useState(() => {
    // load favourites from localStorage
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

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

  console.log(stations)

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 w-full">
        <h2 className="text-2xl font-bold mb-4">Stations</h2>

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
                  <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {s.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Open:</span>{" "}
                      {s.openingHours || "Not available"}
                    </p>
                    <p>
                      <span className="font-semibold">Queue:</span>{" "}
                      <span className="text-gray-500">
                        {s.prices?.length
                          ? (() => {
                              const latest = s.prices
                                .slice()
                                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
                              const status = latest?.queueStatus || "N/A";
                              return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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
                                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
                              return new Date(latest.updatedAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                            })()
                          : "N/A"}
                      </span>
                    </p>

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
