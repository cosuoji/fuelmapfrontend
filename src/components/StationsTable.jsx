import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getStations,
  getFlaggedStations,
  updateStationPrice,
  deleteStation,
} from "../services/adminStationService";

export default function StationsTable() {
  const [stations, setStations] = useState([]);
  const [viewFlagged, setViewFlagged] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [newPrice, setNewPrice] = useState({ petrol: "", diesel: "", gas: "" });

  useEffect(() => {
    fetchStations();
  }, [viewFlagged]);

console.log(stations)

  const fetchStations = async () => {
    try {
      const data = viewFlagged ? await getFlaggedStations() : await getStations();
      setStations(data);
    } catch (err) {
      toast.error("Failed to fetch stations");
    }
  };

  const handleEditClick = (station) => {
    setEditingStation(station);
    setNewPrice({
      petrol: station.prices?.petrol || "",
      diesel: station.prices?.diesel || "",
      gas: station.prices?.gas || "",
    });
  };

  const handleSavePrice = async () => {
    try {
      await updateStationPrice(editingStation._id, newPrice);
      toast.success("Prices updated!");
      setEditingStation(null);
      fetchStations();
    } catch (err) {
      toast.error("Failed to update prices");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteStation(id);
      toast.success("Station deleted!");
      fetchStations();
    } catch (err) {
      toast.error("Failed to delete station");
    }
  };

  const renderLocation = (loc) => {
    if (!loc) return "N/A";
    if (typeof loc === "string") return loc;
    if (typeof loc === "object" && loc.coordinates) {
      return `Lat: ${loc.coordinates[1]?.toFixed(4)}, Lng: ${loc.coordinates[0]?.toFixed(4)}`;
    }
    return JSON.stringify(loc);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Manage Stations</h2>
        <button
          onClick={() => setViewFlagged(!viewFlagged)}
          className={`px-4 py-2 rounded ${
            viewFlagged
              ? "bg-gray-300 text-black"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          {viewFlagged ? "View All Stations" : "View Flagged Stations"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Prices (₦)</th>
            <th className="p-2 border">Flags</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{renderLocation(s.location)}</td>
              <td className="p-2 border">
                <div className="text-sm">
                  <div>Petrol: ₦{s.prices?.petrol ?? "—"}</div>
                  <div>Diesel: ₦{s.prices?.diesel ?? "—"}</div>
                  <div>Gas: ₦{s.prices?.gas ?? "—"}</div>
                </div>
              </td>
              <td className="p-2 border text-center">
                {s.flags?.length > 0 ? (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                    {s.flags.length} reports
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">None</span>
                )}
              </td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => handleEditClick(s)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit Price
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {stations.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No stations found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Price Modal */}
      {editingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Edit Prices — {editingStation.name}
            </h3>
            {["petrol", "diesel", "gas"].map((fuel) => (
              <div key={fuel} className="mb-3">
                <label className="block text-sm font-medium capitalize mb-1">
                  {fuel} (₦)
                </label>
                <input
                  type="number"
                  className="border rounded w-full p-2"
                  value={newPrice[fuel]}
                  onChange={(e) =>
                    setNewPrice({ ...newPrice, [fuel]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditingStation(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
