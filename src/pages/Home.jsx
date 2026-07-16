import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Home() {
  const [resumo, setResumo] = useState({ total_estimado: 0, quantidade_casos: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/casos/resumo").then((res) => setResumo(res.data));
  }, []);

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <div className="eyebrow">PLATAFORMA PÚBLICA DE TRANSPARÊNCIA</div>
          <h1>
            Corrupção prospera no silêncio. <span className="accent">Denuncie.</span>
          </h1>
          <p>
            O roubômetro recebe, organiza e acompanha denúncias de desvio de
            dinheiro público, propina, fraude em licitação e outros crimes
            contra a administração pública — com total sigilo para quem
            denuncia.
          </p>
          <div className="fx gap16" style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("/denuncia")}>
              Fazer denúncia
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/acompanhar")}>
              Já denunciei, quero acompanhar
            </button>
          </div>
        </div>
        <div className="wrap">
          <div className="meter-wrap">
            <div className="meter-label">roubômetro — valor total estimado desviado</div>
            <div className="meter-value">{formatoMoeda.format(resumo.total_estimado)}</div>
            <div className="meter-sub">
              {resumo.quantidade_casos} casos registrados ·{" "}
              <a onClick={() => navigate("/recentes")} style={{ cursor: "pointer" }}>
                ver todos
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section wrap">
        <h2>Como funciona</h2>
        <p className="section-lead">Um processo simples, pensado para proteger quem tem coragem de falar.</p>
        <div className="pillars">
          <div className="pillar">
            <div className="pillar-num">01</div>
            <h3>Relate o caso</h3>
            <p>Preencha um formulário guiado em etapas: categoria, detalhes, envolvidos e provas.</p>
          </div>
          <div className="pillar">
            <div className="pillar-num">02</div>
            <h3>Escolha o sigilo</h3>
            <p>Você decide se identifica ou permanece completamente anônimo — em qualquer etapa.</p>
          </div>
          <div className="pillar">
            <div className="pillar-num">03</div>
            <h3>Acompanhe o status</h3>
            <p>Receba um código de protocolo e consulte o andamento da apuração quando quiser.</p>
          </div>
        </div>
      </div>

      <div className="cta-band">
        <h2>Toda denúncia é um passo contra a impunidade</h2>
        <p>Leva menos de 5 minutos. Seus dados podem permanecer em sigilo total.</p>
        <button className="btn btn-dark" style={{ marginTop: 20 }} onClick={() => navigate("/denuncia")}>
          Começar denúncia
        </button>
      </div>
    </>
  );
}
