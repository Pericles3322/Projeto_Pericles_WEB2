function getJQuery() {
  const jquery = window.jQuery;
  if (!jquery) {
    throw new Error('jQuery não foi carregado. Verifique o link CDN no HTML.');
  }
  return jquery;
}

export function initInputMasks() {
  const $ = getJQuery();
  if (typeof $.fn.mask !== 'function') {
    throw new Error('jQuery Mask Plugin não foi carregado. Verifique o link CDN no HTML.');
  }

  const $cnpj = $('#cnpj_fornecedor');
  if ($cnpj.length) {
    $cnpj.mask('00.000.000/0000-00');
  }

  const $cep = $('#cep_fornecedor');
  if ($cep.length) {
    $cep.mask('00000-000');
  }
}

export function animateSavedProduct() {
  const $ = getJQuery();
  const $panel = $('#produto-resultado');
  if ($panel.length) {
    $panel.stop(true, true).hide().removeClass('d-none').fadeIn(800);
  }
}

export function bindProductTableFilter() {
  const $ = getJQuery();
  const $filter = $('#filtro-produtos');
  if (!$filter.length) return;

  $filter.off('input.pcstock').on('input.pcstock', function () {
    const term = String($(this).val()).trim().toLocaleLowerCase('pt-BR');
    let visibleRows = 0;

    $('[data-product-row]').each(function () {
      const $row = $(this);
      const matches = String($row.data('search') ?? '').includes(term);
      $row.stop(true, true)[matches ? 'fadeIn' : 'fadeOut'](150);
      if (matches) visibleRows += 1;
    });

    $('#filtro-produtos-vazio').toggleClass('d-none', visibleRows > 0);
  });
}
