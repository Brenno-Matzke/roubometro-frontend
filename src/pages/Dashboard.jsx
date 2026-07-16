import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { getUsuario } from "../auth";

const STATUS_LABEL = {
  em_apuracao: "Em apuração",
  verificado: "Verificado",
  contestado: "Contestado",
};

export default function Dashboard() {
  const [casos, setCasos] = useState([]);
  const usuario = getUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    if (!usuario.admin) {
      navigate("/");
      return;
    }
    carregar();
  }, []);

  function carregar() {
    api.get(`/casos?usuario_id=${usuario.id}`).then((res) => setCasos(res.data));
  }

  async function excluir(id) {
    if (!confirm("Excluir este caso?")) return;
    await api.delete(`/casos/${id}?usuario_id=${usuario.id}`);
    carregar();
  }

  // "Confirmar" tira o caso de em_apuracao e o publica pra todo mundo ver —
  // é a mesma coisa que editar o status pra "verificado", só que num clique.
  async function confirmar(caso) {
    const { id, usuario_id, ...payload } = caso;
    await api.put(`/casos/${id}?usuario_id=${usuario.id}`, { ...payload, status: "verificado" });
    carregar();
  }

  return (
    <div className="page-shell wrap">
      <div className="fx" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 26 }}>Dashboard</h2>
        <Link className="btn btn-primary" to="/casos/novo">
          + adicionar caso
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {casos.map((caso) => (
              <tr key={caso.id}>
                <td>{caso.titulo}</td>
                <td>
                  <span className={`status-badge status-${caso.status}`}>
                    {STATUS_LABEL[caso.status] || caso.status}
                  </span>
                  {caso.status === "em_apuracao" && (
                    <span className="hint" style={{ display: "block", marginTop: 4 }}>
                      Só você vê — ainda não apareceu no site
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {caso.status === "em_apuracao" && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginRight: 8 }}
                      onClick={() => confirmar(caso)}
                    >
                      Confirmar e publicar
                    </button>
                  )}
                  <Link className="btn btn-outline btn-sm" style={{ marginRight: 8 }} to={`/casos/${caso.id}/editar`}>
                    Editar
                  </Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => excluir(caso.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
