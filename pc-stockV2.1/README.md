# PC-Stock

Sistema web de controle de estoque de peças de computador, desenvolvido com **HTML**, **JavaScript Vanilla**, **Bootstrap 5.3.8 via CDN**, **jQuery via CDN**, **Sass/SCSS**, **Vite**, **Web Storage**, **JSON Server** e a API pública **ViaCEP**.

## Estrutura do projeto

```text
pc-stock/
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── new-product/
│   ├── stock-entry/
│   ├── stock-exit/
│   └── history/
├── src/shared/
│   ├── api.js
│   ├── auth.js
│   ├── historico.js
│   ├── jquery-features.js
│   ├── movimentacoes.js
│   ├── produtos.js
│   ├── utils.js
│   └── viacep.js
├── assets/
│   ├── images/
│   ├── scss/
│   └── styles/
├── docs/
├── db.json
├── package.json
├── vite.config.js
└── README.md
```

## Bibliotecas por CDN

Seguindo a orientação da avaliação, as páginas HTML importam diretamente por CDN:

- Bootstrap CSS e Bootstrap Bundle 5.3.8;
- jQuery 3.7.1;
- jQuery Mask Plugin 1.14.16 na tela de entrada.

O NPM é utilizado para ferramentas de desenvolvimento, como Vite, Sass, ESLint, Prettier e JSON Server.

## Rodando localmente

```bash
npm install
npm run build:css
npm run api
npm run dev
```

Abra dois terminais:

```bash
# Terminal 1 — API fake
npm run api

# Terminal 2 — Front-end
npm run dev
```

- Front-end: `http://localhost:5173`
- JSON Server: `http://localhost:3000`

## Como testar a API pública ViaCEP

1. Faça login com o usuário de teste.
2. Abra **Entrada**.
3. No bloco **API pública ViaCEP**, informe um CEP, por exemplo `01001-000`.
4. Clique em **Buscar endereço** ou saia do campo usando `Tab`.
5. O JavaScript valida o CEP, faz uma requisição assíncrona com `fetch()` e preenche rua, bairro, cidade e UF sem recarregar a página.
6. Para testar o erro, informe `99999-999`. A aplicação exibe uma mensagem informando que o CEP não foi encontrado.

A consulta está implementada em `src/shared/viacep.js` e usa tratamento com `try/catch`, validação por Regex, estado de carregamento e mensagens de sucesso/erro.

## Persistência

- O `localStorage` mantém o usuário autenticado, dados de contingência e o último produto cadastrado.
- O JSON Server persiste produtos, entradas e saídas em `db.json`.
- Se o JSON Server estiver desligado, a aplicação mantém uma cópia local para não perder a navegação; para comprovar os IDs 22 e 23, demonstre as requisições na aba **Network** com `npm run api` ativo.

## Scripts

```bash
npm run dev           # servidor de desenvolvimento Vite
npm run api           # JSON Server na porta 3000
npm run sass          # recompila SCSS ao salvar
npm run build:css     # compila SCSS para CSS
npm run format        # formata o projeto com Prettier
npm run format:check  # verifica a formatação
npm run lint          # analisa o JavaScript com ESLint
npm run lint:fix      # tenta corrigir problemas do ESLint
npm run build         # compila o CSS e gera a pasta dist
npm run preview       # testa o build final
```

## Usuário de teste

- E-mail: `cliente@email.com`
- Senha: `123456`

## Checklist completo

### RA1 — Framework CSS e responsividade

- [ ] **ID 01** — Protótipos mobile e desktop. **Anexar no README o link ou prints do projeto criado no Stitch.**
- [x] **ID 02** — Layout responsivo com Grid/Flexbox do Bootstrap.
- [x] **ID 03** — Layout responsivo com CSS Grid, Flexbox e media queries próprias.
- [x] **ID 04** — Componentes Bootstrap, incluindo botões, formulários, tabelas e modal.
- [x] **ID 05** — Unidades relativas `%`, `rem`, `vh`, `vw` e `clamp()`.
- [x] **ID 06** — Design System consistente documentado em `docs/DESIGN.md`.
- [x] **ID 07** — SCSS modular com variáveis, mixins e função.
- [x] **ID 08** — Tipografia fluida com `clamp()`.
- [x] **ID 09** — Imagens responsivas com `object-fit` e containers relativos.
- [x] **ID 10** — Imagens WebP com `picture`, `srcset`, `sizes` e lazy loading.

### RA2 — Formulários e validações

- [x] **ID 11** — Validação HTML nativa, limites, campos obrigatórios e mensagens de feedback.
- [x] **ID 12** — Regex para e-mail, nome, lote, CNPJ e CEP.
- [x] **ID 13** — Elementos `select` para seleção de produtos.
- [x] **ID 14** — Leitura e escrita no `localStorage` com JSON.

### RA3 — Ferramentas e organização

- [x] **ID 15** — Node.js e NPM para scripts e dependências de desenvolvimento.
- [x] **ID 16** — Git/GitHub, branch `main` e `.gitignore`.
- [x] **ID 17** — README padronizado com checklist completo.
- [x] **ID 18** — Arquivos organizados por páginas, responsabilidades e módulos compartilhados.
- [x] **ID 19** — ESLint e Prettier configurados.

### RA4 — Bibliotecas JavaScript

- [x] **ID 20** — jQuery para eventos, filtro, manipulação do DOM e animações.
- [x] **ID 21** — jQuery Mask Plugin aplicado aos campos CNPJ e CEP.

### RA5 — APIs

- [x] **ID 22** — Requisições assíncronas `POST` e `PATCH` para o JSON Server.
- [x] **ID 23** — Requisições assíncronas `GET` para exibir dados do JSON Server.
- [x] **ID 24** — Requisição assíncrona direta para a API pública ViaCEP, com exibição dos dados e tratamento de erros.

## Protótipo — completar antes da entrega

Inclua aqui o link do Stitch e/ou os prints das versões mobile e desktop:

```text
Link do protótipo: COLE_AQUI
Print mobile: docs/prototipo-mobile.png
Print desktop: docs/prototipo-desktop.png
```

## GitHub Pages

O `vite.config.js` usa a base `/Projeto_Pericles_WEB2/`. Após testar o build, publique novamente a pasta `dist`:

```bash
npm run deploy
```

O JSON Server permanece local, conforme permitido na atividade. A consulta ViaCEP funciona diretamente no GitHub Pages por ser uma API pública acessada pelo navegador.
