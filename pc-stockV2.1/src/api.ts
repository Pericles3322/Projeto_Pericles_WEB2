export interface Usuario {
  id: number;
  email: string;
  senha: string;
}

export interface Produto {
  id: number;
  usuarioId: number;
  nome: string;
  modelo: string;
  tipo: string;
  especificacoes_tecnicas: string;
  informacoes_adicionais: string;
  valor_venda: number;
  quantidade_estoque: number;
  data_cadastro: string;
  ativo: boolean;
}

export interface Entrada {
  id: number;
  produtoId: number;
  quantidade: number;
  valor_unitario: number;
  lote: string;
  remetente: string;
  distribuidor: string;
  data: string;
}

export interface Saida {
  id: number;
  produtoId: number;
  quantidade: number;
  valor_unitario: number | null;
  motivo: string;
  destinatario: string | null;
  data: string;
}

interface AppDatabase {
  usuarios: Usuario[];
  produtos: Produto[];
  entradas: Entrada[];
  saidas: Saida[];
}

const API_BASE_URL = 'http://localhost:3000';
const LOCAL_DB_KEY = 'pcstock_local_db';

const DEFAULT_DB: AppDatabase = {
  usuarios: [
    {
      id: 1,
      email: 'cliente@email.com',
      senha: '123456'
    }
  ],
  produtos: [
    {
      id: 1,
      usuarioId: 1,
      nome: 'Placa de Vídeo',
      modelo: 'RX 5600 XT',
      tipo: 'Hardware',
      especificacoes_tecnicas: '6GB GDDR6, 192-bit',
      informacoes_adicionais: 'Marca Sapphire',
      valor_venda: 1800,
      quantidade_estoque: 7,
      data_cadastro: '2026-03-24',
      ativo: true
    },
    {
      id: 2,
      usuarioId: 1,
      nome: 'Processador',
      modelo: 'Ryzen 5 5600',
      tipo: 'Hardware',
      especificacoes_tecnicas: '6 núcleos, 12 threads, 4.4GHz',
      informacoes_adicionais: 'Socket AM4',
      valor_venda: 950,
      quantidade_estoque: 0,
      data_cadastro: '2026-04-01',
      ativo: true
    }
  ],
  entradas: [
    {
      id: 1,
      produtoId: 1,
      quantidade: 10,
      valor_unitario: 1200,
      lote: 'Lote-2026-03-A',
      remetente: 'Fornecedor XYZ',
      distribuidor: 'Distribuidora ABC',
      data: '2026-03-24'
    }
  ],
  saidas: [
    {
      id: 1,
      produtoId: 1,
      quantidade: 2,
      valor_unitario: 1800,
      motivo: 'VENDA',
      destinatario: 'Mercado Livre',
      data: '2026-03-25'
    },
    {
      id: 2,
      produtoId: 1,
      quantidade: 1,
      valor_unitario: null,
      motivo: 'DEFEITO',
      destinatario: null,
      data: '2026-03-25'
    }
  ]
};

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeUsuario(item: Partial<Usuario> & Record<string, unknown>): Usuario {
  return {
    id: toNumber(item.id),
    email: String(item.email ?? ''),
    senha: String(item.senha ?? '')
  };
}

function normalizeProduto(item: Partial<Produto> & Record<string, unknown>): Produto {
  return {
    id: toNumber(item.id),
    usuarioId: toNumber(item.usuarioId),
    nome: String(item.nome ?? ''),
    modelo: String(item.modelo ?? ''),
    tipo: String(item.tipo ?? ''),
    especificacoes_tecnicas: String(item.especificacoes_tecnicas ?? ''),
    informacoes_adicionais: String(item.informacoes_adicionais ?? ''),
    valor_venda: toNumber(item.valor_venda),
    quantidade_estoque: toNumber(item.quantidade_estoque),
    data_cadastro: String(item.data_cadastro ?? ''),
    ativo: item.ativo !== false
  };
}

