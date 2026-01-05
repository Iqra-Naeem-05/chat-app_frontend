import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ChatPage from "../pages/ChatPage";
import { RestrictedRoute, RouteAccess } from "../access/RouteAccess";
import ChatWindow from "../components/ChatWindow";
import ProfileEdit from "../pages/ProfileEdit";
import Signup from "../pages/Signup";

function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<RouteAccess> <Navigate to="/chats" replace /> </RouteAccess>} />
        <Route path="/login" element={ <RestrictedRoute> <Login/> </RestrictedRoute>} />
        <Route path="/signup" element={ <RestrictedRoute> <Signup/> </RestrictedRoute>} />
        <Route path="/chats" element={<RouteAccess> <ChatPage/> </RouteAccess>} />
        <Route path="/chats/:id" element={<RouteAccess> <ChatWindow/> </RouteAccess>} />
        <Route path="/profile" element={<RouteAccess> <ProfileEdit/> </RouteAccess>} />
    </Routes>
  )
}

export default AppRoutes