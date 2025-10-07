import { useEffect, useState } from "react";
import { useSEO } from "../components/useSEO";


export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage or your global store
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

   useSEO({
    title: "Homepage - Fuel Price Directory",
    description: "Compare fuel prices and find the nearest stations in Nigeria.",
    keywords: "fuel stations, petrol price, diesel, nearest station, Nigeria fuel",
    image: "",
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Fuel Price Directory ⛽</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Track fuel prices near you, submit price updates, and stay informed.
        </p>
        <a
          href="/stations"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
        >
          View Stations
        </a>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📍 Find Stations</h3>
          <p className="text-gray-600">
            Browse nearby fuel stations and compare prices in your area.
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📝 Submit Prices</h3>
          <p className="text-gray-600">
            Contribute by uploading verified fuel prices for others to see.
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">⭐ Community Driven</h3>
          <p className="text-gray-600">
            Earn trust badges as a verified or top contributor in your community.
          </p>
        </div>
      </section>

      {/* Call to Action — hidden if logged in */}
      {!user && (
        <section className="bg-blue-50 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to join the Fuel Price Watch community?
          </h2>
          <a
            href="/signup"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700"
          >
            Get Started
          </a>
        </section>
      )}
    </div>
  );
}
