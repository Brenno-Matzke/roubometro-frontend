import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-shell" style={{ textAlign: "center" }}>
      <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
        ERRO 404
      </div>
      <h1 style={{ fontSize: 40, marginTop: 14 }}>Página não encontrada</h1>
      <p className="section-lead" style={{ margin: "16px auto 28px", textAlign: "center" }}>
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link className="btn btn-primary" to="/">
        Voltar ao início
      </Link>
    </div>
  );
}
