import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Activos from "./features/Equipos/Activos/Homepage/Activos";
import Bajas from "./features/Equipos/Baja/Homepage/Bajas";
import Login from "./pages/Login";
import LoginFailed from "./pages/LoginFailed";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
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
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/failed" element={<LoginFailed />} />

        {/* Rutas protegidas */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <Usuarios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <Categorias />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activos"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <Activos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bajas"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <Bajas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bodega"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <Bodega />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agregarActivo"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <AgregarActivo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/FormLC"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <FormLC />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/FormSAP"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <FormSAP />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/FormPMTM"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <FormPMTM />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarActivo"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <EditarActivo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarBodega"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <EditarBodega />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agregarUsuario"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <AgregarUsuario />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarUsuario"
          element={
            <ProtectedRoute>
              <Layout
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
              >
                <EditarUsuario />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;