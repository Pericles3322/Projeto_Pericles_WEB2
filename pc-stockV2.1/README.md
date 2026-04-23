# PC-Stock

Projeto reorganizado em formato multi-page com **Vite + TypeScript + Bootstrap 5.3.8**, deixando os arquivos HTML na raiz para facilitar leitura, manutenção local e edição manual.

## Estrutura

```text
pc-stock/
├── index.html
├── painel.html
├── novo_produto.html
├── entrada.html
├── saida.html
├── historico.html
├── style.css
├── db.json
├── routes.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── api.ts
    ├── auth.ts
    ├── produtos.ts
    ├── movimentacoes.ts
    ├── historico.ts
    └── utils.ts
```

## Rodando localmente

```bash
npm install
npm run api
npm run dev
```

- Frontend: `http://localhost:5173`
- API Fake: `http://localhost:3000`

## Usuário de teste

- Email: `cliente@email.com`
- Senha: `123456`
