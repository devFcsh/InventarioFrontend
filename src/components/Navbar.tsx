import MenuIcon from '@mui/icons-material/Menu';
import "./Nabvar.css";
import logoFCSH from "../assets/logoFCSH.png";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
interface NavbarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}
export const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    setIsOpen(false);
  };
  return (
    <nav className="nav_fcsh">
      <div className="element_nav">
        <div className="">
          <MenuIcon />
        </div>
        <div className="">
          <img className="h-15 w-60" src={logoFCSH} alt="LogoFCSH" />
        </div>
        <div>
          <PersonIcon/>
        </div>
        <div>
          <LogoutIcon/>
        </div>
      </div>
    </nav>
  )
}
