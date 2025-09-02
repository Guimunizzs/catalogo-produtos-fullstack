import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
