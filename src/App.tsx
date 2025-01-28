import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Activos from "./features/Equipos/Activos/Homepage/Activos";
import Bajas from "./features/Equipos/Baja/Homepage/Bajas";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Bodega from "./features/Equipos/Bodega/Homepage/Bodega";
import Usuarios from "./features/Administrador/Usuarios/Homepage/Usuarios";
import Categorias from "./features/Administrador/Categorías/Homepage/Categorias";
import AgregarActivo from "./pages/AgregarActivo";
import EditarActivo from "./pages/EditarActivo";
import {EditarBodega} from "./pages/EditarBodega";
import {FormLC} from "./pages/Forms/FormLC";
import {FormPMTM} from "./pages/Forms/FormPMTM";
import {FormSAP} from "./pages/Forms/FormSAP";
import AgregarUsuario from "./features/Administrador/Usuarios/AgregarUsuario/Homepage/AgregarUsuario";
import EditarUsuario from "./features/Administrador/Usuarios/EditarUsuario/Homepage/EditarUsuario";

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/categorias"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <Categorias />
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
          path="/FormLC"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <FormLC />
            </Layout>
          }
        />
        <Route
          path="/FormSAP"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <FormSAP />
            </Layout>
          }
        />
        {
        <Route
          path="/FormPMTM"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <FormPMTM />
            </Layout>
          }
        />
        }
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
        <Route
          path="/editarBodega"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <EditarBodega />
            </Layout>
          }
        />
        <Route
          path="/agregarUsuario"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <AgregarUsuario />
            </Layout>
          }
        />
        <Route
          path="/editarUsuario"
          element={
            <Layout
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            >
              <EditarUsuario />
            </Layout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
