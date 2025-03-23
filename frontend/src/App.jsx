import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/MainContext";

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
