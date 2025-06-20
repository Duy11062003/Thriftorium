import { AuthProvider } from "./context/AuthContext";
import Routers from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <Routers />
      <ToastContainer />
    </AuthProvider>
  );
}
