import React from "react";
import { NavBar } from "./NavBar/NavBar.tsx";
import { LayoutProps } from "./PropsInterface.ts";

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
