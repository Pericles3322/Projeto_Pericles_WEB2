# PC-Stock

Projeto de controle de inventário desenvolvido a partir de protótipos criados no Stitch, usando **HTML**, **JavaScript**, **Bootstrap 5.3.8**, **Sass/SCSS**, **Vite** e **JSON Server**.

## Estrutura do projeto

```text
pc-stock/
├── pages/
│   ├── login/
│   │   ├── index.html
│   │   ├── login.js
│   │   └── login.scss
│   ├── dashboard/
│   │   ├── index.html
│   │   ├── dashboard.js
│   │   └── dashboard.scss
│   ├── new-product/
│   ├── stock-entry/
│   ├── stock-exit/
│   └── history/
├── src/shared/
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

## Estilos com SCSS separado

O projeto usa dois arquivos CSS compilados:

- `assets/styles/bootstrap.css`: CSS do Bootstrap 5.3.8 compilado a partir de `assets/scss/bootstrap.scss`;
- `assets/styles/style.css`: CSS personalizado do PC-Stock compilado a partir de `assets/scss/main.scss` e dos SCSS de componentes/telas.

Esse formato separa o framework dos estilos próprios do projeto, facilitando a manutenção e a explicação da atividade. Para alterar o visual do sistema, edite os arquivos `.scss`, não os arquivos `.css` compilados.

## Rodando localmente

```bash
npm install
npm run build:css
npm run api
npm run dev
```

- Frontend: `http://localhost:5173`
- API Fake: `http://localhost:3000`

## Scripts úteis

```bash
npm run sass          # observa alterações no SCSS
npm run build:css     # compila SCSS para CSS
npm run format        # formata arquivos com Prettier
npm run format:check  # verifica formatação com Prettier
npm run lint          # verifica JavaScript com ESLint
npm run lint:fix      # tenta corrigir problemas com ESLint
npm run build         # compila SCSS e gera build do Vite
```

## Usuário de teste

- Email: `cliente@email.com`
- Senha: `123456`

## Tecnologias e dependências principais

- Bootstrap 5.3.8
- Sass/SCSS
- Vite
- JSON Server
- JavaScript modular
- Prettier
- ESLint

## Checklist da avaliação

### RA1 - Utilizar Frameworks CSS para estilização e layouts responsivos

- [x] ID 02 - Implementa layout responsivo com Framework CSS usando Flexbox/Grid do Bootstrap.
- [x] ID 03 - Implementa layout responsivo com CSS puro, usando Flexbox, Grid e media queries próprias.
- [x] ID 04 - Utiliza componentes prontos do Bootstrap, incluindo botões, formulários, tabelas e modal.
- [x] ID 05 - Cria layout fluido usando unidades relativas como `%`, `rem`, `vh`, `vw` e `clamp()`.
- [x] ID 07 - Utiliza Sass/SCSS com variáveis, mixins e função para modularizar o código.
- [x] ID 08 - Aplica tipografia responsiva com `clamp()`.
- [x] ID 09 - Aplica responsividade de imagens com `object-fit` e containers relativos.
- [x] ID 10 - Otimiza imagens usando WebP e `srcset`/`sizes`.

### RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento

- [x] ID 15 - Configura ambiente com Node.js e NPM.
- [x] ID 16 - Utiliza boas práticas de versionamento com `.gitignore`.
- [x] ID 17 - Mantém README padronizado com checklist.
- [x] ID 18 - Organiza arquivos de forma modular.
- [x] ID 19 - Configura Prettier e ESLint para padronização e qualidade.

## Observação sobre imagens

Foram adicionadas imagens WebP responsivas em `assets/images/` para atender aos itens de responsividade e otimização de imagens da avaliação.
