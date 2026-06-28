# PC-Stock

### **Autor:** Péricles Expedito Andrade

Este projeto tem o foco de gerenciar e registrar quantidade de itens de peças de computadores dentro de um estoque, registrando saidas e entradas, com o foco em registrar de onde esta sendo comprado e seu fornecedor e em qual plataforma ou mercado de varejo foi vendido (amazon,mercado livre, loja fisica, etc), registrando as especificaçoes de cada produto
(Marca, Modelo, tipo de hardware, especificaçoes).

O frontend da aplicação foi desenvolvido com HTML, CSS e JavaScript e o backend foi simulado pela implementação de uma API Fake, usando o JSON Server.

## 📚 Documentação do Projeto

Para entender as regras de negócio, o escopo e a arquitetura técnica da aplicação, consulte os documentos abaixo:

- [📄 Product Requirements Document (PRD)](./docs/prd.md) - Visão geral, atores e histórias de usuário.
- [🛠️ Especificação Técnica (Tech Spec)](./docs/spec.md) - Diagrama de banco de dados (DER), dicionário de dados e rotas da API (JSON Server).

## 🎨 Design

- [🎨 Design System](./docs/design-system.md) - Identidade visual
- [🖼️ Protótipo no Stitch](https://stitch.withgoogle.com/projects/15142484790764489957) - Telas interativas da aplicação.

## 🌐 Site em Produção - GitHub Pages

- [📚 Readme do Projeto](./pc-stockV2.1/README.md) - Passo a passo de execução do Sistema

## 💻 Tecnologias e Dependências

No desenvolvimento da interface do projeto foi utilizado o **Bootstrap 5.3.8** como Framework CSS, com o objetivo de facilitar a criação de um layout responsivo e organizado para desktop, tablet e mobile.
A escolha do Bootstrap foi feita por ele possuir uma grande variedade de componentes prontos, como formulários, botões, tabelas, menus e sistema de grid,
o que ajudou bastante na construção das telas do sistema. Além disso, é uma tecnologia muito utilizada e bem mantida com atualizaçoes constantes no GitHub, o que traz mais segurança para o desenvolvimento e evolução do projeto.

Para integração com dados externos, foi escolhida a **RapidAPI**, utilizada como plataforma de acesso a APIs públicas.
Essa escolha foi feita porque a RapidAPI permite conectar o sistema com serviços externos de forma mais prática e flexível, facilitando futuras expansões do projeto.
No contexto do PC-Stock, a API pública agrega valor ao sistema por permitir implementar consultas externas, automações e recursos complementares que podem tornar o gerenciamento de estoque mais completo e dinâmico.

## Estilos com SCSS separado

O projeto usa dois arquivos CSS compilados:

- `assets/styles/bootstrap.css`: CSS do Bootstrap 5.3.8 compilado a partir de `assets/scss/bootstrap.scss`;
- `assets/styles/style.css`: CSS personalizado do PC-Stock compilado a partir de `assets/scss/main.scss` e dos SCSS de componentes/telas.

Esse formato separa o framework dos estilos próprios do projeto, facilitando a manutenção e a explicação da atividade. Para alterar o visual do sistema, edite os arquivos `.scss`, não os arquivos `.css` compilados.

Cada tela possui seu arquivo em `pc-stockV2.1/pages/<tela>/<tela>.scss`. Esses arquivos
são importados pelo `assets/scss/main.scss` e compilados juntos em
`assets/styles/style.css`. Os CSS individuais das páginas foram removidos para evitar
edições acidentais em arquivos gerados.

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

## ✅ Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.

- [x] ID 01 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design tradicionais (Figma, Quant UX ou Sketch) ou IA (Stitch).
- [x] ID 02 - Implementa layout responsivo com Framework CSS (Bootstrap, Materialize, Tailwind + DaisyUI) usando Flexbox ou Grid do próprio framework.
- [x] ID 03 - Implementa layout responsivo com CSS puro, usando Flexbox ou Grid Layout.
- [x] ID 04 - Utiliza componentes prontos de um Framework CSS (ex.: card, button) e componentes JavaScript do framework (ex.: modal, carousel).
- [x] ID 05 - Cria layout fluido usando unidades relativas (vw, vh, %, em, rem) no lugar de unidades fixas (px).
- [x] ID 06 - Aplica um Design System consistente (cores, tipografia, padrões de componentes) em toda a aplicação.
- [x] ID 07 - Utiliza Sass (SCSS) com ou sem framework, aplicando variáveis, mixins e funções para modularizar o código.
- [x] ID 08 - Aplica tipografia responsiva (media queries mobile first) ou tipografia fluida (função clamp() + unidades relativas).
- [x] ID 09 - Aplica técnicas de responsividade de imagens usando CSS (object-fit, containers com unidades relativas).
- [x] ID 10 - Otimiza imagens usando formatos modernos (WebP) e carregamento adaptativo (srcset, picture, ou parâmetros do Cloudinary).

#### RA2 - Realizar tratamento de formulários e aplicar validações customizadas no lado cliente.

- [x] ID 11 - Implementa validação HTML nativa (campos obrigatórios, tipos, limites de caracteres) com mensagens de erro/sucesso no lado cliente.
- [x] ID 12 - Aplica REGEX para validar e-mail, código de lote e CNPJ do fornecedor.
- [x] ID 13 - Utiliza elementos de seleção em formulários (checkbox, radio, select) para coleta de dados.
- [x] ID 14 - Implementa leitura e escrita no Web Storage (localStorage/sessionStorage) para persistir dados localmente.

#### RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento web.

- [x] ID 15 - Configura ambiente com Node.js e NPM para gerenciamento de pacotes e dependências.
- [x] ID 16 - Utiliza boas práticas de versionamento no Git/GitHub (branch main ou branches específicos, uso de .gitignore).
- [x] ID 17 - Mantém um README.md padronizado, conforme template da disciplina, com checklist preenchido.
- [x] ID 18 - Organiza arquivos do projeto de forma modular, seguindo padrão de exemplo fornecido.
- [x] ID 19 - Configura linters e formatadores (ESLint, Prettier) para manter qualidade e padronização do código.

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.

- [x] ID 20 - Utiliza jQuery no filtro dinâmico e animado dos produtos do painel.
- [x] ID 21 - Integra o jQuery Mask Plugin para aplicar máscara ao CNPJ do fornecedor.

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.

- [x] ID 22 - Realiza requisições assíncronas para uma API fake (ex.: JSON Server) para persistir dados de um formulário.
- [x] ID 23 - Realiza requisições assíncronas para uma API fake para exibir dados na página.
- [x] ID 24 - Consulta produtos em uma API pública da RapidAPI, exibe resultados e trata carregamento e erros.

## Integração com RapidAPI

A tela **Novo Produto** consulta a API pública **Real-Time Amazon Data** por meio de um
proxy executado pelo Vite. A chave fica somente no servidor de desenvolvimento e não é
incluída no JavaScript enviado ao navegador.

1. Crie uma conta na [RapidAPI](https://rapidapi.com/).
2. Procure por `Real-Time Amazon Data` e assine um plano disponível.
3. Na pasta `pc-stockV2.1`, copie `.env.example` para `.env`.
4. Substitua `sua_chave_aqui` pela sua `X-RapidAPI-Key`.
5. Reinicie `npm run dev`.

```bash
cp .env.example .env
```

O JSON Server deve continuar em execução, pois ele atende à persistência e aos IDs 22 e 23. O proxy da RapidAPI funciona durante `npm run dev`. Para publicar esse recurso no
GitHub Pages será necessário hospedar o proxy em um backend ou função serverless, pois o
GitHub Pages publica apenas arquivos estáticos.

## 🚀 Manual de execução

- Clonar o repositório com `git clone`
- Fazer checkout no branch `develop` que contém as modificações mais recentes
- Abrir o projeto no editor Visual Studio Code (VS Code)
- Abrir um terminal pelo VSCode ou qualquer terminal do seu Sistema Operacional apontando para o diretório raiz do projeto
- Instalar as dependências contidas no `package.json`
  - Comando: `npm i`
- (Opcional) Instalar o JSON Server globalmente disponível em `https://www.npmjs.com/package/json-server`
  - Comando: `npm i -g json-server`
  - É opcional porque a dependência já vem cadastrada no arquivo `package.json` para instalação local na pasta `node_modules`
- Executar a API Fake (JSON Server) via um dos seguintes comandos:
  - Execução via script registrado no `package.json`: `npm run json:server:routes`
  - Ou via Execução explícita: `json-server --watch db.json --routes routes.json`
- O comando para execução do JSON Server deve ser aplicado no diretório raiz do projeto, ou seja, que contém o arquivo `db.json` e `routes.json`.
  - Por padrão, a aplicação JSON Server executa no endereço `localhost:3000`
- Executar o projeto frontend.

## 📱 Telas da aplicação
