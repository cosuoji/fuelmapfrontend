import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getStations,
  addStation,
  deleteStation,
} from "../services/authService";

export default function StationsTable() {
  const [stations, setStations] = useState([]);
  const [newStation, setNewStation] = useState({ name: "", location: "" });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      toast.error("Failed to fetch stations");
    }
  };

  const handleAdd = async () => {
    if (!newStation.name || !newStation.location) {
      toast.error("Name & location are required");
      return;
    }
    try {
      await addStation(newStation);
      toast.success("Station added!");
      setNewStation({ name: "", location: "" });
      fetchStations();
    } catch (err) {
      toast.error("Failed to add station");
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Stations</h2>

      {/* Add Station Form */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Station Name"
          className="border p-2 rounded w-1/3"
          value={newStation.name}
          onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded w-1/3"
          value={newStation.location}
          onChange={(e) =>
            setNewStation({ ...newStation, location: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Stations Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s._id} className="border">
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.location}</td>
              <td className="p-2 border text-center">
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
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No stations yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
