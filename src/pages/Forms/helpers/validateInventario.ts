export const validateInventario = (value: any,empresa:string) => {
    value = value.trim();
    if ((value.length >= 6 && value.length <= 10) && /^\d+$/.test(value)) {
      if(empresa==="Espol" && value.length===6){
        return true
      }else if(empresa==="EspolTech" && value.length===10){
        return true
      }else{
        return false;
      }
    }
  };
  