import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsuario } from "../auth";
import { salvarDenuncia } from "../denuncias";

const CATEGORIAS = [
  "Desvio de verba pública",
  "Propina / corrupção ativa",
  "Nepotismo",
  "Fraude em licitação",
  "Lavagem de dinheiro",
  "Outros",
];

const STEP_TITLES = ["Categoria e resumo", "Detalhes e envolvidos", "Fonte e anonimato", "Revisão e envio"];

const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function gerarProtocolo() {
  const ano = new Date().getFullYear();
  const numero = Math.floor(10000 + Math.random() * 89999);
  return `RB-${ano}-${numero}`;
}

export default function Denuncia() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categoria, setCategoria] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [envolvidos, setEnvolvidos] = useState("");
  const [valor, setValor] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");
  const [fonte, setFonte] = useState("");
  const [anonimo, setAnonimo] = useState(true);
  const [protocolo, setProtocolo] = useState(null);

  function proximo() {
    setStep((s) => Math.min(4, s + 1));
  }
  function voltar() {
    setStep((s) => Math.max(1, s - 1));
  }

  // Sem backend para denúncia anônima/protocolo ainda (o modelo de "caso"
  // atual exige login e fonte obrigatória) — por ora o protocolo é só
  // gerado no navegador. Se a pessoa está logada, salvamos em "minhas
  // denúncias" (localStorage) pra ela conseguir achar de novo depois.
  function enviar() {
    const codigo = gerarProtocolo();
    const usuario = getUsuario();
    if (usuario) {
      salvarDenuncia(usuario.id, {
        protocolo: codigo,
        titulo: titulo || "Denúncia sem título",
        categoria: CATEGORIAS[categoria],
        fonte,
        criadaEm: new Date().toISOString(),
      });
    }
    setProtocolo(codigo);
  }

  if (protocolo) {
    const usuario = getUsuario();
    return (
      <div className="confirm-shell">
        <div className="confirm-card">
          <div className="check-badge">✓</div>
          <h2 style={{ fontSize: 22 }}>Denúncia recebida com sucesso</h2>
          <p className="hint" style={{ marginTop: 10 }}>
            Guarde este código — é a única forma de acompanhar o andamento do caso.
          </p>
          <div className="protocol-code">{protocolo}</div>
          <div className="status-pill">EM ANÁLISE</div>
          {usuario && (
            <p className="hint" style={{ marginTop: 16 }}>
              Essa denúncia está em <Link to="/minhas-denuncias">Minhas denúncias enviadas</Link>.
            </p>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
            <button className="btn btn-outline" onClick={() => navigate(`/acompanhar?protocolo=${protocolo}`)}>
              Acompanhar agora
            </button>
            <button className="btn btn-dark" onClick={() => navigate("/")}>
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="steps-bar">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={"step-seg" + (step >= n ? " done" : "")} />
        ))}
      </div>
      <div className="step-label">
        Etapa {step} de 4 — <b>{STEP_TITLES[step - 1]}</b>
      </div>

      <div className="form-card">
        {step === 1 && (
          <>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Categoria e resumo</h3>
            <p className="section-lead" style={{ marginBottom: 24 }}>
              Escolha a categoria que melhor descreve o caso.
            </p>
            <div className="cat-grid" style={{ marginBottom: 22 }}>
              {CATEGORIAS.map((cat, i) => (
                <div
                  key={cat}
                  className={"cat-chip" + (categoria === i ? " sel" : "")}
                  onClick={() => setCategoria(i)}
                >
                  {cat}
                </div>
              ))}
            </div>
            <div className="field">
              <label className="label">Título / assunto</label>
              <input
                className="input"
                placeholder="Resumo da denúncia em uma linha"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Detalhes e envolvidos</h3>
            <p className="section-lead" style={{ marginBottom: 24 }}>
              Quanto mais detalhes, mais fácil apurar o caso.
            </p>
            <div className="field">
              <label className="label">Descrição detalhada</label>
              <textarea
                className="textarea"
                placeholder="Relate o que aconteceu, quando, como você tomou conhecimento e quaisquer outros detalhes relevantes"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Órgão / pessoa envolvida</label>
              <input
                className="input"
                placeholder="Nome do órgão público ou pessoa citada"
                value={envolvidos}
                onChange={(e) => setEnvolvidos(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Valor estimado desviado (R$)</label>
              <input
                className="input"
                type="number"
                placeholder="Ex: 500000"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field">
                <label className="label">Local (cidade/estado)</label>
                <input className="input" placeholder="Ex: Recife/PE" value={local} onChange={(e) => setLocal(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Data aproximada</label>
                <input className="input" type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Fonte e anonimato</h3>
            <p className="section-lead" style={{ marginBottom: 24 }}>
              Uma fonte fortalece a apuração. O sigilo é sempre seu direito.
            </p>
            <div className="field">
              <label className="label">Fonte (link da notícia ou prova)</label>
              <input
                className="input"
                type="url"
                placeholder="https://..."
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
              />
              <div className="hint">Uma matéria, post público ou documento que comprove o caso.</div>
            </div>
            <div className="anon-box" style={{ marginTop: 6 }}>
              <input
                className="chk"
                type="checkbox"
                checked={anonimo}
                onChange={() => setAnonimo((a) => !a)}
              />
              <div className="t">
                <b>Enviar como denúncia anônima.</b> Seus dados de identificação não serão vinculados a este relato,
                mesmo internamente.
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Revisão e envio</h3>
            <p className="section-lead" style={{ marginBottom: 20 }}>
              Confira antes de enviar. Após o envio não será possível editar.
            </p>
            <div className="review-row">
              <span className="k">Categoria</span>
              <span className="v">{CATEGORIAS[categoria]}</span>
            </div>
            <div className="review-row">
              <span className="k">Título</span>
              <span className="v">{titulo || "—"}</span>
            </div>
            <div className="review-row">
              <span className="k">Valor estimado</span>
              <span className="v">{valor ? formatoMoeda.format(parseFloat(valor) || 0) : "—"}</span>
            </div>
            <div className="review-row">
              <span className="k">Fonte</span>
              <span className="v">{fonte || "—"}</span>
            </div>
            <div className="review-row">
              <span className="k">Denúncia anônima</span>
              <span className="v">{anonimo ? "Sim" : "Não"}</span>
            </div>
            <div className="review-row">
              <span className="k">Status inicial</span>
              <span className="v">Em análise</span>
            </div>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <button className="btn btn-outline" onClick={voltar} disabled={step === 1}>
            Voltar
          </button>
          {step === 4 ? (
            <button className="btn btn-primary" onClick={enviar}>
              Enviar denúncia
            </button>
          ) : (
            <button className="btn btn-primary" onClick={proximo}>
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
