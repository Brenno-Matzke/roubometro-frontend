// Sessão simplificada v1: guardamos o usuário logado no localStorage.
// Quando a etapa de JWT chegar, isto troca para um token com expiração —
// mas a interface (getUsuario / login / logout) pode continuar igual,
// então as páginas que já usam essas funções não precisam mudar.

const CHAVE = "usuario_logado";

export function salvarUsuario(usuario) {
  localStorage.setItem(CHAVE, JSON.stringify(usuario));
}

export function getUsuario() {
  const dados = localStorage.getItem(CHAVE);
  return dados ? JSON.parse(dados) : null;
}

export function logout() {
  localStorage.removeItem(CHAVE);
}
