import "./Nabvar.css";
import logoFCSH from "../assets/logoFCSH.png";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";

interface NavbarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [burguer_class, setBurguerClass] = useState("burguer-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    setIsOpen(false);
  };

  const updateMenu = ()=>{
    if(!isMenuClicked){
      setBurguerClass("burguer-bar clicked")
      setMenuClass("menu visible")
    }
    else{
      setBurguerClass("burguer-bar unclicked");
      setMenuClass("menu hidden")
    }
    setIsMenuClicked(!isMenuClicked)
  }
  return (
    <div>
      <nav className="nav_fcsh">
        <div className="nav_element1">
          <div className="burguer-menu" onClick={updateMenu}>
            <div className={burguer_class}></div>
            <div className={burguer_class}></div>
            <div className={burguer_class}></div>
          </div>
          <div className="div_logo">
            <img className="logo" src={logoFCSH} alt="LogoFCSH" />
          </div>
        </div>
        <div className="nav_element2">
          <div className="div_person">
            <PersonIcon/>
            <p className="person text-black text-sm font-medium">
              Jorge Navarrete
            </p>
          </div>
          <div className="div_logout">
            <LogoutIcon/>
            <p className="person text-black text-sm font-medium">
              Salir
            </p>
          </div>
        </div>
      </nav>
      <div className={menu_class}></div>
    </div>
  )
}
