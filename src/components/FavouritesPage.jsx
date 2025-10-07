import { useEffect, useState } from "react";
import { getAllStations } from "../services/stationService";
import { Heart } from "lucide-react";

export default function FavouritesPage() {
  const [stations, setStations] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    // Load all stations and filter by favourites
    const data = await getAllStations({ limit: 100 }); // adjust limit as needed
    const favStations = data.stations.filter((s) => favourites.includes(s._id));
    setStations(favStations);
  };

  const toggleFavourite = (id) => {
    setFavourites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
    // Refresh stations list
    setStations((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">⭐ Your Favourites</h2>

      {stations.length === 0 ? (
        <p className="text-gray-500">You have no favourite stations yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((s) => {
            const latest = s.prices?.slice(-1)[0];
            return (
              <div
                key={s._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative"
              >
                <button
                  onClick={() => toggleFavourite(s._id)}
                  className="absolute top-3 right-3"
                >
                  <Heart
                    size={22}
                    className="fill-red-500 text-red-500"
                  />
                </button>

                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.fuelType || "N/A"}</p>
                <p className="text-blue-600 font-bold mt-2">
                  ₦{latest?.price || "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
