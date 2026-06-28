const VIACEP_BASE_URL = 'https://viacep.com.br/ws';
const CEP_REGEX = /^\d{5}-?\d{3}$/;

export function onlyCepDigits(value) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 8);
}

export async function buscarEnderecoPorCep(value) {
  const cepDigitado = String(value ?? '').trim();
  if (!CEP_REGEX.test(cepDigitado)) {
    throw new Error('Informe um CEP válido com 8 números.');
  }

  const cep = onlyCepDigits(cepDigitado);
  const response = await fetch(`${VIACEP_BASE_URL}/${cep}/json/`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Não foi possível consultar o ViaCEP (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado. Confira os números e tente novamente.');
  }

  return {
    cep: String(data.cep ?? ''),
    logradouro: String(data.logradouro ?? ''),
    bairro: String(data.bairro ?? ''),
    cidade: String(data.localidade ?? ''),
    uf: String(data.uf ?? '')
  };
}

export function initViaCepLookup() {
  const cepInput = document.getElementById('cep_fornecedor');
  const searchButton = document.getElementById('buscar-cep');
  const status = document.getElementById('cep-status');
  const fields = {
    logradouro: document.getElementById('logradouro_fornecedor'),
    bairro: document.getElementById('bairro_fornecedor'),
    cidade: document.getElementById('cidade_fornecedor'),
    uf: document.getElementById('uf_fornecedor')
  };

  if (!cepInput || !searchButton || !status || Object.values(fields).some((field) => !field)) {
    return { clear: () => {} };
  }

  let isLoading = false;

  const setStatus = (message, type = '') => {
    status.textContent = message;
    status.classList.remove('text-success', 'text-danger', 'text-secondary');
    status.classList.add(
      type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : 'text-secondary'
    );
  };

  const clearAddress = () => {
    Object.values(fields).forEach((field) => {
      field.value = '';
    });
    setStatus('Digite o CEP e clique em Buscar endereço.');
  };

  const lookup = async () => {
    if (isLoading) return;

    const cep = cepInput.value.trim();
    if (!cep) {
      clearAddress();
      return;
    }

    isLoading = true;
    searchButton.disabled = true;
    searchButton.textContent = 'Buscando...';
    setStatus('Consultando a API pública ViaCEP...');

    try {
      const endereco = await buscarEnderecoPorCep(cep);
      cepInput.value = endereco.cep;
      fields.logradouro.value = endereco.logradouro;
      fields.bairro.value = endereco.bairro;
      fields.cidade.value = endereco.cidade;
      fields.uf.value = endereco.uf;
      setStatus('Endereço encontrado e preenchido automaticamente.', 'success');
      document.getElementById('numero_fornecedor')?.focus();
    } catch (error) {
      clearAddress();
      setStatus(error.message, 'error');
    } finally {
      isLoading = false;
      searchButton.disabled = false;
      searchButton.textContent = 'Buscar endereço';
    }
  };

  searchButton.addEventListener('click', lookup);
  cepInput.addEventListener('blur', () => {
    if (onlyCepDigits(cepInput.value).length === 8 && !fields.cidade.value) {
      lookup();
    }
  });

  return { clear: clearAddress };
}
