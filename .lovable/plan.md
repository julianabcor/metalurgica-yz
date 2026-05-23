Vou ajustar a experiência para a área de gestor ficar fácil de encontrar e o redirecionamento não falhar.

Plano:
1. Corrigir o carregamento da role no `useAuth`, garantindo que `ready` só fique verdadeiro depois que a role do usuário já foi carregada.
2. No login/cadastro, aguardar a role corretamente antes de redirecionar para `/gestao` ou `/dashboard`.
3. Adicionar uma entrada visível para gestores acessarem a área de gestão quando estiverem logados, evitando depender só do redirect automático.
4. Manter a segurança atual: só usuários com role `gestor` conseguem abrir `/gestao`; operadores continuam no portal normal.

Detalhe: a “aba de gestor” não aparece no menu do operador porque hoje a área de gestão é uma página separada em `/gestao`, e o app esconde o shell normal para gestores. Vou deixar isso mais claro e acessível.