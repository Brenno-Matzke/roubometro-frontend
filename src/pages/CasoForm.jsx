import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { getUsuario } from "../auth";

const vazio = {
  titulo: "",
  envolvidos: "",
  valor_estimado: "",
  data: "",
  fonte: "",
  status: "em_apuracao",
  observacoes: "",
};

// Um único componente para criar e editar: os campos são idênticos, e
// duplicar o formulário só criaria dois lugares para corrigir o mesmo
// bug depois. O que muda é só o método HTTP (POST vs PUT) e se os
// dados iniciais vêm vazios ou de um caso existente.
export default function CasoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const [dados, setDados] = useState(vazio);
  const navigate = useNavigate();
  const usuario = getUsuario();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    if (!usuario.admin) {
      navigate("/");
      return;
    }
    if (editando) {
      api.get("/casos").then((res) => {
        const caso = res.data.find((c) => c.id === id);
        if (caso) setDados(caso);
      });
    }
  }, [id]);

  function atualizarCampo(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    const payload = { ...dados, valor_estimado: parseFloat(dados.valor_estimado) };
    if (editando) {
      await api.put(`/casos/${id}?usuario_id=${usuario.id}`, payload);
    } else {
      await api.post(`/casos?usuario_id=${usuario.id}`, payload);
    }
    navigate("/dashboard");
  }

  return (
    <div className="page-shell">
      <div className="form-card">
        <h2 style={{ fontSize: 22, marginBottom: editando ? 24 : 6 }}>{editando ? "Editar caso" : "Novo caso"}</h2>
        {!editando && (
          <p className="section-lead" style={{ marginBottom: 20 }}>
            Com status "Em apuração", o caso fica visível só pra você — assim que mudar pra "Verificado" ou
            "Contestado" (aqui ou no Dashboard), aparece no site pra todo mundo.
          </p>
        )}
        <form onSubmit={enviar}>
          <div className="field">
            <label className="label">Título</label>
            <input
              className="input"
              value={dados.titulo}
              onChange={(e) => atualizarCampo("titulo", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Envolvidos</label>
            <input
              className="input"
              value={dados.envolvidos}
              onChange={(e) => atualizarCampo("envolvidos", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Valor estimado (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={dados.valor_estimado}
              onChange={(e) => atualizarCampo("valor_estimado", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Data</label>
            <input
              type="date"
              className="input"
              value={dados.data}
              onChange={(e) => atualizarCampo("data", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Fonte (link da notícia)</label>
            <input
              type="url"
              className="input"
              value={dados.fonte}
              onChange={(e) => atualizarCampo("fonte", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Status</label>
            <select
              className="select"
              value={dados.status}
              onChange={(e) => atualizarCampo("status", e.target.value)}
            >
              <option value="em_apuracao">Em apuração</option>
              <option value="verificado">Verificado</option>
              <option value="contestado">Contestado</option>
            </select>
          </div>
          <div className="field">
            <label className="label">Observações</label>
            <textarea
              className="textarea"
              value={dados.observacoes}
              onChange={(e) => atualizarCampo("observacoes", e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
