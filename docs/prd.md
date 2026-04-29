# 📄 Product Requirements Document (PRD) - PC-Stock

## 1. Visão Geral e Objetivo

O **PC-Stock** é uma aplicação web de gerenciamento que simula as operações básicas de recebimento de e quantidade de produtos (quantidade, fornecedor, especificações das peças)
e Saida dos produtos e em qual mercado de varejo foi vendido (amazon, mercado livre, loja fisica), e armazenando seus historicos

**O foco do sistema é** ter uma gerencia de quantidade para que o usuario possa se planejar para compras futuras e ter uma visão completa de quantos itens ele possui, e ja foi vendido.

## 2. Atores do Sistema

- **Cliente:** Usuário autenticado que possui um estoque com seus itens e suas quantidades respectivas.
- **O Banco (Sistema):** Ator invizivel que recebe e gerencia os produtos e suas quantidades e seus historicos.

## 3. Histórias de Usuário e Escopo

Abaixo estão as funcionalidades principais do MVP (Minimum Viable Product), escritas sob a perspectiva do usuário final.

### 👤 Épico 1: Autenticação e Conta

- **US0 - Acesso ao Sistema (Login):** Como um Cliente, quero inserir meu email e senha para acessar meu estoque.
- _Citerios de aceitação:_ sistema tem que validar o email e senha para ver se esta cadastrado no BD.
- _Caso não tenha cadastrado:_ tera a opção de cadastras login ou esqueceu a senha (onde sera validado se o email esta no BD), caso não esteja sera informado para cadastra um novo login.

### 💰 Épico 2: Gerenciamento de Estoque

- **US03 - Visualização de Saldo:** Como um Cliente logado, quero ter acesso a todos os produtos que eu ternho no meu estque e a quantidade respectiva de cada um
- **US04 - Realizar inserção:** como cliente quero pode inserir novos produtos e seus valores de venda respectivos com suas especificações (modelo, tipo, especificaçoes tecnicas, informaçoes adicionais)
- **US05 - Realizar inserçao de pedidos** quantidade de itens em cada pedido, com suas informações de pedido (lote, remetente, qual o distribuidor, valor da nota, quantidade de itens e produtos).
  - _Critérios de Aceitação: o produto deve estar cadastrado antes para que o pedido insira a quantidade de produtos.
- **US05 - Realizar baixa:** Como um Cliente, quero baixar uma quantidade de produtos e sua respectiva venda ou seu motivo de baixa(quantidade baixado, motivo da baixa, valor total dos produtos baixado, e qual destinatario foi baixado).
  - _Critérios de Aceitação:_ O cliente não pode baixar mais do que o saldo disponível, e tem que expecificar o motivo da baixa, se foi vendido, defeito, trocado, ajuste de quantidade.

### 📊 Épico 3: Histórico e Transparência

- **US06 - Visualizar Extrato:** Como um Cliente, quero visualizar uma lista (tabela ou cards) com o histórico de todas as minhas auteraçoes (cadastro de pedido, produto e baixas).
  - _Critérios de Aceitação:_ A lista deve mostrar a data, o tipo de alteração, o valor bruto, deixando claro a quantidde de itens que foi treanferido e quais itens.
