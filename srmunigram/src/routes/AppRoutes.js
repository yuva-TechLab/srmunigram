import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Feed from "../pages/Feed";
import UserProfile from "../pages/UserProfile";
import VerifyOTP from "../pages/VerifyOTP";
import ForgotPassword from "../pages/ForgotPassword";
import EditProfile from "../pages/EditProfile"; // ✅ import EditProfile
import Notifications from "../pages/Notifications"; // ✅ import EditProfile
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/feed" element={<Feed />} />
     <Route path="/notifications" element={<Notifications />} />
      {/* Dynamic profile route */}
      <Route path="/profile/:userId" element={<UserProfile />} />

      {/* Edit Profile route */}
      <Route path="/edit-profile/:userId" element={<EditProfile />} />
    </Routes>
  );
}

export default AppRoutes;