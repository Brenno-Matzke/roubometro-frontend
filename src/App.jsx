import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import CasoForm from "./pages/CasoForm";
import Perfil from "./pages/Perfil";
import Recentes from "./pages/Recentes";
import Denuncia from "./pages/Denuncia";
import Acompanhar from "./pages/Acompanhar";
import MinhasDenuncias from "./pages/MinhasDenuncias";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <NavBar />
        <div className="stripe" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/casos/novo" element={<CasoForm />} />
          <Route path="/casos/:id/editar" element={<CasoForm />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/recentes" element={<Recentes />} />
          <Route path="/denuncia" element={<Denuncia />} />
          <Route path="/acompanhar" element={<Acompanhar />} />
          <Route path="/minhas-denuncias" element={<MinhasDenuncias />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <div className="footer">© 2026 roubômetro. Todos os direitos reservados.</div>
      </div>
    </BrowserRouter>
  );
}
