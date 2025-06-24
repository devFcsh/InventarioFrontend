import React from "react";

export interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}


export interface NavBarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export interface NavBarItemsProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
  rol: string;
}
