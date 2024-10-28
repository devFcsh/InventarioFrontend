export interface NavBarPropsInterface {
    currentSection: string;
    setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
    isDrawerOpen: Boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}