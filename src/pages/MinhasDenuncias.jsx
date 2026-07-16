import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsuario } from "../auth";
import { minhasDenuncias } from "../denuncias";

const formatoData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function MinhasDenuncias() {
  const usuario = getUsuario();
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setDenuncias(minhasDenuncias(usuario.id));
  }, []);

  return (
    <div className="page-shell wrap">
      <h2 style={{ fontSize: 26, marginBottom: 6 }}>Minhas denúncias enviadas</h2>
      <p className="section-lead" style={{ marginBottom: 28 }}>
        Denúncias enviadas por você nesta conta, com o código de protocolo de cada uma.
      </p>

      {denuncias.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Você ainda não enviou nenhuma denúncia.</p>
          <Link className="btn btn-primary" to="/denuncia">
            Fazer denúncia
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Enviada em</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {denuncias.map((d) => (
                <tr key={d.protocolo}>
                  <td style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700 }}>{d.protocolo}</td>
                  <td>{d.titulo}</td>
                  <td>{d.categoria}</td>
                  <td>{formatoData.format(new Date(d.criadaEm))}</td>
                  <td>
                    <span className="status-pill">EM ANÁLISE</span>
                  </td>
                  <td>
                    <Link className="btn btn-outline btn-sm" to={`/acompanhar?protocolo=${d.protocolo}`}>
                      Acompanhar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
