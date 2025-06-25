import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { routesConfig } from "./router/routesConfig";
import { ProtectedRoute } from "./router/ProtectedRoute";

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  const allRoles = Array.from(
    new Set(routesConfig.flatMap((route) => route.allowedRoles))
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

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
