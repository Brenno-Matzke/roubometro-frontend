import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getUsuario, salvarUsuario } from "../auth";

export default function Perfil() {
  const usuario = getUsuario();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setNome(usuario.nome);
    setEmail(usuario.email);
  }, []);

  async function salvar(e) {
    e.preventDefault();
    const res = await api.put(`/usuarios/${usuario.id}`, { nome, email });
    salvarUsuario(res.data);
    setMensagem("Perfil atualizado.");
  }

  return (
    <div className="page-shell">
      <div className="form-card narrow">
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Editar perfil</h2>
        {mensagem && <div className="alert alert-success">{mensagem}</div>}
        <form onSubmit={salvar}>
          <div className="field">
            <label className="label">Nome</label>
            <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
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
          <button className="btn btn-primary btn-block" type="submit">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
