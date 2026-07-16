import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { salvarUsuario } from "../auth";
import PasswordInput from "../components/PasswordInput";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [anonimo, setAnonimo] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    try {
      const res = await api.post("/auth/cadastro", { nome, email, senha, telefone, anonimo });
      salvarUsuario(res.data);
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.detail || "Não foi possível criar a conta.");
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="tabbar">
          <div className="tab active">Cadastro</div>
          <Link to="/login" className="tab">
            Login
          </Link>
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Criar conta</h2>
        {erro && <div className="alert alert-error">{erro}</div>}
        <form onSubmit={enviar}>
          <div className="field">
            <label className="label">Nome</label>
            <input
              className="input"
              placeholder="Seu nome (opcional se anônimo)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required={!anonimo}
            />
          </div>

          <div className="anon-box">
            <input className="chk" type="checkbox" checked={anonimo} onChange={() => setAnonimo((a) => !a)} />
            <div className="t">
              <b>Permanecer anônimo.</b> Seu nome não será associado a nenhuma denúncia enviada por esta conta.
            </div>
          </div>

          <div className="field" style={{ marginTop: 18 }}>
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
            <PasswordInput
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="field">
            <label className="label">Confirmar senha</label>
            <PasswordInput
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="field">
            <label className="label">Telefone (opcional)</label>
            <input
              className="input"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Criar conta
          </button>
        </form>
      </div>
    </div>
  );
}
