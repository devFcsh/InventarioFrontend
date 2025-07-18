export const validateInventario = (value: any, empresa: string) => {
  value = value.trim();
  
  const regexPattern = /^[\d-]+$/;
  
  if (regexPattern.test(value)) {
    if (empresa === "Espol" && value.length === 8) {
      return true;
    } else if (empresa === "EspolTech" && value.length === 12) {
      return true;
    } else {
      return false;
    }
  }
  
  return false;
};
