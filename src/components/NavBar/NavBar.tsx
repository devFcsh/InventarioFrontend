import "./NavBar.css";
import logoFCSH from "../../assets/logoFCSH.png";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavBarItems } from "./NavBarItems";
import { Drawer as MuiDrawer } from '@mui/material';
import { NavBarProps } from "../PropsInterface";
import { Link } from "react-router-dom";
import { useUser } from "@context/userContext";
import Loader from "@pages/Loader";

export const NavBar: React.FC<NavBarProps> = ({ currentSection, setCurrentSection }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { user, rol, loading } = useUser();

  if(loading) return <Loader/>;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.casLogoutUrl) {
          window.location.href = data.casLogoutUrl;
        } else {
          window.location.href = "/";
        }
      } else {
        console.error("❌ Error en logout:", data);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("❌ Error durante logout:", error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <nav className="flex min-h-14 w-full flex-wrap items-center justify-between gap-2 bg-yellow-500 px-2 sm:flex-nowrap sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <MenuIcon />
          </IconButton>
          <div className="h-auto w-36 max-w-full overflow-hidden sm:w-60">
            <Link to={"/activos"}>
              <img className="h-full w-full object-contain" src={logoFCSH} alt="LogoFCSH" />
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-black sm:gap-8 sm:text-sm">
          <div className="flex shrink-0 items-center gap-1">
            <PersonIcon />
            <p className="hidden truncate sm:block">{user ? user.displayName : ""}</p>
          </div>
          <div 
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap cursor-pointer ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            <p>{isLoggingOut ? "Cerrando..." : "Salir"}</p>
          </div>
        </div>
      </nav>
      <MuiDrawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          style: {
            width: '240px',
            padding: '10px 0',
            backgroundColor: '#f0f0f5',
          }
        }}
      >
        <NavBarItems 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection} 
          setIsDrawerOpen={setIsDrawerOpen}
          rol={rol ?? ""} 
        />
      </MuiDrawer>
    </div>
  );
};
