import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import FuelStationsCards from "./pages/FuelStationCards";
import Navbar from "./components/Navbar";
import SubmitPrice from "./pages/SubmitPrice";
import FavouritesPage from "./components/FavouritesPage";
import { useAuth } from "./store/useAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AppFooter from "./components/Footer";
import Feedback from "./pages/Feedback";
import OfflineBanner from "./components/OfflineBanner";

  const savedUser = localStorage.getItem("user");
if (savedUser) useAuth.setState({ user: JSON.parse(savedUser) });



export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
    <Navbar />

      {/* Routes */}
      <div className="p-15">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stations" element={<FuelStationsCards/>} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/feedback" element={<Feedback />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

             <Route
            path="/submit-price"
            element={
              <PrivateRoute>
                <SubmitPrice />
              </PrivateRoute>
            }
          />
               <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard/>
              </AdminRoute>
            }
          />
        </Routes>
        
      </div>
      <OfflineBanner />
      <AppFooter />
    </div>
  );
}
