# 🛠️ Especificação Técnica (Tech Spec) - PC-Stock

Este documento detalha a arquitetura técnica, o modelo de dados e os contratos de API (via JSON Server) necessários para o funcionamento do sistema de gerenceamento do PC-Stock.

## 1. Modelo de Dados (Diagrama ER)

Abaixo está o Diagrama Entidade-Relacionamento (DER) que representa a estrutura do nosso "banco de dados" (`db.json`) e como as informações se conectam.

```mermaid
erDiagram

USUARIO ||--o{ PRODUTO : possui
PRODUTO ||--o{ ENTRADA : recebe
PRODUTO ||--o{ SAIDA : sofre_baixa

USUARIO {
string id PK
string email
string senha_hash
}

PRODUTO {
string id PK
string usuarioId FK
string nome
string modelo
string tipo
string especificacoes_tecnicas
string informacoes_adicionais
float valor_venda
int quantidade_estoque
datetime data_cadastro
}

ENTRADA {
string id PK
string produtoId FK
int quantidade
float valor_unitario
string lote
string remetente
string distribuidor
datetime data
}

SAIDA {
string id PK
string produtoId FK
int quantidade
float valor_unitario
string motivo
string destinatario
datetime data
}
```

## 2. Dicionário de Dados

Breve explicação das tabelas principais:

- **Usuario:** Responsável por armazenar os dados de autenticação.
  - id: Identificador único gerado pelo JSON Server (String ou Hash).
  - email: Chave de acesso do usuário. Em um cenário real seria único, mas para o MVP não há trava estrita no banco, apenas validação no front-end.
  - senha: Chave de acesso que autentica com o email para confirmar ja esta cadastrado no banco de dados.
- **Produto:** Registra um produto e fica vinculado com um cliente, com suas informaçoes.
  - id: Identificador único gerado pelo JSON Server (String ou Hash).
  - usuarioId: Chave estrangeira que vincula a produto ao  usuario (padrão de nomenclatura exigido pelo JSON Server para rotas aninhadas).
  - nome
  - modelo
  - tipo
  - especificacoes_tecnicas
  - informacoes_adicionais
  - valor_venda
  - quantidade_estoque
  - data_cadastro
}
## 3. Rotas da API (JSON Server)

A aplicação consome a API local simulada pelo JSON Server. Abaixo os principais endpoints:

- `GET /usuarios` - Retorna a lista de usuários.
- `POST /usuarios` - Cadastra um novo usuário.
- `GET /transacoes?id_usuario=1` - Retorna o extrato de um usuário específico.

## 4. Estrutura do Banco de Dados (db.json)

Esta é a representação em formato JSON do banco de dados simulado. Esta estrutura serve de contexto para ferramentas de IA e para o JSON Server inicializar a API Fake.

```JSON
{
    "clientes": [
    {
        "id": "1",
        "nome": "João da Silva",
        "cpf": "12345678900",
        "senha": "senha_super_segura",
        "saldo": 850.50
    }],
    "transacoes": [
    {
        "id": "1",
        "clienteId": "1",
        "tipo": "DEPOSITO",
        "valor": 1000.00,
        "data": "2026-03-16",
        "descricao": "Depósito inicial em espécie"
    },
    {
        "id": "2",
        "clienteId": "1",
        "tipo": "TAXA",
        "valor": 50.00,
        "data": "2026-03-16",
        "descricao": "Taxa de boas-vindas do Roubank"
    },
    {
        "id": "3",
        "clienteId": "1",
        "tipo": "SAQUE",
        "valor": 99.50,
        "data": "2026-03-17",
        "descricao": "Saque no caixa eletrônico"
    }]
}
...
