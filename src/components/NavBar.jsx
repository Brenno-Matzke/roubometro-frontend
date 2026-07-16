import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsuario, logout } from "../auth";

export default function NavBar() {
  const usuario = getUsuario();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function fecharSeForaDoMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setAberto(false);
    }
    document.addEventListener("mousedown", fecharSeForaDoMenu);
    return () => document.removeEventListener("mousedown", fecharSeForaDoMenu);
  }, []);

  function irPara(caminho) {
    setAberto(false);
    navigate(caminho);
  }

  function sair() {
    setAberto(false);
    logout();
    navigate("/");
  }

  return (
    <nav className="topbar">
      <div className="wrap">
        <Link className="brand" to="/">
          roub<span style={{ color: "var(--gold)" }}>ô</span>metro
        </Link>
        <div className="navlinks">
          <Link className="navlink" to="/recentes">
            Casos recentes
          </Link>
          <Link className="navlink" to="/acompanhar">
            Acompanhar denúncia
          </Link>
          {usuario ? (
            <div className="user-menu" ref={menuRef}>
              <button className={"user-menu-trigger" + (aberto ? " open" : "")} onClick={() => setAberto((a) => !a)}>
                {usuario.nome}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {aberto && (
                <div className="user-menu-dropdown">
                  <button className="user-menu-item" onClick={() => irPara("/perfil")}>
                    Configurações da conta
                  </button>
                  <button className="user-menu-item" onClick={() => irPara("/minhas-denuncias")}>
                    Minhas denúncias enviadas
                  </button>
                  {usuario.admin && (
                    <button className="user-menu-item" onClick={() => irPara("/dashboard")}>
                      Dashboard admin
                    </button>
                  )}
                  <div className="user-menu-divider" />
                  <button className="user-menu-item" onClick={sair}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="navlink" to="/login">
              Entrar / Cadastrar
            </Link>
          )}
          <Link className="btn btn-ghost" to="/denuncia">
            Fazer denúncia
          </Link>
        </div>
      </div>
    </nav>
  );
}
