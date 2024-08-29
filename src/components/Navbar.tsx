import { useState } from "react";
import logoFCSH from "../assets/logoFCSH.png";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface NavbarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={"/equipos"} onClick={() => handleNavClick("Equipos")}>
              <img className="h-15 w-60" src={logoFCSH} alt="LogoFCSH" />
            </Link>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-darkgray hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <Icon icon="mdi:menu" width="24" height="24" />
              ) : (
                <Icon icon="mdi:close" width="24" height="24" />
              )}
            </button>
          </div>

          <div className="hidden lg:flex flex-grow justify-center">
            <div className="flex items-baseline space-x-4">
              <Link
                to={"/equipos"}
                onClick={() => handleNavClick("Equipos")}
                className={`px-3 py-2 text-base font-medium ${
                  currentSection === "Equipos"
                    ? "text-darkgray"
                    : "text-skygray hover:text-darkgray"
                }`}
              >
                Equipos
              </Link>
              <Link
                to={"/usuarios"}
                onClick={() => handleNavClick("Usuarios")}
                className={`px-3 py-2 text-base font-medium ${
                  currentSection === "Usuarios"
                    ? "text-darkgray"
                    : "text-skygray hover:text-darkgray"
                }`}
              >
                Usuarios
              </Link>
              <Link
                to={"/admin"}
                onClick={() => handleNavClick("Admin")}
                className={`px-3 py-2 text-base font-medium ${
                  currentSection === "Admin"
                    ? "text-darkgray"
                    : "text-skygray hover:text-darkgray"
                }`}
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1 w-60">
            <p className="text-black px-3 py-2 text-sm font-medium">
              Jorge Navarrete
            </p>
            <Link to={"/"}>
              <Icon icon="pepicons-pop:leave" width="20" height="20" />
            </Link>{" "}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={"/equipos"}
              onClick={() => handleNavClick("Equipos")}
              className={`block px-3 py-2 text-base font-medium ${
                currentSection === "Equipos"
                  ? "text-darkgray"
                  : "text-skygray hover:text-darkgray"
              }`}
            >
              Equipos
            </Link>
            <Link
              to={"/usuarios"}
              onClick={() => handleNavClick("Usuarios")}
              className={`block px-3 py-2 text-base font-medium ${
                currentSection === "Usuarios"
                  ? "text-darkgray"
                  : "text-skygray hover:text-darkgray"
              }`}
            >
              Usuarios
            </Link>
            <Link
              to={"/admin"}
              onClick={() => handleNavClick("Admin")}
              className={`block px-3 py-2 text-base font-medium ${
                currentSection === "Admin"
                  ? "text-darkgray"
                  : "text-skygray hover:text-darkgray"
              }`}
            >
              Admin
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-b border-gray-200">
            <div className="flex items-center px-5">
              <div className="pr-3">
                <p className="text-black py-2 text-sm font-medium">
                  Jorge Navarrete
                </p>
              </div>
              <Link to={"/admin"}>
                <Icon icon="pepicons-pop:leave" width="20" height="20" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
