# Sabiencia — plano de implementação por prioridade

Data da análise inicial: 17/09/2026.

## 1. Objetivo deste documento

Evoluir o Sabiencia para um portfólio consistente, reproduzível e tecnicamente defensável diante de tech leads de empresas nacionais e internacionais.

Este documento é um plano de trabalho e um handoff para uma pessoa ou outra IA. Sua criação não representa execução das implementações abaixo. A análise que o originou foi estática: não foram executados aplicação, testes, build, instalações ou migrações, nem foi inspecionado o banco publicado. Os achados devem ser reconfirmados no checkout usado para implementação.

O objetivo principal é concluir jornadas reais e demonstráveis, alinhar documentação e comportamento e produzir evidências de qualidade. Aumentar a quantidade de telas não é uma prioridade.

## 2. Contexto que o implementador precisa conhecer

### Produto e stack

- LMS/EAD com três perfis: `gestor`, `professor` e `aluno`.
- Frontend: React 18, TypeScript, Vite, React Router, componentes Radix/shadcn, React Hook Form e Zod.
- Internacionalização: i18next/react-i18next, inglês como idioma inicial e alternância para português.
- Dados: páginas ligadas principalmente a `MockDataContext`; serviços e autenticação com integração parcial ao Supabase.
- Qualidade: Vitest, Testing Library, Playwright e GitHub Actions.
- Exportações: PDF, Excel e CSV.
- Estilos: CSS Tailwind pré-compilado e overrides em `src/styles/theme.css`.

### Diferença entre intenção e estado observado

A documentação descreve uma fonte de dados intercambiável entre mock e Supabase. O código analisado ainda não implementa essa troca de forma integrada: a autenticação pode ser real enquanto as páginas continuam usando dados fictícios. Existem operações que exibem sucesso sem atualizar dados, configurações duplicadas e testes que refletem rotas antigas.

### Leitura inicial obrigatória

1. `README.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`.
2. `CHANGELOG.md`, `I18N_HANDOFF.md`.
3. `src/design-system/SABIENCIA_BRAND.md`, `docs/brand-svgs/README.md`, `src/Attributions.md`.
4. `testsprite_tests/testsprite-mcp-test-report.md`: tratar como histórico, não como evidência atual.
5. `package.json`, `package-lock.json`, `tsconfig.json`, `.eslintrc.json`, `.env.example`.
6. `.github/workflows/ci.yml`, `vite.config.ts`, `src/vite.config.ts`, `src/vitest.config.ts`, `src/playwright.config.ts`.
7. `src/main.tsx`, `src/App.tsx`, `src/routes/`, `src/config/navigation.tsx`.
8. Contextos, tipos, serviços e migrações citados nas tarefas abaixo.

Os caminhos deste plano são relativos à raiz do repositório. Verificar instruções `AGENTS.md` aplicáveis antes de editar.

## 3. Regras de execução e decisões de escopo

1. Reconfirmar cada achado no código atual antes de corrigi-lo; registrar quando já estiver resolvido.
2. Preservar alterações existentes do usuário. Não substituir arquivos inteiros sem necessidade.
3. Trabalhar em entregas pequenas, revisáveis e com critérios de aceite explícitos.
4. Não usar credenciais reais, dados pessoais reais ou banco de produção para testes. Não imprimir `.env` ou tokens em relatórios.
5. Usar ambiente local ou isolado para validar migrações. A presença de uma migração destrutiva não autoriza executá-la.
6. Não modificar histórico de migrações já aplicado em ambientes compartilhados sem avaliar a estratégia de correção. Para esses ambientes, preparar migrações corretivas; a organização de um baseline novo deve ser explicitamente documentada.
7. Separar demo e integração real de maneira explícita. Uma falha de autenticação real não deve conceder sessão demo automaticamente.
8. Toda mensagem de sucesso deve corresponder a um efeito verificável. Funcionalidades fora do escopo devem estar claramente indisponíveis ou identificadas como simulação antes da interação.
9. Não apresentar proteção de rota, HMAC no navegador ou filtragem visual como segurança do banco.
10. Manter React/Vite e a estrutura útil existente. Introduzir ferramentas novas somente quando resolverem uma necessidade demonstrada.
11. Executar testes proporcionais à mudança, incluindo casos negativos relevantes. Não usar quantidade de testes como substituto de cobertura de comportamento.
12. Atualizar documentação junto com a implementação. Alegações como “pronto”, “seguro”, “100% traduzido” e “CI verde” exigem evidências atuais.
13. Não publicar, alterar banco remoto ou remover dados apenas porque esses passos aparecem neste documento; seguir a autorização da tarefa de implementação e as permissões do ambiente.

### Escopo recomendado

Entrega principal: demonstração completa e reproduzível de três jornadas conectadas:

1. Gestor cadastra aluno e cria sua matrícula em uma turma.
2. Professor autorizado lança nota e frequência nessa turma.
3. Aluno visualiza os valores, acessa material e acompanha seu progresso.

Preservar outras telas que já funcionem, mas não ampliar cupons, eventos, questionários, certificados, pagamentos externos ou streaming antes de concluir esse núcleo.

Para um portfólio frontend, a integração real pode permanecer identificada como evolução futura. Nesse caso, não anunciá-la como funcional e não expor caminhos de backend incompletos. Para um portfólio full stack, as tarefas de Supabase e seus testes são obrigatórias. O plano abaixo prepara ambos os caminhos; tarefas de segurança do backend precisam terminar antes da ativação de dados reais.

