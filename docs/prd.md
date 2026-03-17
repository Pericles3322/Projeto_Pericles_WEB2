# 📄 Product Requirements Document (PRD) - PC-Stock

## 1. Visão Geral e Objetivo

O **PC-Stock** é uma aplicação web de gerenciamento que simula as operações básicas de recebimento de e quantidade de produtos (quantidade, fornecedor, especificações das peças)
e Saida dos produtos e em qual mercado de varejo foi vendido (amazon, mercado livre, loja fisica), e armazenando seus historicos

**O foco do sistema é** ter uma gerencia de quantidade para que o usuario possa se palnejar para compras futuras e ter uma visão completa de quantos itens ele possui, e ja foi vendido.

## 2. Atores do Sistema

- **Cliente:** Usuário autenticado que possui um estoque com seus itens e suas quantidades respectivas.
- **O Banco (Sistema):** Ator invizivel que recebe e gerencia os produtos e suas quantidades.

## 3. Histórias de Usuário e Escopo

Abaixo estão as funcionalidades principais do MVP (Minimum Viable Product), escritas sob a perspectiva do usuário final.

### 👤 Épico 1: Autenticação e Conta

- **US0 - Acesso ao Sistema (Login):** Como um Cliente, quero inserir meu email e senha para acessar meu estoque.

### 💰 Épico 2: Movimentações Financeiras

- **US03 - Visualização de Saldo:** Como um Cliente logado, quero ver mmeus produtostotal atualizado em destaque no painel principal, para saber quanto dinheiro (ainda) tenho.
- **US04 - Realizar Depósito:** Como um Cliente, quero informar um valor para depositar na minha conta.
  - _Critérios de Aceitação:_ O valor deve ser positivo; o sistema deve cobrar uma **"Taxa de Depósito" (ex: 2% do valor)** e creditar apenas o valor líquido na conta do cliente.
- **US05 - Realizar Saque:** Como um Cliente, quero informar um valor para sacar da minha conta.
  - _Critérios de Aceitação:_ O cliente não pode sacar mais do que o saldo disponível + limite; o sistema deve cobrar uma **"Taxa de Saque" (ex: R$ 5,00 fixos por saque)**, descontando o valor do saque + a taxa do saldo total.

### 📊 Épico 3: Histórico e Transparência

- **US06 - Visualizar Extrato:** Como um Cliente, quero visualizar uma lista (tabela ou cards) com o histórico de todas as minhas transações (depósitos e saques).
  - _Critérios de Aceitação:_ A lista deve mostrar a data, o tipo de transação, o valor bruto e **o valor da taxa cobrada** pelo Roubank, deixando claro o quanto o cliente perdeu na operação.
