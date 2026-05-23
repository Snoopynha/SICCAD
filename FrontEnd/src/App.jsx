import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Admin from "./Pages/AdminPage";
import Dashboard from "./Pages/Dashboard";

import { AuthProvider, useAuth } from "./context/AuthContext";

function Rotas() {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  console.log("USUARIO COMPLETO:", usuario);
  console.log("TIPO:", usuario?.tipo_global);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          usuario ? <Dashboard /> : <Navigate to="/" replace />
        }
      />

      <Route
        path="/admin"
        element={
          usuario?.tipo_global === "ADMIN"
            ? <Admin />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </AuthProvider>
  );
}