## 4. Ordem de execução

As prioridades indicam impacto no projeto, não uma classificação de vulnerabilidades confirmadas em produção.

| Ordem | ID | Prioridade | Entrega | Dependência |
| --- | --- | --- | --- | --- |
| 1 | T01 | P0 | Inventário, escopo e diagnóstico reproduzível | Nenhuma |
| 2 | T02 | P0 | Demo independente e inicialização previsível | T01 |
| 3 | T03 | P0 | Configuração e validação de base confiáveis | T02 |
| 4 | T04 | P0 | Modelo canônico e contratos de dados | T01–T03 |
| 5 | T05 | P0 | Migrações e schema reproduzíveis | T04 |
| 6 | T06 | P0 | Autorização por registro e políticas de banco | T04–T05 |
| 7 | T07 | P0 | Autenticação real e perfis consistentes | T02, T05–T06 |
| 8 | T08 | P1 | Persistência demo e integridade do domínio | T04, T06 |
| 9 | T09 | P1 | Jornada do gestor | T08 |
| 10 | T10 | P1 | Jornada do professor | T06, T09 |
| 11 | T11 | P1 | Jornada do aluno | T10 |
| 12 | T12 | P1 | Ações auxiliares honestas e funcionais | T07–T11 |
| 13 | T13 | P1 | Importação, exportação e backup corretos | T08–T12 |
| 14 | T14 | P1 | Paridade EN/PT e conteúdo editável | T09–T13 |
| 15 | T15 | P1 | Acessibilidade e experiência responsiva | T14 |
| 16 | T16 | P2 | CSS e design system sustentáveis | T15 |
| 17 | T17 | P2 | Performance e observabilidade medidas | T11, T16 |
| 18 | T18 | P1 | Validação final integrada e CI | Testes evoluem desde T03; fechamento após T17 |
| 19 | T19 | P1 | Documentação e evidências para portfólio | T18 |
| 20 | T20 | P1 | Preparação e validação de publicação | T19 |

Se a entrega escolhida for exclusivamente frontend, registrar T05–T07 como trilha de integração real ainda não entregue, mantendo o backend desativado. Aplicar mesmo assim as regras de escopo da interface, busca e dados demo de T06. Não marcar tarefas omitidas como concluídas.

## 5. Tarefas detalhadas

### T01 — Inventariar comportamento e estabelecer a linha de base

**Problema:** documentação, telas, serviços e relatórios históricos descrevem estados diferentes.

**Passos:**

1. Ler os arquivos essenciais e registrar o estado inicial do Git.
2. Enumerar rotas públicas e rotas dos três perfis, comparando-as com a navegação visível.
3. Para cada ação relevante, rastrear botão → handler → fonte de dados → efeito observável.
4. Montar uma matriz com: funcionalidade, perfil, rota, fonte, leitura, escrita, persistência, teste existente e limitação.
5. Classificar cada item como funcional, parcialmente funcional, simulado ou planejado.
6. Confirmar o escopo frontend ou full stack. Se não houver essa definição, avançar na demo e deixar a integração real desativada.
7. Quando a implementação estiver autorizada, estabelecer baseline de instalação, lint, tipos, build e testes em ambiente seguro. Registrar comandos e falhas; não corrigir ignorando regras ou removendo asserções.
8. Tratar resultados antigos de cobertura e TestSprite como histórico até nova execução.

**Arquivos principais:** documentação, `src/App.tsx`, `src/routes/`, `src/config/navigation.tsx`, páginas e handlers.

**Resultado gerado:** matriz de funcionalidades e lista de falhas reproduzíveis, vinculadas às tarefas deste plano.

**Aceite:** cada funcionalidade anunciada no README possui classificação e evidência de comportamento ou limitação explícita.

### T02 — Separar demo de Supabase e tornar o boot previsível

**Achados:** `AuthContext` exige `VITE_AUTH_SECRET` durante importação; o cliente Supabase pode lançar erro antes da renderização; o login demo tenta rede antes do fallback; `.env.example` não ativa a demo por padrão.

**Passos:**

1. Definir um modo explícito de aplicação e centralizar sua resolução. Pode-se adotar `VITE_APP_MODE=demo|supabase`; se isso substituir `VITE_DEMO_MODE`, documentar a migração.
2. Definir demo como caminho local sem credenciais. Uma configuração real incompleta deve produzir erro de configuração claro, sem entrar silenciosamente em demo.
3. Separar criação de sessão demo da autenticação Supabase. A escolha de perfil demo deve funcionar sem requisições de autenticação.
4. Instanciar o cliente Supabase somente quando necessário para o modo real.
5. Remover a dependência obrigatória de HMAC do cliente para a demo. Validar o formato do estado local e sua expiração sem apresentá-los como segurança contra adulteração.
6. Exibir o modo efetivamente ativo na interface. Não determinar o badge apenas pela presença de uma variável quando a sessão tiver outra origem.
7. Definir comportamento de restauração, troca de perfil, logout e reset da demo.
8. Restringir `/debug` a desenvolvimento explícito ou retirar a rota do produto publicado.
9. Atualizar `.env.example` e instruções para demo e integração real separadamente.

