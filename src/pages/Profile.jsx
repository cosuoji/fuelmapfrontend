import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useAuth } from "../store/useAuth";
import { toast } from "react-toastify";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        toast.error("Failed to fetch profile");
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!profile) return <p>No profile data</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Reputation:</strong> {profile.reputation}</p>
        <p><strong>Contributions:</strong> {profile.contributions}</p>
        <p><strong>Verified Contributions:</strong> {profile.verifiedContributions}</p>
        <p><strong>Trust Level:</strong> {profile.trustLevel}</p>
        <p>
          <strong>Role:</strong>{" "}
          <span className={profile.isAdmin ? "text-red-500 font-semibold" : "text-blue-600"}>
            {profile.isAdmin ? "Admin" : "User"}
          </span>
        </p>
      </div>

      {/* 🏅 Badges Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Badges</h3>
        {profile.badges?.length ? (
          <ul className="space-y-1 list-disc list-inside">
            {profile.badges.map((badge) => (
              <li key={badge.key}>
                <span className="font-medium">{badge.name}</span>{" "}
                <span className="text-gray-500 text-sm">
                  ({new Date(badge.awardedAt).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No badges yet</p>
        )}
      </div>

      {/* 📈 Reputation History */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Reputation History</h3>
        {profile.reputationHistory?.length ? (
          <ul className="space-y-2">
            {profile.reputationHistory.map((entry, index) => (
              <li key={index} className="border-b pb-2">
                <span className="font-medium">
                  {entry.change > 0 ? `+${entry.change}` : entry.change}
                </span>{" "}
                points — <span className="text-gray-600">{entry.reason}</span>{" "}
                <span className="text-gray-400 text-sm">
                  ({new Date(entry.date).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No reputation history</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
