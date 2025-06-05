import { useEffect } from "react";
import { Link } from "react-router-dom";

const Login = () => {

  useEffect(() => {
      localStorage.setItem("rol", "administrador");
  }, []);

  return (
    <>
      <div>Login</div>
      <Link to={"/activos"} className="bg-bluebtn text-white">
        Ingresar
      </Link>
    </>
  );
};

export default Login;