**Arquivos principais:** `src/contexts/AuthContext.tsx`, `src/lib/supabase.ts`, `src/components/auth/DemoLogin.tsx`, páginas demo, `DemoModeBadge.tsx`, `src/App.tsx`, `.env.example`.

**Resultado gerado:** demo independente da disponibilidade do Supabase e configuração de ambiente inequívoca.

**Aceite:** os três perfis demo abrem sem credenciais Supabase e sem chamadas de autenticação remota; erros de configuração real são compreensíveis; a demo não concede acesso a dados reais.

### T03 — Consolidar ferramentas, corrigir hooks e recuperar os testes de entrada

**Achados:** duas configurações Vite com capacidades diferentes; React 18 com tipos React 19; provedor de cobertura ausente no manifesto; E2E procuram login em `/`; hooks depois de retorno condicional; seeds aleatórias.

**Passos:**

1. Identificar a configuração Vite efetivamente usada pelos scripts. Consolidar aliases, assets e opções necessárias em uma fonte de verdade.
2. Decidir explicitamente se PWA faz parte do escopo. Se não fizer, ajustar a documentação; se fizer, implementar e testar a configuração ativa em etapa própria de publicação.
3. Alinhar versões dos tipos React com o runtime. Evitar atualização ampla de dependências durante essa correção.
4. Declarar o provedor de cobertura compatível com a versão adotada do Vitest e atualizar o lockfile.
5. Habilitar regras de hooks e revisar dependências de efeitos. Corrigir `useMemo` após `if (!user) return null` nos dashboards de aluno e professor, sem introduzir acesso a usuário nulo.
6. Tipar testes por uma configuração apropriada, caso permaneçam excluídos do `tsconfig` da aplicação. Executar Vitest não substitui verificação estática de tipos.
7. Atualizar E2E para `/login/aluno`, `/login/professor`, `/login/ceo` e `/demo`, conforme a jornada.
8. Definir idioma por teste. Preferir seletores por papel/nome acessível e evitar seletores ambíguos.
9. Substituir `Math.random()` das fixtures por dados fixos ou gerador com seed controlada. Controlar datas nos cenários sensíveis ao tempo.
10. Remover bypass de validação em código de produção baseado em `NODE_ENV === 'test'`; testar o comportamento real ou eliminar o mecanismo se deixou de existir em T02.
11. Rodar smoke tests de inicialização e entrada dos três perfis.

**Arquivos principais:** `package.json`, lockfile, configurações Vite/Vitest/Playwright/TypeScript/ESLint, `.github/workflows/ci.yml`, dashboards, `src/data/mockData.ts`, `src/e2e/`, `src/test/setup.ts`.

**Resultado gerado:** ferramentas coerentes e baseline de testes que representa as rotas atuais.

**Aceite:** instalação limpa e comandos de lint, tipos, build e smoke tests reproduzíveis; nenhuma regra de hooks violada nos componentes alterados; fixtures estáveis.

### T04 — Definir modelo canônico e contratos de acesso a dados

**Achados:** serviços consultam tabelas ausentes das migrações; nomes de campos e status divergem; páginas estão acopladas aos mocks.

**Passos:**

1. Desenhar as relações do núcleo: usuário, perfil, curso, disciplina, turma, atribuição de professor, matrícula, avaliação, nota, aula/frequência, material e progresso.
2. Escolher como alunos e professores se relacionam com `usuarios`. Evitar manter simultaneamente modelos incompatíveis.
3. Definir nomes canônicos para `nome`/`nome_completo`, `foto_url`/`avatar_url`, `ativa`/`ativo` e status de pagamento/matrícula.
4. Diferenciar identificador de autenticação, identificador de usuário e identificadores de entidades. Definir unicidade e vínculos.
5. Definir tipos de domínio separados dos formatos de transporte. Datas de calendário e instantes devem ter semântica explícita.
6. Gerar tipos do banco quando houver schema consolidado; mapear respostas para domínio por adaptadores explícitos.
7. Criar contratos pequenos por domínio: listar, buscar, cadastrar, atualizar e operações acadêmicas em lote. Definir erros e resultado de sucesso.
8. Implementar adaptador demo e adaptador Supabase com contratos equivalentes. A UI não deve decidir a fonte em cada página.
9. Migrar por fluxo, começando por alunos/matrículas, notas e frequência. Remover caminhos substituídos apenas depois de verificar consumidores.
10. Trocar `any` nas fronteiras críticas por tipos ou validação de entrada, priorizando autenticação e mutações.

**Arquivos principais:** `src/types/`, `src/schemas/`, `src/services/supabaseData.ts`, `src/hooks/useSupabaseData.ts`, `src/contexts/MockDataContext.tsx`, `src/hooks/supabase/index.ts`.

**Resultado gerado:** modelo documentado e interfaces de dados utilizáveis pelos dois modos.

**Aceite:** uma mesma jornada usa o mesmo contrato independentemente do adaptador; nenhum campo depende de coerção para esconder incompatibilidade de schema.

### T05 — Reconstruir a trilha segura de schema e migrações

**Achados:** migração `004` trunca todas as tabelas de domínio; scripts SQL de correção estão fora de uma sequência clara; `CREATE POLICY IF NOT EXISTS` é sintaxe inválida.

**Passos:**

