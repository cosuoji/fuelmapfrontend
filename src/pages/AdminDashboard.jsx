import { useState } from "react";
import UsersTable from "../components/UsersTable";
import StationsTable from "../components/StationsTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
          Admin Panel
        </h2>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          <button
            className={`text-left px-3 py-2 rounded ${
              activeTab === "users" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            👤 Users
          </button>
          <button
            className={`text-left px-3 py-2 rounded ${
              activeTab === "stations" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("stations")}
          >
            ⛽ Stations
          </button>
          <button
            className={`text-left px-3 py-2 rounded ${
              activeTab === "badges" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("badges")}
          >
            🏅 Badges
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-50">
        {activeTab === "users" && <UsersTable />}
        {activeTab === "stations" && <StationsTable />}
        {activeTab === "badges" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Badges</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
