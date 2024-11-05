import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Equipos from "./features/Equipos/Homepage/Equipos";
import Activos from "./features/Equipos/Activos/Homepage/Activos";
import Bajas from "./features/Equipos/Baja/Homepage/Bajas";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Bodega from "./features/Equipos/Bodega/Homepage/Bodega";
import Usuarios from "./features/Usuarios/Homepage/Usuarios";
import Admin from "./features/Administrador/Homepage/Admin";
import AgregarActivo from "./pages/AgregarActivo";
import EditarActivo from "./pages/EditarActivo";
import {FormActivosLC} from "./features/Equipos/Activos/AgregarActivo/pages/Forms/FormActivosLC"
import {FormActivosPMTM} from "./features/Equipos/Activos/AgregarActivo/pages/Forms/FormActivosPMTM"

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("Equipos");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/equipos"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Equipos />
            </Layout>
          }
        />
        <Route
          path="/usuarios"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Usuarios />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Admin />
            </Layout>
          }
        />
        <Route
          path="/activos"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Activos />
            </Layout>
          }
        />
        <Route
          path="/bajas"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Bajas />
            </Layout>
          }
        />
        <Route
          path="/bodega"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Bodega />
            </Layout>
          }
        />
        <Route
          path="/agregarActivo"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <AgregarActivo />
            </Layout>
          }
        />
        <Route
          path="/FormActivosLC"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <FormActivosLC />
            </Layout>
          }
        />
        <Route
          path="/FormActivosPMTM"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <FormActivosPMTM />
            </Layout>
          }
        />
        <Route
          path="/editarActivo"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <EditarActivo />
            </Layout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
