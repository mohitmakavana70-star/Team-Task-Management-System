import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;