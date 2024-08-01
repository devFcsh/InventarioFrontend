import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, setCurrentSection }) => {
  return (
    <>
      <Navbar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <div className="mt-5">
        {children}
      </div>
    </>
  );
};

export default Layout;