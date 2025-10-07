// src/pages/Offline.jsx
import { WiCloudOffline } from "react-icons/wi";

export default function Offline() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-6">
      <WiCloudOffline className="text-6xl text-gray-500 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">You’re Offline</h1>
      <p className="text-gray-600 max-w-md">
        It looks like you’re not connected to the internet. 
        Don’t worry — you can still view cached stations if available.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
