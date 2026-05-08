// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare } from "lucide-react";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors ${
      isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-16 sm:w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-3 sm:p-5">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 sr-only sm:not-sr-only">
        TeamFlow
      </h2>

      <nav className="space-y-1.5 sm:space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} className="shrink-0" />
          <span className="hidden sm:inline">Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className={linkClass}>
          <FolderKanban size={18} className="shrink-0" />
          <span className="hidden sm:inline">Projects</span>
        </NavLink>

        <NavLink to="/tasks" className={linkClass}>
          <CheckSquare size={18} className="shrink-0" />
          <span className="hidden sm:inline">Tasks</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;