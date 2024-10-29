import { Link } from "react-router-dom";

const Login = () => {
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
