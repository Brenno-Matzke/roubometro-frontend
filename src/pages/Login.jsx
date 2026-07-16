import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { salvarUsuario } from "../auth";
import PasswordInput from "../components/PasswordInput";

const CHAVE_EMAIL_LEMBRADO = "email_lembrado";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const lembrado = localStorage.getItem(CHAVE_EMAIL_LEMBRADO);
    if (lembrado) setEmail(lembrado);
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    try {
      const res = await api.post("/auth/login", { email, senha });
      salvarUsuario(res.data);
      if (lembrar) localStorage.setItem(CHAVE_EMAIL_LEMBRADO, email);
      else localStorage.removeItem(CHAVE_EMAIL_LEMBRADO);
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.detail || "Não foi possível entrar.");
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="tabbar">
          <Link to="/cadastro" className="tab">
            Cadastro
          </Link>
          <div className="tab active">Login</div>
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Entrar</h2>
        {erro && <div className="alert alert-error">{erro}</div>}
        <form onSubmit={enviar}>
          <div className="field">
            <label className="label">E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Senha</label>
            <PasswordInput value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div className="remember-row">
            <input
              className="chk"
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={() => setLembrar((l) => !l)}
            />
            <label htmlFor="lembrar">Lembrar-me neste dispositivo</label>
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