1. Investigar quais migrações já foram aplicadas nos ambientes existentes, sem executar mudanças neles.
2. Definir estratégia de baseline local e de migrações corretivas para ambientes compartilhados.
3. Retirar a operação de purge do caminho normal de evolução. Se ainda necessária para desenvolvimento, isolá-la como ferramenta explicitamente destrutiva, com restrição ao ambiente de teste.
4. Adaptar schema ao modelo de T04 e incluir tabelas/views realmente usadas pelos serviços.
5. Adicionar constraints relevantes: vínculos válidos, unicidade de matrícula, nota válida, peso positivo e chave de unicidade para registro de frequência conforme a aula definida.
6. Definir restrição, arquivamento ou cascata para cada exclusão. Não decidir por cascata indiscriminada.
7. Consolidar SQL avulso e corrigir criação/recriação de políticas por mecanismos suportados.
8. Criar seeds fictícias estáveis para os três perfis e seus vínculos acadêmicos.
9. Preparar instruções de execução local e requisitos do Supabase CLI/runtime, se adotado.
10. Validar aplicação completa em banco descartável vazio e uma atualização representativa preservando dados.

**Arquivos principais:** `supabase/migrations/`, `supabase/rls_policies.sql`, `fix-usuarios-rls-policies.sql`, scripts de seed/purge, serviços.

**Resultado gerado:** banco reproduzível pelo repositório sem limpeza de dados como efeito colateral de evolução.

**Aceite:** instalação nova produz schema e seeds utilizáveis; atualização normal não trunca dados; queries do núcleo correspondem a objetos existentes.

### T06 — Implementar autorização por registro, coluna e vínculo

**Achados:** helpers permissivos; formulários não usam `professorId` para restringir turmas; busca percorre dados completos; políticas próprias não protegem campos administrativos; possível recursão em política de `usuarios`.

**Passos:**

1. Criar matriz por recurso/operação para gestor, professor, aluno e usuário não autenticado.
2. Definir escopo: professor somente em turmas/disciplinas atribuídas; aluno somente em registros próprios e materiais autorizados de suas matrículas.
3. Fazer helpers negarem acesso quando faltarem dados de vínculo. Cobrir casos de vínculo inexistente, matrícula inativa e identificador de outro usuário.
4. Aplicar regras à busca antes de montar resultados. Filtrar pagamentos, notificações, observações, comunicados, alunos e materiais conforme sua política.
5. Revisar `canEditAluno`, `canViewTurma`, `canLancarNotas` e a utilização efetiva nos fluxos.
6. No backend, criar políticas por operação para cada tabela exposta. RLS habilitada sem política não equivale a fluxo funcional.
7. Remover leitura ampla de usuários para login e evitar dependência circular na política que descobre o papel. Se usar funções privilegiadas, revisar dono, permissões, schema/search path e retorno mínimo.
8. Restringir alteração de `role`, `auth_id` e demais campos administrativos por privilégios de coluna, funções controladas ou modelo equivalente. Validar também inserção, não só atualização.
9. Rever login por CPF: não expor coleção de usuários nem usar RPC pública que permita enumeração de CPF/e-mail. Para o portfólio, login real por e-mail é opção mais simples; se CPF permanecer, implementar resolução protegida e limitação de abuso.
10. Criar testes reais de RLS/API com tokens de usuários distintos. Não utilizar chave administrativa para simular acesso do usuário comum.

**Arquivos principais:** `src/utils/permissions.ts`, testes, formulários de notas/frequência, `GlobalSearch.tsx`, `searchService.ts`, migrações e políticas.

**Resultado gerado:** política de autorização documentada, aplicada na UI e, no modo real, imposta no banco/API.

**Aceite:** aluno não acessa dados de outro aluno; professor não atua em turma alheia; usuário não altera seu próprio papel; busca respeita os mesmos limites; testes diretos de API confirmam as negativas.

### T07 — Consolidar autenticação real, sessão e edição de perfil

**Achados:** sessão local e Supabase coexistem; restauração local não representa necessariamente sessão real válida; perfil é buscado por e-mail; `ativo` é copiado sem bloqueio explícito no login observado.

**Passos:**

1. Usar a sessão Supabase como fonte da identidade no modo real, mantendo sessão demo separada.
2. Buscar perfil pelo vínculo estável com o usuário autenticado, de acordo com T04.
3. Definir tratamento de usuário inativo, perfil ausente, sessão expirada e falha ao carregar perfil.
4. Definir política de expiração: absoluta ou renovável. Alinhar PRD e implementação; não prometer prazo fixo se cada refresh o prorroga.
5. Testar eventos de entrada, renovação e saída sem restaurar perfil antigo ou sessão de outro usuário.
6. Garantir limpeza do estado sensível, cache e histórico pertinente na saída ou troca de usuário.
7. Separar edição de campos pessoais de edição administrativa. Usar campos compatíveis com o schema.
8. Implementar alteração de senha real, com tratamento de erros, ou retirar essa ação do modo real até estar pronta.
9. Remover mensagens e comentários que descrevam HMAC de cliente como proteção contra XSS.

**Resultado gerado:** ciclo de sessão único por modo e perfil associado corretamente à identidade autenticada.

**Aceite:** reload, expiração, logout, usuário inativo e perfil ausente têm comportamento testado; senha só é confirmada como alterada após resposta de sucesso real.

### T08 — Dar consistência e persistência ao estado demo

