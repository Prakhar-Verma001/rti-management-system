import { useMemo, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Scale,
  CalendarDays,
  FolderOpen,
  BarChart3,
  Bell,
  LogOut,
  Search,
  BellDot,
} from "lucide-react";
import { debounce } from "../../utils/debounce";

// Passing the compiled JSX directly fixes Lucide's internal useContext hook crashes
const sidebarMenus = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    name: "RTI Management",
    icon: <FileText size={20} />,
    path: "/rti",
  },
  {
    name: "Legal Cases",
    icon: <Scale size={20} />,
    path: "/legal-cases",
  },
  {
    name: "Hearings Calendar",
    icon: <CalendarDays size={20} />,
    path: "/hearings-calendar",
  },
  {
    name: "Documents",
    icon: <FolderOpen size={20} />,
    path: "/documents",
  },
  {
    name: "Reports & Analytics",
    icon: <BarChart3 size={20} />,
    path: "/reports",
  },
  {
    name: "Notifications & Settings",
    icon: <Bell size={20} />,
    path: "/settings",
  },
];

const MainLayout = () => {
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearchQuery(value);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col">
        {/* LOGO */}
        <div className="h-[90px] bg-[#0B4EA2] flex items-center justify-center px-5">
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-wide leading-none">
              SAU
            </h1>
            <p className="text-[10px] uppercase mt-1 leading-3 text-blue-100">
              South Asian <br />
              University
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 py-5 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarMenus.map((menu) => (
              <li key={menu.name}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-4 text-sm font-medium border-l-4 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 border-[#0B4EA2] text-[#0B4EA2]"
                        : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-[#0B4EA2]"
                    }`
                  }
                >
                  {/* Render the icon wrapper cleanly */}
                  <span className="flex items-center justify-center">
                    {menu.icon}
                  </span>
                  <span>{menu.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* LOGOUT */}
        <div className="border-t border-gray-200 p-5">
          <button className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-red-500 transition-all duration-200 w-full group">
            <LogOut size={20} className="text-gray-600 group-hover:text-red-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-[90px] bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          {/* LEFT */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              RTI Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              RTI Management
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search by applicant or RTI No"
                className="w-[300px] h-[42px] border border-gray-300 rounded-lg pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* NOTIFICATION */}
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all duration-200">
                <BellDot size={20} className="text-gray-700" />
              </button>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            </div>

            {/* PROFILE */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet
            context={{
              searchText,
              searchQuery,
              handleSearchChange,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;