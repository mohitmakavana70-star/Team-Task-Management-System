// components/Navbar.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from full name (e.g., "Mohit Makvana" -> "MM")
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0).toUpperCase() + 
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <img src="https://i.pinimg.com/1200x/9d/79/71/9d79719cabcbd3c17040071a66f07aa4.jpg" alt="Logo" className="h-10 w-10 rounded-full" />
      <h1 className="font-bold text-lg sm:text-xl">TaskManager</h1>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile: Avatar with initials (MM for Mohit Makvana) */}
        <div className="sm:hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-slate-800 shadow-sm">
            {getInitials(user?.name)}
          </div>
        </div>
        
        {/* Desktop: Full name */}
        <div className="hidden sm:flex">
          <span className="text-xs sm:text-sm text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
            {user?.name}
          </span>
        </div>

        <button 
          onClick={handleLogout} 
          className="btn-danger p-2 sm:p-2.5 rounded-lg hover:scale-105 transition-all flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto"
          title="Logout"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;