**Achados:** dados centrais vivem em memória; exclusões não tratam todas as relações; parte do estado de videoaulas possui persistência diferente.

**Passos:**

1. Definir escopo da demo: um workspace fictício local por navegador, com troca explícita de papel para demonstrar a jornada conectada.
2. Persistir o estado necessário em armazenamento local com versão de schema, validação e tratamento de conteúdo corrompido/quota.
3. Manter os vínculos de domínio consistentes em cada mutação. Criar operações de matrícula, notas e frequência, atualmente ausentes do contexto principal.
4. Definir IDs sem colisão e relógio/seed controláveis nos testes.
5. Implementar restauração dos dados iniciais como ação explícita, com aviso de perda das alterações demo.
6. Definir quais estados pertencem ao workspace e quais pertencem ao usuário: notas acadêmicas são compartilhadas conforme permissões; histórico de busca e preferências pessoais precisam de escopo apropriado.
7. Unificar persistência de progresso/anotações e do núcleo, ou documentar contratos claros entre eles.
8. Garantir que adaptador Supabase não leia nem escreva dados dessa demo.

**Resultado gerado:** dados demo editáveis e consistentes entre telas, sessões e perfis autorizados.

**Aceite:** alterações sobrevivem a reload; reset retorna à seed conhecida; exclusões não deixam referências órfãs; troca de perfil permite demonstrar apenas os dados autorizados.

### T09 — Concluir a jornada do gestor

**Passos:**

1. Validar cadastro de aluno, normalização de campos e tratamento de duplicidade de CPF/e-mail conforme regras do domínio.
2. Implementar criação de matrícula com turma, status e data. Cadastro de pessoa e matrícula devem ter responsabilidades claras.
3. Quando uma ação envolver múltiplas escritas reais, garantir atomicidade ou recuperação explícita de falha parcial.
4. Atualizar listagem, detalhe, turma e dashboard a partir da mesma fonte.
5. Implementar edição e arquivamento/exclusão conforme política de vínculos de T05/T08.
6. Exibir estados de carregamento, vazio, erro e retry coerentes; impedir submissão duplicada.
7. Testar cadastro válido, duplicado, matrícula inválida, falha e navegação para o registro criado.

**Arquivos principais:** páginas de alunos/turmas do gestor, `AlunoForm`, schemas de usuário/turma, repositórios e `useDashboardStats`.

**Resultado gerado:** aluno criado e matriculado aparece corretamente nos pontos relevantes do sistema.

**Aceite:** cadastrar → matricular → consultar turma → recarregar mantém os dados, sem contagem incoerente ou sucesso em falha parcial.

### T10 — Concluir lançamento de notas e frequência

**Passos:**

1. Filtrar turmas e disciplinas pelas atribuições do professor atual.
2. Carregar alunos pela matrícula válida na turma selecionada.
3. Ao trocar turma, disciplina, avaliação ou aula, limpar/recarregar rascunhos para não enviar dados de uma seleção anterior.
4. Modelar avaliação, peso, data e nota; validar intervalo e campos obrigatórios no contrato de domínio e no backend quando aplicável.
5. Definir identidade da aula/frequência e distinguir criar de atualizar para evitar duplicações.
6. Substituir os `setTimeout` e logs de simulação por operações de escrita do adaptador ativo.
7. Tratar lote como operação consistente. Em caso de falha, preservar rascunho e informar o que ocorreu, sem declarar sucesso total indevidamente.
8. Atualizar consultas, indicadores e histórico somente após confirmação da escrita.
9. Testar professor sem vínculo, turma diferente, nota fora do intervalo, peso inválido, repetição do envio e atualização de registro existente.

**Arquivos principais:** `LancamentoNotasForm.tsx`, `ListaPresencaForm.tsx`, páginas `NotasPage.tsx` e `FrequenciaPage.tsx`, schemas, repositórios.

**Resultado gerado:** notas e presenças realmente registradas e consultáveis por outros perfis autorizados.

**Aceite:** a nota/frequência lançada aparece para o aluno correto; falha de persistência não limpa o formulário nem mostra confirmação de sucesso.

### T11 — Concluir a jornada do aluno e reconciliar indicadores

**Passos:**

1. Fazer notas e frequência consumirem os registros produzidos em T10.
2. Definir como selecionar matrícula quando houver mais de uma; não depender de um `find` arbitrário sem regra documentada.
3. Garantir que disciplinas e materiais venham do curso/turma autorizados e respeitem visibilidade.
4. Fazer download/acesso abrir conteúdo existente. Um URL fictício não deve contar como material funcional.
5. Persistir progresso e anotações por aluno e conteúdo.
6. Diferenciar progresso temporal do curso de progresso de aprendizagem. O tempo decorrido entre início e fim não comprova aulas concluídas.
7. Centralizar regras de média, frequência, arredondamento e situação acadêmica; harmonizar com consultas/funções SQL se existirem.
8. Definir tratamento de frequência justificada e de avaliações ausentes conforme regra do produto.
9. Testar a sequência completa gestor → professor → aluno, com expectativas calculáveis.

**Arquivos principais:** páginas de aluno, `VideoaulasContext.tsx`, componentes de vídeo, cálculos e dashboards.

**Resultado gerado:** painel acadêmico coerente com as operações anteriores e com o acesso ao conteúdo.

**Aceite:** valores de detalhe, relatório e dashboard concordam para o mesmo conjunto de dados; conteúdos e progresso pertencem ao aluno correto.

