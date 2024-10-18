import React from "react";
import {Navbar} from "./Navbar"

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
      <Navbar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <>{children}</>
    </>
  );
};

export default Layout;
