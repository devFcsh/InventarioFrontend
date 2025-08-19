import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { routesConfig } from "./router/routesConfig";
import NotRegistered from "@pages/NotRegistered";

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/no-registrado" element={<NotRegistered />} />

        {routesConfig.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                {element}
              </Layout>
            }
          />
        ))}
        <Route path="/notFound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;