### T12 — Corrigir ações auxiliares e feedbacks enganosos

**Passos:**

1. Revisar perfil, foto, senha, cadastro de professor, certificados, configurações, uploads e botões de relatório.
2. Para cada ação, decidir: implementar no escopo ou indicar indisponibilidade de forma clara antes da interação.
3. Perfil demo deve atualizar seu adaptador; perfil real deve aguardar resposta persistida.
4. No upload real, implementar bucket/políticas de Storage, validação de tamanho/tipo e tratamento de falha; no demo, usar arquivo local persistível ou fixture existente com comportamento descrito.
5. Não criar URLs fictícias como se fossem arquivos enviados.
6. Se um callback for assíncrono, aguardá-lo antes de limpar formulário e apresentar sucesso.
7. Garantir cancelamento e limpeza de timers/object URLs quando utilizados.
8. Para certificados, implementar geração e regras de elegibilidade somente se permanecerem no escopo; caso contrário, não apresentar download fictício.

**Resultado gerado:** interface sem confirmações falsas nas funcionalidades anunciadas.

**Aceite:** cada botão funcional produz resultado verificável; toda simulação remanescente é identificada com clareza e não recebe dados reais.

### T13 — Integrar backup e endurecer importação/exportação

**Achados:** backup lê chaves que a fonte principal não grava; restauração não atualiza o contexto; CSV é separado por linha antes de interpretar campos; exportação não escapa todos os casos de quebra de linha.

**Passos:**

1. Decidir se backup de demo é necessário para a entrega. Se permanecer, fazê-lo consumir o repositório ativo, não chaves de storage antigas.
2. Incluir entidades e relacionamentos necessários, versão, data e identidade coerente do autor.
3. Validar arquivo, estrutura, IDs, vínculos e compatibilidade de versão antes de restaurar.
4. Definir mesclagem por ID, conflito e substituição. Não concatenar arrays gerando duplicatas.
5. Atualizar o estado consumido pela interface após restaurar; nunca importar sessão, senha ou tokens.
6. Usar parser CSV adequado para aspas, delimitadores, BOM e campos multilinha; limitar tamanho e quantidade de registros conforme necessidade do portfólio.
7. Oferecer prévia e erros por linha antes de confirmar importação. Garantir coerência de datas, números e duplicidades.
8. Escapar corretamente CSV de saída e tratar conteúdo que possa ser interpretado como fórmula por planilhas, conforme política documentada.
9. Verificar que exportações respeitam o mesmo escopo de acesso da tela e não exportam dados ocultos de outros usuários.
10. Revisar dependências de importação/exportação com avisos oficiais e lockfile atual; não afirmar vulnerabilidade apenas pela idade da versão.
11. Testar round-trip representativo, arquivo inválido, multiline, caracteres PT/EN e restauração com vínculos.

**Arquivos principais:** `backupService.ts`, `importService.ts`, `exportService.ts`, hooks e componentes de exportação/importação.

**Resultado gerado:** arquivos que representam os dados reais da sessão demo/domínio e operações de restauração previsíveis.

**Aceite:** backup → alteração → restauração recupera o estado previsto; CSV preserva campos complexos; erros não geram importação parcial silenciosa.

### T14 — Concluir internacionalização sem sobrescrever conteúdo editável

**Achados:** `t()` nas páginas não garante paridade; schemas, utilitários e exportações mantêm textos fixos; tradução por ID pode encobrir edições de dados de exemplo.

**Passos:**

1. Reavaliar o estado de `I18N_HANDOFF.md`; não repetir tarefas já concluídas somente porque estão na lista histórica.
2. Inventariar textos visíveis de páginas, componentes, erros, toasts, loading, validações, menus, busca e arquivos exportados.
3. Auditar chaves ausentes, duplicadas e colisões do deep merge. Organizar recursos por domínio quando isso simplificar manutenção.
4. Separar metadados traduzíveis das fixtures do conteúdo digitado pelo usuário. Após editar um nome, não substituí-lo novamente pelo texto fixo associado ao ID.
5. Centralizar formatação por locale para números, datas e tempo relativo. Idioma inglês não implica converter BRL em USD.
6. Transformar mensagens de validação em códigos/chaves ou schemas construídos com tradução; conferir atualização após alternar idioma.
7. Atualizar `document.documentElement.lang` e nomes acessíveis na troca de idioma.
8. Traduzir estados de erro e o fallback do `ErrorBoundary`, sem depender de contexto indisponível em falha de inicialização.
9. Testar jornadas e erros em EN/PT, reload da preferência e edição de entidade de exemplo seguida de troca de idioma.

**Resultado gerado:** experiência coerente nos dois idiomas e dados do usuário preservados.

**Aceite:** jornadas principais, validações e exportações funcionam em EN/PT; nenhuma edição desaparece por tradução; conteúdo livre é mantido como digitado.

### T15 — Validar acessibilidade, responsividade e estados de UX

**Passos:**

