import { NavLink } from "react-router-dom";
import { Sun, Moon, Settings, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar({ setSearchQuery, searchQuery }) {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleQueryChange = function (event) {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
  };

  return (
    <nav className="w-full h-16 bg-[#222] text-white flex items-center justify-between px-8">
      <ul className="flex gap-10 text-lg font-semibold">
        <NavItem to="/cases" label="كل القضايا" />
        <NavItem to="/add" label="إضافة قضية" />
      </ul>

      <div className="relative flex justify-between items-center">
        <input
          type="text"
          className="py-0.5 px-6 bg-gray-900 border rounded-lg border-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
          placeholder="البحث"
          value={searchQuery}
          onChange={(event) => handleQueryChange(event)}
        ></input>
        <Search size={18} color="white" className="absolute left-1" />
      </div>

      <div className="flex items-center justify-between">
        <img
          src="./LawSync_Logo.png"
          alt="Lawsync Logo"
          className="w-41.5"
        ></img>
        <button
          onClick={toggleTheme}
          className="cursor-pointer relative w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden transition-transform duration-300 hover:rotate-45 hover:text-blue-300"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <NavLink
          to="/settings"
          className="cursor-pointer p-4 transition-transform duration-300 hover:rotate-90 hover:text-blue-300"
        >
          <Settings />
        </NavLink>
      </div>
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `pb-1 transition-colors duration-200 ${
            isActive
              ? "text-white border-b-2 border-blue-300"
              : "text-gray-400 hover:text-blue-300"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}
