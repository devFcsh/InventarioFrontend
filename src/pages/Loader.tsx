import { CircularProgress } from "@mui/material";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
    <CircularProgress sx={{ color: "#eab308" }} size={60} thickness={5} />
  </div>
);

export default Loader;