1. Dar nome acessível a botões de ícone, especialmente mostrar/ocultar senha e ações de tabela.
2. Conferir associação de labels, descrição de erro e indicação de campo obrigatório.
3. Revisar foco de abertura/fechamento de modal, menu mobile, busca e confirmação de exclusão.
4. Validar skip link, landmarks, hierarquia de títulos e idioma do documento.
5. Verificar teclado e leitor de tela nas três jornadas, não somente no login.
6. Verificar contraste e diferenciação de estado sem depender exclusivamente de cor.
7. Validar mobile, tablet, desktop, zoom e fontes ampliadas; revisar tabelas largas, formulários e navegação.
8. Testar os temas e preferência de movimento reduzido.
9. Padronizar carregamento, vazio, erro, retry, sucesso e operação indisponível.
10. Acrescentar auditoria automatizada de acessibilidade se útil, mantendo verificação manual dos fluxos.

**Resultado gerado:** jornadas utilizáveis com diferentes dispositivos e formas de interação.

**Aceite:** nenhuma barreira crítica conhecida impede cadastro, lançamento e consulta por teclado; não há perda de conteúdo ou ações essenciais em viewport pequena; nomes acessíveis são corretos nos dois idiomas.

### T16 — Regularizar estilos e design system

**Passos:**

1. Mapear tokens e estilos efetivamente utilizados em `src/index.css`, `src/styles/theme.css` e componentes.
2. Estabelecer um processo reproduzível de geração de CSS compatível com a versão escolhida do Tailwind. Preservar referências visuais antes de mudar o pipeline.
3. Identificar classes construídas dinamicamente e garantir sua geração por mecanismos suportados.
4. Migrar overrides amplos para tokens semânticos quando apropriado, evitando corrigir tema escuro classe por classe indefinidamente.
5. Padronizar componentes recorrentes de página, formulário, tabela e feedback sem criar abstrações para casos únicos.
6. Atualizar guias da marca: retirar referências a arquivos/componentes inexistentes e alinhar símbolo, wordmark, fontes e tokens.
7. Validar regressões nas páginas de referência e nos dois temas.

**Resultado gerado:** estilos sustentáveis, documentação de marca atual e mudanças de UI reproduzíveis.

**Aceite:** novas classes válidas são incluídas no build; páginas principais mantêm layout esperado; tokens documentados correspondem ao código.

### T17 — Medir performance e adicionar diagnóstico mínimo

**Passos:**

1. Medir bundle inicial, chunks, tempo de abertura e interações das jornadas em build de produção.
2. Identificar custo de dados globais, traduções eager, providers e bibliotecas; não presumir gargalo apenas pelo tamanho de um arquivo-fonte.
3. Manter imports dinâmicos de exportação e reduzir carregamentos desnecessários comprovados.
4. Dividir estado/seletores por domínio onde o profiling mostrar rerenderizações relevantes.
5. Implementar paginação e consultas limitadas no modo real quando necessário; verificar índices a partir das consultas efetivas.
6. Tratar concorrência de requisições e respostas antigas em hooks, especialmente na troca de filtros ou usuário.
7. Definir orçamento de performance a partir de baseline documentada e ambiente de medição fixo.
8. Capturar erros de execução relevantes com identificador, versão e contexto mínimo, sem senhas, tokens, CPF ou payloads pessoais.
9. Distinguir log de diagnóstico de trilha de auditoria. `localStorage` não deve ser anunciado como auditoria confiável do backend.
10. Para ações reais críticas, registrar auditoria no servidor quando estiver no escopo, com acesso restrito.

**Resultado gerado:** medições comparáveis e falhas diagnosticáveis.

**Aceite:** relatório antes/depois com condições de medição; orçamento acordado atendido; erros relevantes podem ser investigados sem exposição de dados sensíveis.

### T18 — Fechar testes integrados e CI com evidências

Esta tarefa consolida testes que devem ser escritos ao longo das anteriores; não adiar validação para o final.

**Passos:**

1. Cobrir regras de domínio: matrícula, notas, frequência, vínculos, datas, arredondamento e status.
2. Cobrir contratos dos adaptadores com expectativas equivalentes quando pertinente.
3. Separar testes mockados de serviço de testes reais de schema/RLS. Nomear cada suíte de acordo com o que verifica.
4. Executar jornadas completas dos três perfis, incluindo uma mudança do professor observada pelo aluno.
5. Cobrir negativas: usuário não autenticado, outro perfil, outra turma, outro aluno, dados inválidos, backend indisponível e falha de escrita.
6. Testar isolamento demo/real, reload, logout, persistência, reset e preferência de idioma.
7. Atualizar screenshots de referência com dados determinísticos e revisão visual. Não aceitar snapshots novos automaticamente para encobrir regressões.
8. Garantir que testes demo não dependam de secrets ou serviços externos; usar ambiente isolado para os testes reais.
9. Configurar CI para instalação limpa, lint, tipos, build, testes com cobertura e E2E essenciais; publicar artefatos no caminho efetivamente gerado.
10. Registrar coverage das áreas críticas e exclusões justificadas. Não escolher percentual global arbitrário para mascarar lacunas.
11. Investigar flakiness; retries não substituem correção de condições de corrida.

**Resultado gerado:** pipeline reproduzível que demonstra comportamento e negação de acessos indevidos.

**Aceite:** execução verde do commit final em ambiente limpo, sem testes essenciais ignorados, sem bypass de lógica de produção e com relatórios acessíveis.

### T19 — Preparar documentação e narrativa de portfólio

**Passos:**

