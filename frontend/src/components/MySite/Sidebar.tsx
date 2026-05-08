import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  Users,
  LayoutDashboard,
  Folder,
  Store,
  MessageCircleQuestionMark,
} from "lucide-react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";

export default function Sidebar() {
  const location = useLocation();

  const role = useAppSelector((state: RootState) => state.auth.role);
  const menuItems = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "Users", path: "users", icon: Users },
    // { name: "Projects", path: "projects", icon: Folder },
    { name: "Products", path: "products", icon: Store },
    // { name: "Settings", path: "settings", icon: Settings },
  ];

  if (role !== "Admin")
    menuItems.push({
      name: "Chat",
      path: "chat",
      icon: MessageCircleQuestionMark,
    });

  return (
    <aside className="w-30 bg-black text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h2 className="font-bold text-white text-3xl">vendora</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          if (item.name === "Users" && role !== "Admin") return <></>;
          if (item.name === "Chat" && role === "Admin") return <></>;
          const Icon = item.icon;
          const isActive = location.pathname.split("/")[1] === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? "bg-white text-black"
                : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
