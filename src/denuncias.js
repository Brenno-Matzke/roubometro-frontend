// Sem backend de denúncia ainda (ver Denuncia.jsx) — enquanto isso não
// existe, "minhas denúncias" fica salvo no localStorage do navegador,
// associado ao id do usuário logado no momento do envio.

const CHAVE = "minhas_denuncias";

function listarTodas() {
  const dados = localStorage.getItem(CHAVE);
  return dados ? JSON.parse(dados) : [];
}

export function salvarDenuncia(usuarioId, denuncia) {
  const todas = listarTodas();
  todas.push({ usuarioId, ...denuncia });
  localStorage.setItem(CHAVE, JSON.stringify(todas));
}

export function minhasDenuncias(usuarioId) {
  return listarTodas()
    .filter((d) => d.usuarioId === usuarioId)
    .reverse();
}

export function buscarPorProtocolo(protocolo) {
  return listarTodas().find((d) => d.protocolo === protocolo) || null;
}