1. Reescrever README com objetivo, público, demo, setup real, jornadas, arquitetura, testes e limitações.
2. Explicar contribuição pessoal e decisões, sem atribuir capacidades ainda não entregues ao projeto.
3. Atualizar `docs/ARCHITECTURE.md` com o caminho real UI → contrato → adaptador → persistência e as fronteiras de segurança.
4. Atualizar PRD e changelog. Corrigir referências `src/src` e marcar relatórios históricos como históricos.
5. Registrar decisões curtas: isolamento da demo, fonte de identidade, modelo de domínio, autorização e estratégia de testes.
6. Resolver divergência entre `LICENSE` e `package.json` conforme a licença escolhida pelo proprietário, sem reinterpretar termos por conta própria.
7. Capturar screenshots atuais dos três perfis; remover instruções de placeholder quando substituídas.
8. Criar roteiro/vídeo curto mostrando as três jornadas e seu efeito real nos dados.
9. Criar estudo de caso em inglês com resumo em português: problema, escopo, arquitetura, decisões, desafios, validação e limitações.
10. Revisar links de repositório, demo e contato. Substituir valores marcados como placeholders somente com informações verificadas do proprietário.
11. Registrar ambiente e comandos dos resultados de testes/performance, sem inventar números ou afirmar resultado não executado.

**Resultado gerado:** material de apresentação coerente com o código, utilizável por um avaliador sem contexto prévio.

**Aceite:** um leitor entende rapidamente a proposta, acessa a demo, reproduz execução e encontra evidência das decisões e limitações.

### T20 — Preparar publicação e verificar a experiência entregue

**Passos:**

1. Escolher e documentar o alvo de hospedagem, configuração de build, pasta de saída e variáveis de cada modo.
2. Conferir reload de rotas internas e comportamento de caminhos inválidos.
3. Garantir que a demo pública use apenas dados fictícios e não receba credenciais administrativas.
4. Verificar favicon, metadados, imagem de compartilhamento e links de assets. O HTML analisado usa favicon vazio apesar de existirem arquivos de marca.
5. Se PWA estiver no escopo, validar manifesto, ícones, instalação e atualização. Não cachear dados autenticados indiscriminadamente.
6. Preparar preview para revisão, conforme ferramentas e autorização disponíveis.
7. Após publicação autorizada, executar smoke test da URL real nos três perfis e nos dois idiomas.
8. Verificar acesso direto, refresh, logout, reset demo e ausência de erros relevantes no console.
9. Registrar versão/commit publicado e procedimento simples de reversão.

**Resultado gerado:** versão pública correspondente ao código validado e pronta para compartilhamento.

**Aceite:** URL estável, caminhos internos funcionais, jornadas demonstráveis e README apontando para a versão correta.

## 6. Checklist final de entrega

- [ ] Nenhuma funcionalidade anunciada confirma escrita sem realizá-la.
- [ ] Demo abre sem credenciais e sem depender de autenticação remota.
- [ ] Demo e dados reais são isolados.
- [ ] Aluno cadastrado e matrícula aparecem em todos os pontos pertinentes.
- [ ] Professor atua somente em suas turmas/disciplinas.
- [ ] Nota e frequência salvas aparecem para o aluno correto.
- [ ] Busca e exportação respeitam o escopo de acesso.
- [ ] Persistência, reset e backup, quando oferecido, correspondem ao estado da UI.
- [ ] Banco reproduzível e RLS testada, se integração real estiver anunciada.
- [ ] Migração de evolução não apaga dados como operação de rotina.
- [ ] EN/PT cobrem jornadas, validações e estados de erro.
- [ ] Edição de conteúdo não é sobrescrita por tradução de fixture.
- [ ] Jornadas funcionam em celular, desktop, teclado e temas oferecidos.
- [ ] CI do commit entregue passa em ambiente limpo.
- [ ] Testes e métricas apresentados foram realmente executados e contextualizados.
- [ ] Documentação, licença, screenshots e links estão coerentes.
- [ ] Limitações remanescentes estão descritas de forma objetiva.
- [ ] Publicação, se realizada, foi validada separadamente do ambiente local.

## 7. Como outra IA deve continuar este plano

Use a seguinte instrução de handoff ao iniciar uma implementação:

> Leia `o-que-precisa-ser-feito.md` e as instruções do repositório. Reconfirme os achados no checkout atual. Execute as tarefas em ordem, respeitando dependências e o escopo autorizado. Comece por T01 e selecione a primeira entrega ainda não concluída. Não trate este plano como autorização para apagar dados, aplicar migrações remotas ou publicar. Preserve alterações existentes. Para cada entrega, informe arquivos alterados, comportamento antes/depois, testes executados e pendências. Não marque uma tarefa como concluída somente porque os arquivos foram editados: demonstre os critérios de aceite. Se o escopo for apenas frontend, mantenha o backend incompleto desativado e documentado.

### Registro de conclusão por tarefa

Ao implementar, acrescentar um registro com este formato:

```text
Tarefa: Txx — título
Status: não iniciada | em andamento | concluída | bloqueada | fora do escopo
Achado reconfirmado:
Decisão adotada:
Arquivos alterados:
Comportamento resultante:
Testes/comandos executados:
Resultados e evidências:
Critérios de aceite atendidos:
Pendências/riscos conhecidos:
Próxima tarefa e dependências:
```

Não registrar credenciais ou dados pessoais nesse histórico. Tarefas fora do escopo devem manter a justificativa e não ser apresentadas como funcionalidades entregues.
