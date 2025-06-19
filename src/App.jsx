import { AuthProvider } from "./context/AuthContext";
import Routers from "./routes/Router";

export default function App() {
  return (
    <AuthProvider>
      <Routers />
    </AuthProvider>
  );
}
