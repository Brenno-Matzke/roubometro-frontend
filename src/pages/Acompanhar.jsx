import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buscarPorProtocolo } from "../denuncias";

const formatoData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

// Consulta contra as denúncias salvas no localStorage (ver Denuncia.jsx) —
// só encontra o que foi enviado neste mesmo navegador, já que ainda não
// existe backend de protocolo de verdade.
export default function Acompanhar() {
  const [searchParams] = useSearchParams();
  const [protocolo, setProtocolo] = useState(searchParams.get("protocolo") || "");
  const [resultado, setResultado] = useState(null);
  const [buscou, setBuscou] = useState(false);

  function consultar() {
    if (!protocolo.trim()) return;
    setResultado(buscarPorProtocolo(protocolo.trim()));
    setBuscou(true);
  }

  return (
    <div className="track-shell">
      <div className="track-card">
        <h2 style={{ fontSize: 22 }}>Acompanhar denúncia</h2>
        <p className="section-lead" style={{ marginBottom: 22 }}>
          Informe o código de protocolo recebido no envio.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input"
            placeholder="Ex: RB-2026-48291"
            value={protocolo}
            onChange={(e) => {
              setProtocolo(e.target.value);
              setBuscou(false);
            }}
          />
          <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={consultar}>
            Consultar
          </button>
        </div>

        {buscou && resultado && (
          <div className="track-result">
            <div className="review-row">
              <span className="k">Protocolo</span>
              <span className="v">{resultado.protocolo}</span>
            </div>
            <div className="review-row">
              <span className="k">Título</span>
              <span className="v">{resultado.titulo}</span>
            </div>
            <div className="review-row">
              <span className="k">Categoria</span>
              <span className="v">{resultado.categoria}</span>
            </div>
            <div className="review-row">
              <span className="k">Enviada em</span>
              <span className="v">{formatoData.format(new Date(resultado.criadaEm))}</span>
            </div>
            {resultado.fonte && (
              <div className="review-row">
                <span className="k">Fonte</span>
                <span className="v">
                  <a href={resultado.fonte} target="_blank" rel="noreferrer">
                    ver fonte
                  </a>
                </span>
              </div>
            )}
            <div className="status-pill">EM ANÁLISE</div>
          </div>
        )}

        {buscou && !resultado && (
          <div className="alert alert-error" style={{ marginTop: 24 }}>
            Nenhuma denúncia encontrada com esse protocolo.
          </div>
        )}
      </div>
    </div>
  );
}
