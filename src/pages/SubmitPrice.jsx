import { useState } from "react";
import { toast } from "react-toastify";
import { addPrice, searchStations } from "../services/stationService";

export default function SubmitPrice() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    price: "",
    fuelType: "PMS",
    queueStatus: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ local: [], external: [] });
  const [selectedStation, setSelectedStation] = useState(null);

  const handleSearch = async () => {
    if (!form.name || !form.address) {
      toast.error("Enter station name and address first");
      return;
    }

    setLoading(true);
    try {
      const res = await searchStations(form.name, form.address);
      if (!res.local.length && !res.external.length)
        toast.info("No matches found nearby");
      setResults(res);
    } catch (err) {
      toast.error("Failed to search stations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || (!form.name && !selectedStation)) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        name: selectedStation?.name || form.name,
        address: selectedStation?.address || form.address,
        coordinates: selectedStation?.lat
          ? [selectedStation.lon, selectedStation.lat]
          : undefined,
      };

      await addPrice(payload);
      toast.success("✅ Price submitted successfully!");
      setForm({
        name: "",
        address: "",
        price: "",
        fuelType: "PMS",
        queueStatus: "",
      });
      setResults({ local: [], external: [] });
      setSelectedStation(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to submit price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Submit Fuel Price</h2>

      {/* Station Input */}
      <input
        type="text"
        placeholder="Station Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-3 rounded mb-2"
      />
      <input
        type="text"
        placeholder="Station Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full border p-3 rounded mb-2"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="w-full bg-gray-200 py-2 rounded mb-3"
        disabled={loading}
      >
        {loading ? "Searching..." : "Find Nearby Stations"}
      </button>

      {/* Search Results */}
      {(results.local.length > 0 || results.external.length > 0) && (
        <div className="border p-3 rounded mb-3 space-y-3">
          {results.local.length > 0 && (
            <>
              <p className="font-medium">Stations in FuelMap:</p>
              {results.local.map((s) => (
                <div
                  key={s._id}
                  onClick={() => setSelectedStation(s)}
                  className={`p-2 rounded mb-2 cursor-pointer ${
                    selectedStation?._id === s._id
                      ? "bg-blue-100 border-blue-400 border"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-gray-600">{s.address}</p>
                </div>
              ))}
            </>
          )}

          {results.external.length > 0 && (
            <>
              <p className="font-medium mt-2">Stations from Map Data:</p>
              {results.external.map((s) => (
                <div
                  key={s.address}
                  onClick={() => setSelectedStation(s)}
                  className={`p-2 rounded mb-2 cursor-pointer ${
                    selectedStation?.address === s.address
                      ? "bg-green-100 border-green-400 border"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-gray-600">{s.address}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Price Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="Price (₦ per litre)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-3 rounded"
        />
        <select
          value={form.fuelType}
          onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
          className="w-full border p-3 rounded"
        >
          <option value="PMS">PMS (Petrol)</option>
          <option value="AGO">AGO (Diesel)</option>
          <option value="DPK">DPK (Kerosene)</option>
        </select>
        <select
          value={form.queueStatus}
          onChange={(e) => setForm({ ...form, queueStatus: e.target.value })}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Queue Status</option>
          <option value="no queue">No Queue</option>
          <option value="short">Short</option>
          <option value="long">Long</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Price"}
        </button>
      </form>
    </div>
  );
}
