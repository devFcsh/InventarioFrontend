export const validateInventario = (value: string) => {
    value = value.trim();
    if ((value.length >= 6 && value.length <= 10) && /^\d+$/.test(value)) {
      return true;
    }
    return false;
  };
  