function normalizeEntrada(item: Partial<Entrada> & Record<string, unknown>): Entrada {
  return {
    id: toNumber(item.id),
    produtoId: toNumber(item.produtoId),
    quantidade: toNumber(item.quantidade),
    valor_unitario: toNumber(item.valor_unitario),
    lote: String(item.lote ?? ''),
    remetente: String(item.remetente ?? ''),
    distribuidor: String(item.distribuidor ?? ''),
    data: String(item.data ?? '')
  };
}

function normalizeSaida(item: Partial<Saida> & Record<string, unknown>): Saida {
  return {
    id: toNumber(item.id),
    produtoId: toNumber(item.produtoId),
    quantidade: toNumber(item.quantidade),
    valor_unitario: item.valor_unitario == null ? null : toNumber(item.valor_unitario),
    motivo: String(item.motivo ?? ''),
    destinatario: item.destinatario == null ? null : String(item.destinatario),
    data: String(item.data ?? '')
  };
}

function normalizeDB(raw: Partial<AppDatabase> | null | undefined): AppDatabase {
  return {
    usuarios: Array.isArray(raw?.usuarios) ? raw!.usuarios.map((item) => normalizeUsuario(item as Record<string, unknown>)) : cloneDefaultDB().usuarios,
    produtos: Array.isArray(raw?.produtos) ? raw!.produtos.map((item) => normalizeProduto(item as Record<string, unknown>)) : cloneDefaultDB().produtos,
    entradas: Array.isArray(raw?.entradas) ? raw!.entradas.map((item) => normalizeEntrada(item as Record<string, unknown>)) : cloneDefaultDB().entradas,
    saidas: Array.isArray(raw?.saidas) ? raw!.saidas.map((item) => normalizeSaida(item as Record<string, unknown>)) : cloneDefaultDB().saidas
  };
}

function cloneDefaultDB(): AppDatabase {
  return JSON.parse(JSON.stringify(DEFAULT_DB)) as AppDatabase;
}

function loadLocalDB(): AppDatabase {
  const raw = localStorage.getItem(LOCAL_DB_KEY);
  if (!raw) {
    const initial = cloneDefaultDB();
    saveLocalDB(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as AppDatabase;
    const normalized = normalizeDB(parsed);
    saveLocalDB(normalized);
    return normalized;
  } catch {
    const initial = cloneDefaultDB();
    saveLocalDB(initial);
    return initial;
  }
}

function saveLocalDB(db: AppDatabase): void {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(normalizeDB(db)));
}

function syncCollection<K extends keyof AppDatabase>(key: K, items: AppDatabase[K]): void {
  const db = loadLocalDB();
  db[key] = items;
  saveLocalDB(db);
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length ? Math.max(...items.map((item) => toNumber(item.id))) + 1 : 1;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const usuarios = (await apiRequest<Record<string, unknown>[]>('/usuarios')).map(normalizeUsuario);
    syncCollection('usuarios', usuarios);
    return usuarios;
  } catch {
    return loadLocalDB().usuarios;
  }
}

export async function getProdutos(usuarioId?: number): Promise<Produto[]> {
  try {
    const query = typeof usuarioId === 'number' ? `?usuarioId=${usuarioId}` : '';
    const produtos = (await apiRequest<Record<string, unknown>[]>(`/produtos${query}`)).map(normalizeProduto);

    if (typeof usuarioId === 'number') {
      const db = loadLocalDB();
      const otherUsers = db.produtos.filter((item) => item.usuarioId !== usuarioId);
      db.produtos = [...otherUsers, ...produtos];
      saveLocalDB(db);
    } else {
      syncCollection('produtos', produtos);
    }

    return produtos;
  } catch {
    const produtos = loadLocalDB().produtos;
    return typeof usuarioId === 'number'
      ? produtos.filter((item) => item.usuarioId === usuarioId)
      : produtos;
  }
}

