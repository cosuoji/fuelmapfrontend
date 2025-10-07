import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, addBadge, removeBadge } from "../services/authService";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBadge = async (userId) => {
    try {
      await addBadge(userId, "Verified ✅"); // default for now
      toast.success("Badge added!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to add badge");
    }
  };

  const handleRemoveBadge = async (userId, badge) => {
    try {
      await removeBadge(userId, badge);
      toast.success("Badge removed!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to remove badge");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Badges</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.isAdmin ? "Admin" : "User"}</td>
              <td className="p-2 border">
                {u.badges?.length > 0 ? (
                  u.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mr-1"
                    >
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No badges</span>
                )}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleAddBadge(u._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  + Badge
                </button>
                {u.badges?.map((b, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveBadge(u._id, b)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600"
                  >
                    Remove {b}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
