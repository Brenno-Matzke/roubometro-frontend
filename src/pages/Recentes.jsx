import { useEffect, useMemo, useState } from "react";
import api from "../api";

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_LABEL = {
  em_apuracao: "Em apuração",
  verificado: "Verificado",
  contestado: "Contestado",
};

const FILTERS = [
  { key: "week", label: "Última semana", dias: 7 },
  { key: "month", label: "Último mês", dias: 30 },
  { key: "3m", label: "Últimos 3 meses", dias: 90 },
  { key: "year", label: "Ano" },
];

export default function Recentes() {
  const [casos, setCasos] = useState([]);
  const [filtro, setFiltro] = useState("month");
  const [ano, setAno] = useState(new Date().getFullYear());

  useEffect(() => {
    api.get("/casos").then((res) => setCasos(res.data));
  }, []);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set(casos.map((c) => new Date(c.data).getFullYear()).filter((a) => !Number.isNaN(a)));
    anos.add(new Date().getFullYear());
    return [...anos].sort((a, b) => b - a);
  }, [casos]);

  const casosFiltrados = useMemo(() => {
    if (filtro === "year") {
      return casos.filter((c) => new Date(c.data).getFullYear() === ano);
    }
    const cfg = FILTERS.find((f) => f.key === filtro);
    const limite = new Date();
    limite.setDate(limite.getDate() - cfg.dias);
    return casos.filter((c) => new Date(c.data) >= limite);
  }, [casos, filtro, ano]);

  const totalFiltrado = casosFiltrados.reduce((soma, c) => soma + (parseFloat(c.valor_estimado) || 0), 0);

  return (
    <div className="section wrap">
      <h2>Casos recentes</h2>
      <p className="section-lead" style={{ marginBottom: 28 }}>
        Casos públicos cadastrados, organizados por data de registro.
      </p>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <div
            key={f.key}
            className={"filter-chip" + (filtro === f.key ? " sel" : "")}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </div>
        ))}
        {filtro === "year" && (
          <select className="year-select" value={ano} onChange={(e) => setAno(parseInt(e.target.value, 10))}>
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="meter-wrap" style={{ margin: "0 0 32px" }}>
        <div className="meter-label">Valor total estimado desviado</div>
        <div className="meter-value">{formatoMoeda.format(totalFiltrado)}</div>
        <div className="meter-sub">{casosFiltrados.length} casos no período</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Envolvidos</th>
              <th>Valor estimado</th>
              <th>Status</th>
              <th>Fonte</th>
            </tr>
          </thead>
          <tbody>
            {casosFiltrados.map((caso) => (
              <tr key={caso.id}>
                <td>{caso.titulo}</td>
                <td>{caso.envolvidos}</td>
                <td>{formatoMoeda.format(caso.valor_estimado)}</td>
                <td>
                  <span className={`status-badge status-${caso.status}`}>
                    {STATUS_LABEL[caso.status] || caso.status}
                  </span>
                </td>
                <td>
                  <a href={caso.fonte} target="_blank" rel="noreferrer">
                    fonte
                  </a>
                </td>
              </tr>
            ))}
            {casosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--ink-soft)" }}>
                  Nenhum caso no período selecionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
