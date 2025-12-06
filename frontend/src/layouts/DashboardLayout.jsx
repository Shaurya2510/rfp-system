import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, FilePlus, Users, Send, ListChecks } from "lucide-react";

export default function DashboardLayout() {
    const location = useLocation();

    const menu = [
        { name: "Home", path: "/", icon: <Home size={20} /> },
        { name: "Create RFP", path: "/create-rfp", icon: <FilePlus size={20} /> },
        { name: "Vendors", path: "/vendors", icon: <Users size={20} /> },
        { name: "Send RFP", path: "/send-rfp", icon: <Send size={20} /> },
        { name: "Proposals", path: "/proposals", icon: <ListChecks size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">


            <aside className="w-64 bg-white border-r shadow-sm px-5 py-6 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-gray-800">RFP System</h1>

                <nav className="space-y-2">
                    {menu.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${active
                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto text-sm text-gray-400 px-4">
                    © {new Date().getFullYear()} RFP System
                </div>
            </aside>


            <main className="flex-1 p-10">
                <Outlet />
            </main>
        </div>
    );
}
