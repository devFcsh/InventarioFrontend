import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { routesConfig } from "./router/routesConfig";
import { ProtectedRoute } from "./router/ProtectedRoute";
import NotRegistered from "@pages/NotRegistered";

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const matchingRoute = routesConfig.find((route) => path.includes(route.path));

    if (matchingRoute) {
      setCurrentSection(matchingRoute.path);
    }
  }, [location.pathname]);
   
  const allRoles = Array.from(
    new Set(routesConfig.flatMap((route) => route.allowedRoles))
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/no-registrado" element={<NotRegistered />} />

        {routesConfig.map(({ path, element, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute
                element={
                  <Layout
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                  >
                    {element}
                  </Layout>
                }
                allowedRoles={allowedRoles}
              />
            }
          />
        ))}
        <Route path="/notFound" element={<NotFound />} />
        <Route
          path="*"
          element={
            <ProtectedRoute element={<NotFound />} allowedRoles={allRoles} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
