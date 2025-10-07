import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { toast } from "react-toastify";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const renderBadge = (badge) => {
    switch (badge) {
      case "Verified":
        return "✅ Verified";
      case "Top Contributor":
        return "⭐ Top Contributor";
      default:
        return badge;
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        Fuel Price Directory
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/stations" className="text-gray-700 hover:text-blue-600">Stations</Link>
        <Link to="/submit-price" className="text-gray-700 hover:text-blue-600">Submit Price</Link>

        {user && (
          <Link to="/favourites" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
            <Heart size={18} className="text-red-500" />
            Favourites
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <span className="font-medium">{user.username}</span>
              {user.badges?.map((badge, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                >
                  {renderBadge(badge)}
                </span>
              ))}
            </Link>

            {user.isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col space-y-4 p-4 md:hidden z-50">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/stations" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Stations
          </Link>
          <Link to="/submit-price" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Submit Price
          </Link>

          {user && (
            <Link
              to="/favourites"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 flex items-center gap-1"
            >
              <Heart size={18} className="text-red-500" />
              Favourites
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <span className="font-medium">{user.username}</span>
                {user.badges?.map((badge, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                  >
                    {renderBadge(badge)}
                  </span>
                ))}
              </Link>

              {user.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
