# Build Construction - Controle de Tarefas

## Objetivo

Este projeto e um app frontend estatico para gestao de atividades, integrado ao Supabase pelo schema `gestao_atividades`.

Nao existe etapa obrigatoria de build neste momento. O app roda diretamente pelo `index.html`, preservando a arquitetura atual e evitando dependencias extras.

## Arquivos de entrada

- `index.html`: ponto de entrada do navegador e carregamento das bibliotecas CDN.
- `style.css`: estilos globais complementares ao Tailwind CDN.
- `app-core.js`: constantes, autenticacao configurada, normalizacao de setores/objetivos e utilitarios compartilhados.
- `motorbackend.js`: camada de persistencia e autenticacao Supabase.
- `script.js`: interface React, telas, estados e orquestracao de acoes.

## Ordem de carregamento

1. Tailwind CDN
2. React CDN
3. ReactDOM CDN
4. Supabase CDN
5. `app-core.js`
6. `motorbackend.js`
7. `script.js`

Essa ordem e obrigatoria porque `motorbackend.js` e `script.js` dependem das configuracoes expostas por `app-core.js`.

## Autenticacao contextual

O dashboard e a tela inicial do sistema. Ele deve abrir sem login para consulta operacional.

O login aparece somente em acoes protegidas:

- `Nova Atividade`: exige login do usuario responsavel pelo setor.
- `Painel do Gestor`: exige login de gestor.

Finalizacao de atividade:

- Se ja existir usuario autenticado, a atividade e enviada para avaliacao sem pedir senha novamente.
- Se nao existir usuario autenticado, o app solicita a senha de login do setor responsavel.
- A senha de finalizacao deve ser sempre a mesma senha cadastrada no Supabase Auth para o usuario vinculado ao setor.

Menu do usuario:

- Quando nao ha sessao ativa, o cabecalho mostra `Entrar`.
- Quando ha sessao ativa, o icone de perfil abre opcoes de historico, atividades do setor, analises do usuario e sair.
- `Historico de atividades` mostra atividades realizadas, em execucao e futuras.
- `Atividades do setor` filtra atividades em que o setor do usuario participa como executor ou solicitante.
- `Analises do usuario` consolida custo, atrasos, prazos, anexos e carga operacional para o usuario comum.

Usuario gestor inicial:

```text
gestao1@maisintegradora.com.br
```

A senha nao deve ficar gravada em arquivo do projeto. O login usa `signInWithPassword` do Supabase.

Usuarios de setor devem ser cadastrados no Supabase Auth e vinculados ao setor pela tabela `profiles.sector_id`.

Requisito no Supabase:

- Criar os usuarios em `Authentication > Users`.
- Confirmar que cada usuario consegue autenticar por email/senha.
- Vincular usuarios setoriais em `gestao_atividades.profiles.sector_id`.
- Manter `profiles.email`, `profiles.sector_id` e `sectors.name` consultaveis pelo app para localizar o usuario do setor quando a finalizacao ocorrer sem sessao ativa.
- Manter o schema `gestao_atividades` exposto em `Project Settings > API > Exposed schemas`.
- Permitir leitura publica das tabelas/views usadas pelo dashboard, caso RLS esteja habilitado.

## Persistencia

As acoes de criacao, avaliacao, finalizacao e alteracao de prazo so sao confirmadas na interface apos retorno positivo do Supabase.

Se o Supabase falhar, o app mostra uma mensagem de erro e nao salva uma copia local temporaria como se fosse sucesso.

## Complemento da ficha da atividade

A ficha da atividade pode ser complementada depois do cadastro somente em campos ainda vazios.

Campos liberados para complemento:

- Objetivo macro quando estiver vazio ou no fallback `Geral`.
- Cliente/fornecedor quando vazio.
- Dados de deslocamento quando nao informados.
- Dados de custo quando nao informados.

Regra de seguranca:

- O frontend mostra apenas campos complementaveis.
- O backend valida novamente o registro atual antes de salvar.
- Campos ja preenchidos nao podem ser sobrescritos por esse fluxo.
- O complemento exige login ativo de gestor ou de usuario vinculado a um setor participante da atividade.
- Cada complemento grava historico em `task_history` com acao `ficha_complementada`.

## Sincronizacao com o banco

O app carrega setores, objetivos e tarefas diretamente do Supabase. A lista fixa de `app-core.js` fica apenas como fallback quando o banco nao retorna setores.

Alteracoes feitas diretamente no banco em tabelas operacionais devem refletir na interface por realtime:

- `sectors`
- `macro_objectives`
- `tasks`
- `task_attachments`
- `task_dependencies`
- `task_evaluations`
- `task_history`
- `task_comments`
- `temporary_followups`
- `notifications`
- `profiles`

Requisitos no Supabase:

- Manter o schema `gestao_atividades` exposto em `Project Settings > API > Exposed schemas`.
- Habilitar Supabase Realtime/Replication para as tabelas acima, especialmente `sectors`, `macro_objectives` e `tasks`.
- Ao excluir logicamente um setor, usar `is_active = false`; setores com `is_active` vazio ou `true` sao tratados como ativos para facilitar cadastros diretos no banco.
- Se realtime nao estiver habilitado, o app ainda atualiza ao voltar o foco da janela e faz uma verificacao periodica de seguranca.

## Anexos

Atividades podem receber anexos no momento do cadastro.

Fluxo tecnico:

- O frontend aceita imagens (`jpeg`, `png`, `webp`, `gif`) e PDF.
- Limite local: ate 5 arquivos por atividade, com ate 10 MB por arquivo.
- O upload usa o Supabase Storage no bucket `Registros - sobre tarefas`.
- O registro do arquivo usa a tabela `gestao_atividades.task_attachments`.
- Um resumo dos anexos tambem fica em `tasks.metadata.anexosResumo` para exibicao rapida no dashboard e na ficha da atividade.

Requisitos no Supabase:

- Manter/criar o bucket `Registros - sobre tarefas`.
- Permitir upload para usuarios autenticados.
- Permitir leitura/download conforme a politica desejada do projeto.
- Manter a tabela `task_attachments` gravavel por usuarios autenticados.
- Garantir que inserts anonimos continuem bloqueados por RLS.

## Normalizacao de dados

`app-core.js` centraliza a normalizacao de:

- Setores
- Objetivos macro
- Complexidades
- Status principais

Isso reduz duplicidade e evita criacao de registros separados por diferenca de acento, caixa, espaco ou pequenas variacoes de escrita.

## Validacao local

Com Node instalado, valide sintaxe com:

```bash
node --check app-core.js
node --check motorbackend.js
node --check script.js
```

Para testar em navegador, abra `index.html` ou sirva a pasta com um servidor estatico simples.

## Criterio de deploy

Antes de publicar:

- Dashboard abrindo sem login.
- Login de setor aparecendo somente ao clicar em `Nova Atividade`.
- Login de gestor aparecendo somente ao clicar em `Painel do Gestor`.
- Login com `gestao1@maisintegradora.com.br` autorizando o painel do gestor.
- Cadastro de atividade retornando mensagem de sucesso com usuario de setor autenticado.
- Finalizacao de atividade com usuario logado nao solicitando senha adicional.
- Finalizacao sem login solicitando a senha de login do setor responsavel.
- Registro aparecendo na tabela `gestao_atividades.tasks`.
- Reload da pagina mantendo as atividades carregadas do Supabase.
- Objetivos aparecendo em `gestao_atividades.macro_objectives`.
- Console do navegador sem erros `[App]` ou `[Supabase]`.