export async function getProdutoById(id: number): Promise<Produto | null> {
  try {
    const produto = normalizeProduto(await apiRequest<Record<string, unknown>>(`/produtos/${id}`));
    const db = loadLocalDB();
    const index = db.produtos.findIndex((item) => item.id === id);
    if (index >= 0) db.produtos[index] = produto;
    else db.produtos.push(produto);
    saveLocalDB(db);
    return produto;
  } catch {
    return loadLocalDB().produtos.find((item) => item.id === id) ?? null;
  }
}

export async function createProduto(payload: Omit<Produto, 'id'>): Promise<Produto> {
  const db = loadLocalDB();
  const produtoCompleto: Produto = normalizeProduto({ id: nextId(db.produtos), ...payload });

  try {
    const produto = normalizeProduto(
      await apiRequest<Record<string, unknown>>('/produtos', {
        method: 'POST',
        body: JSON.stringify(produtoCompleto)
      })
    );
    const newDb = loadLocalDB();
    newDb.produtos.push(produto);
    saveLocalDB(newDb);
    return produto;
  } catch {
    db.produtos.push(produtoCompleto);
    saveLocalDB(db);
    return produtoCompleto;
  }
}

export async function patchProduto(id: number, payload: Partial<Produto>): Promise<Produto> {
  try {
    const produto = normalizeProduto(
      await apiRequest<Record<string, unknown>>(`/produtos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
    );
    const db = loadLocalDB();
    const index = db.produtos.findIndex((item) => item.id === id);
    if (index >= 0) db.produtos[index] = produto;
    else db.produtos.push(produto);
    saveLocalDB(db);
    return produto;
  } catch {
    const db = loadLocalDB();
    const index = db.produtos.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Produto não encontrado.');
    db.produtos[index] = normalizeProduto({ ...db.produtos[index], ...payload });
    saveLocalDB(db);
    return db.produtos[index];
  }
}

export async function getEntradas(): Promise<Entrada[]> {
  try {
    const entradas = (await apiRequest<Record<string, unknown>[]>('/entradas')).map(normalizeEntrada);
    syncCollection('entradas', entradas);
    return entradas;
  } catch {
    return loadLocalDB().entradas;
  }
}

export async function createEntrada(payload: Omit<Entrada, 'id'>): Promise<Entrada> {
  const db = loadLocalDB();
  const entradaCompleta: Entrada = normalizeEntrada({ id: nextId(db.entradas), ...payload });

  try {
    const entrada = normalizeEntrada(
      await apiRequest<Record<string, unknown>>('/entradas', {
        method: 'POST',
        body: JSON.stringify(entradaCompleta)
      })
    );
    const newDb = loadLocalDB();
    newDb.entradas.push(entrada);
    saveLocalDB(newDb);
    return entrada;
  } catch {
    db.entradas.push(entradaCompleta);
    saveLocalDB(db);
    return entradaCompleta;
  }
}

export async function getSaidas(): Promise<Saida[]> {
  try {
    const saidas = (await apiRequest<Record<string, unknown>[]>('/saidas')).map(normalizeSaida);
    syncCollection('saidas', saidas);
    return saidas;
  } catch {
    return loadLocalDB().saidas;
  }
}

export async function createSaida(payload: Omit<Saida, 'id'>): Promise<Saida> {
  const db = loadLocalDB();
  const saidaCompleta: Saida = normalizeSaida({ id: nextId(db.saidas), ...payload });

  try {
    const saida = normalizeSaida(
      await apiRequest<Record<string, unknown>>('/saidas', {
        method: 'POST',
        body: JSON.stringify(saidaCompleta)
      })
    );
    const newDb = loadLocalDB();
    newDb.saidas.push(saida);
    saveLocalDB(newDb);
    return saida;
  } catch {
    db.saidas.push(saidaCompleta);
    saveLocalDB(db);
    return saidaCompleta;
  }
}
