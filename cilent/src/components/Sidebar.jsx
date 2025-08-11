import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex-shrink-0 max-sm:fixed top-14 bottom-0 z-20 h-full ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col justify-between">
        {/* Atas: Menu dan user */}
        <div className="my-7 w-full px-4 text-center">
          <img
            src={user.imageUrl}
            alt="user avatar"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h1 className="mt-2 font-medium">{user.fullName}</h1>

          <div className="mt-6 space-y-1">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bawah: Informasi & Logout */}
        <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between">
          <div
            onClick={openUserProfile}
            className="flex gap-2 items-center cursor-pointer"
          >
            <img
              src={user.imageUrl}
              className="w-8 h-8 rounded-full"
              alt="user avatar small"
            />
            <div>
              <h1 className="text-sm font-medium">{user.fullName}</h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="Free">Premium</Protect> Plan
              </p>
            </div>
          </div>
          <LogOut
            onClick={signOut}
            className="w-5 h-5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
