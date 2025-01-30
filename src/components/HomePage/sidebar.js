import { FiHome, FiInfo, FiSettings, FiMail, FiX, FiUser } from "react-icons/fi";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-600 to-purple-600 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 shadow-xl z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-full">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <p className="text-white font-medium">John Doe</p>
              <p className="text-white/80 text-sm">john@example.com</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="p-4 mt-2">
          <ul className="space-y-2">
            {[
              { icon: FiHome, text: "Home" },
              { icon: FiInfo, text: "About" },
              { icon: FiSettings, text: "Services" },
              { icon: FiMail, text: "Contact" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <item.icon className="text-xl opacity-80 group-hover:opacity-100" />
                  <span className="font-medium">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm">
              v2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}