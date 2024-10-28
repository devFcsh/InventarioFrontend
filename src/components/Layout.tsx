import React from "react";
import { NavBar } from "./NavBar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentSection,
  setCurrentSection,
}) => {
  return (
    <>
      <NavBar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <>{children}</>
    </>
  );
};

export default Layout;
