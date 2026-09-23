/**
 * ==========================================================================
 * GERADOR DE ORÇAMENTOS - PREZZOTO MARTELINHO DE OURO & FUNILARIA
 * Arquivo: script.js
 * ==========================================================================
 */

// Estado inicial dos Itens do Orçamento (Inicia vazio conforme solicitado)
let itensOrcamento = [];

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Configurar data de hoje no input de data se estiver vazio
  const inpData = document.getElementById('inpData');
  if (inpData && !inpData.value) {
    const hoje = new Date().toISOString().split('T')[0];
    inpData.value = hoje;
  }

  // Tentar restaurar estado salvo previamente no LocalStorage
  restaurarDadosSalvos();

  // Renderizar o formulário inicial
  renderizarItensForm();
  atualizarPreview();
});

/**
 * Conclui o preenchimento e revela a visualização do documento A4 (PDF)
 */
function concluirEVisualizarPDF() {
  const cliNome = document.getElementById('inpClienteNome')?.value?.trim();
  const veicModelo = document.getElementById('inpVeiculoModelo')?.value?.trim();

  // Validação amigável
  if (!cliNome || !veicModelo) {
    alert('Por favor, informe ao menos o Nome do Cliente e o Modelo do Veículo para gerar o orçamento.');
    if (!cliNome) document.getElementById('inpClienteNome')?.focus();
    else document.getElementById('inpVeiculoModelo')?.focus();
    return;
  }

  // Atualiza todos os dados no documento antes de exibir
  atualizarPreview();

  // Alterna as seções: Oculta Formulário e Exibe o PDF
  const formSec = document.getElementById('formSection');
  const prevSec = document.getElementById('previewSection');

  if (formSec) formSec.classList.add('hidden');
  if (prevSec) {
    prevSec.classList.remove('hidden');
    prevSec.classList.add('fade-in');
  }

  // Ajusta botões do cabeçalho
  const navBtnConcluir = document.getElementById('navBtnConcluir');
  const navBtnVoltar = document.getElementById('navBtnVoltar');
  const navBtnImprimir = document.getElementById('navBtnImprimir');
  const navBtnPartilhar = document.getElementById('navBtnPartilhar');
  const navBtnPartilharPdf = document.getElementById('navBtnPartilharPdf');

  if (navBtnConcluir) navBtnConcluir.classList.add('hidden');
  if (navBtnVoltar) navBtnVoltar.classList.remove('hidden');
  if (navBtnImprimir) navBtnImprimir.classList.remove('hidden');
  if (navBtnPartilhar) navBtnPartilhar.classList.remove('hidden');
  if (navBtnPartilharPdf) navBtnPartilharPdf.classList.remove('hidden');

  // Rola suavemente ao topo para ver o cabeçalho completo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Retorna ao formulário de edição mantendo todos os dados intactos
 */
function voltarParaEdicao() {
  const formSec = document.getElementById('formSection');
  const prevSec = document.getElementById('previewSection');

  if (prevSec) prevSec.classList.add('hidden');
  if (formSec) {
    formSec.classList.remove('hidden');
    formSec.classList.add('fade-in');
  }

  // Ajusta botões do cabeçalho
  const navBtnConcluir = document.getElementById('navBtnConcluir');
  const navBtnVoltar = document.getElementById('navBtnVoltar');
  const navBtnImprimir = document.getElementById('navBtnImprimir');
  const navBtnPartilhar = document.getElementById('navBtnPartilhar');
  const navBtnPartilharPdf = document.getElementById('navBtnPartilharPdf');

  if (navBtnConcluir) navBtnConcluir.classList.remove('hidden');
  if (navBtnVoltar) navBtnVoltar.classList.add('hidden');
  if (navBtnImprimir) navBtnImprimir.classList.add('hidden');
  if (navBtnPartilhar) navBtnPartilhar.classList.add('hidden');
  if (navBtnPartilharPdf) navBtnPartilharPdf.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Formatação de valores para moeda brasileira (BRL)
 */
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Converte data ISO (AAAA-MM-DD) para formato brasileiro (DD/MM/AAAA)
 */
function formatarDataBR(dataIso) {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataIso;
}

/**
 * Renderiza dinamicamente as linhas de itens no formulário de edição
 */
function renderizarItensForm() {
  const container = document.getElementById('listaItensForm');
  if (!container) return;
  container.innerHTML = '';

  if (itensOrcamento.length === 0) {
    container.innerHTML = `
      <div class="py-6 px-4 text-center border border-dashed border-[#282e42] rounded-xl text-xs text-gray-400">
        <p class="font-medium text-gray-300">Nenhum serviço adicionado.</p>
        <p class="text-[11px] text-gray-500 mt-1">Utilize os atalhos rápidos acima ou clique no botão abaixo para incluir um serviço.</p>
      </div>
    `;
    return;
  }

  itensOrcamento.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'bg-[#0e111a] border border-[#23293c] rounded-lg p-3 space-y-2.5';
    row.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-semibold text-amber-400">#${index + 1}</span>
        <button type="button" onclick="removerItem(${item.id})" class="text-xs text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded hover:bg-rose-500/10 transition" title="Remover item">
          Remover
        </button>
      </div>
      <div>
        <input type="text" value="${escapeHtml(item.descricao)}" oninput="atualizarItemTexto(${item.id}, 'descricao', this.value)" placeholder="Descrição do serviço ou peça" class="w-full bg-[#151926] border border-[#2b324a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition" />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 items-center">
        <div>
          <label class="block text-[10px] text-gray-400 mb-0.5">Qtd</label>
          <input type="number" min="1" step="1" value="${item.quantidade}" oninput="atualizarItemNumero(${item.id}, 'quantidade', this.value)" class="w-full bg-[#151926] border border-[#2b324a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition" />
        </div>
        <div>
          <label class="block text-[10px] text-gray-400 mb-0.5">Valor Unitário (R$)</label>
          <input type="number" min="0" step="10" value="${item.valorUnitario}" oninput="atualizarItemNumero(${item.id}, 'valorUnitario', this.value)" class="w-full bg-[#151926] border border-[#2b324a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition" />
        </div>
        <div class="col-span-2 sm:col-span-1 text-right">
          <span class="block text-[10px] text-gray-400 mb-0.5">Subtotal</span>
          <span class="text-xs font-semibold text-amber-400">${formatarMoeda(item.quantidade * item.valorUnitario)}</span>
        </div>
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * Atualiza campos de texto dos itens
 */
function atualizarItemTexto(id, campo, valor) {
  const item = itensOrcamento.find(i => i.id === id);
  if (item) {
    item[campo] = valor;
    atualizarPreview();
    salvarNoLocalStorage();
  }
}

/**
 * Atualiza campos numéricos dos itens
 */
function atualizarItemNumero(id, campo, valor) {
  const item = itensOrcamento.find(i => i.id === id);
  if (item) {
    item[campo] = parseFloat(valor) || 0;
    renderizarItensForm();
    atualizarPreview();
    salvarNoLocalStorage();
  }
}

/**
 * Adiciona uma nova linha de item vazia
 */
function adicionarNovoItem() {
  const novoId = Date.now();
  itensOrcamento.push({
    id: novoId,
    descricao: '',
    quantidade: 1,
    valorUnitario: 0
  });
  renderizarItensForm();
  atualizarPreview();
  salvarNoLocalStorage();
}

/**
 * Atalho para inserção de serviços frequentes com 1 clique
 */
function adicionarItemRapido(descricao, quantidade, valorUnitario) {
  const novoId = Date.now();
  itensOrcamento.push({
    id: novoId,
    descricao,
    quantidade,
    valorUnitario
  });
  renderizarItensForm();
  atualizarPreview();
  salvarNoLocalStorage();
}

/**
 * Remove um item do orçamento (permite remover até ficar nenhum)
 */
function removerItem(id) {
  itensOrcamento = itensOrcamento.filter(i => i.id !== id);
  renderizarItensForm();
  atualizarPreview();
  salvarNoLocalStorage();
}

/**
 * Atualiza em tempo real todo o espelho da folha A4 e recalcula valores
 */
function atualizarPreview() {
  // Metadados
  const numDoc = document.getElementById('inpNumero')?.value || '#0001';
  const dataIso = document.getElementById('inpData')?.value;
  const diasValidade = document.getElementById('inpValidade')?.value;
  const validadeTexto = diasValidade ? `${diasValidade} dias` : '15 dias';

  const prevNum = document.getElementById('prevNumeroDoc');
  const prevData = document.getElementById('prevDataDoc');
  const prevVal = document.getElementById('prevValidadeDoc');

  if (prevNum) prevNum.innerText = numDoc;
  if (prevData) prevData.innerText = formatarDataBR(dataIso);
  if (prevVal) prevVal.innerText = validadeTexto;

  // Cliente
  const cliNome = document.getElementById('inpClienteNome')?.value || 'Não informado';
  const cliTel = document.getElementById('inpClienteTelefone')?.value || 'Não informado';
  const cliDoc = document.getElementById('inpClienteDoc')?.value || 'Não informado';
  const cliEnd = document.getElementById('inpClienteEndereco')?.value || 'Goioerê - PR';

  setText('prevClienteNome', cliNome);
  setText('prevClienteTelefone', cliTel);
  setText('prevClienteDoc', cliDoc);
  setText('prevClienteEndereco', cliEnd);
  setText('prevAssinaturaCliente', cliNome);

  // Veículo
  const veicModelo = document.getElementById('inpVeiculoModelo')?.value || 'Não informado';
  const veicPlaca = document.getElementById('inpVeiculoPlaca')?.value || '---';
  const veicAno = document.getElementById('inpVeiculoAno')?.value || '---';
  const veicCor = document.getElementById('inpVeiculoCor')?.value || '---';
  const veicKm = document.getElementById('inpVeiculoKm')?.value || '---';

  setText('prevVeiculoModelo', veicModelo);
  setText('prevVeiculoPlacaBadge', veicPlaca.toUpperCase());
  setText('prevVeiculoAno', veicAno);
  setText('prevVeiculoCor', veicCor);
  setText('prevVeiculoKm', veicKm);

  // Renderizar itens na tabela A4
  const tabela = document.getElementById('prevTabelaItens');
  if (tabela) {
    tabela.innerHTML = '';
    let subtotal = 0;

    if (itensOrcamento.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" class="py-5 px-3 text-center text-gray-400 italic text-xs">
          Nenhum serviço ou peça adicionado ao orçamento.
        </td>
      `;
      tabela.appendChild(tr);
    } else {
      itensOrcamento.forEach((item, index) => {
        const itemSub = item.quantidade * item.valorUnitario;
        subtotal += itemSub;

        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60';
        tr.innerHTML = `
          <td class="py-2 px-3 text-center text-gray-500 font-mono text-[11px]">${String(index + 1).padStart(2, '0')}</td>
          <td class="py-2 px-3 font-medium text-gray-900">${escapeHtml(item.descricao || 'Item de serviço')}</td>
          <td class="py-2 px-3 text-center text-gray-700">${item.quantidade}</td>
          <td class="py-2 px-3 text-right text-gray-700">${formatarMoeda(item.valorUnitario)}</td>
          <td class="py-2 px-3 text-right font-semibold text-gray-900">${formatarMoeda(itemSub)}</td>
        `;
        tabela.appendChild(tr);
      });
    }

    // Cálculos Financeiros
    const desconto = parseFloat(document.getElementById('inpDesconto')?.value) || 0;
    const totalGeral = Math.max(0, subtotal - desconto);

    setText('prevSubtotal', formatarMoeda(subtotal));
    setText('prevDesconto', '- ' + formatarMoeda(desconto));
    setText('prevTotalGeral', formatarMoeda(totalGeral));

    const linhaDesconto = document.getElementById('prevLinhaDesconto');
    if (linhaDesconto) {
      linhaDesconto.style.display = desconto > 0 ? 'flex' : 'none';
    }
  }

  // Condições & Observações
  setText('prevCondPagamento', document.getElementById('inpPagamento')?.value || 'A combinar');
  setText('prevPrazoEntrega', document.getElementById('inpPrazo')?.value || 'A combinar');
  setText('prevObservacoes', document.getElementById('inpObservacoes')?.value || 'Nenhuma observação informada.');

  salvarNoLocalStorage();
}

/**
 * Função utilitária para definir texto com segurança
 */
function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.innerText = valor;
}

/**
 * Dispara a impressão ou salvamento em PDF no navegador
 */
function imprimirOrcamento() {
  window.print();
}

/**
 * Gera e compartilha o arquivo PDF oficial do orçamento.
 * Em dispositivos móveis/compatíveis, abre o compartilhamento nativo direto no WhatsApp/Apps.
 * No desktop, realiza o download automático do arquivo e oferece atalho para o WhatsApp.
 */
async function compartilharPdf(btnElement) {
  const element = document.getElementById('printArea');
  if (!element) {
    alert('Erro: Área de impressão não encontrada.');
    return;
  }

  // Verifica se o html2pdf está carregado
  if (typeof html2pdf === 'undefined') {
    alert('O gerador de PDF ainda está sendo carregado. Por favor, aguarde alguns instantes ou verifique sua conexão.');
    return;
  }

  // Nome padronizado e limpo para o arquivo
  const numDoc = (document.getElementById('inpNumero')?.value || '#0001').replace(/[^a-zA-Z0-9_-]/g, '');
  const cliNome = (document.getElementById('inpClienteNome')?.value || 'Cliente')
    .trim()
    .replace(/[^a-zA-Z0-9À-ÿ\s_-]/g, '')
    .replace(/\s+/g, '_');
  const nomeArquivo = `Orcamento_PREZZOTO_${numDoc}_${cliNome}.pdf`;

  // Feedback visual no botão clicado
  let originalHtml = '';
  if (btnElement) {
    originalHtml = btnElement.innerHTML;
    btnElement.disabled = true;
    btnElement.innerHTML = `
      <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Gerando PDF...</span>
    `;
  }

  try {
    const opt = {
      margin:       [4, 4, 4, 4],
      filename:     nomeArquivo,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        scrollY: 0
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gera o PDF como Blob
    const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
    const pdfFile = new File([pdfBlob], nomeArquivo, { type: 'application/pdf' });

    // Testa se o navegador suporta Web Share com arquivos (WhatsApp nativo)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        files: [pdfFile],
        title: `Orçamento ${numDoc} - Prezzoto Martelinho de Ouro`,
        text: `Olá! Segue em anexo a proposta em PDF da Prezzoto Martelinho de Ouro.`
      });
    } else {
      // Fallback para desktop: faz o download automático e orienta o envio
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

      // Exibe modal informativo
      const lblArquivo = document.getElementById('lblNomeArquivoPdf');
      if (lblArquivo) lblArquivo.innerText = nomeArquivo;

      const modalDownload = document.getElementById('modalPdfDownload');
      if (modalDownload) {
        modalDownload.classList.remove('hidden');
        modalDownload.classList.add('flex');
      }
    }
  } catch (erro) {
    if (erro.name !== 'AbortError') {
      console.error('Erro ao gerar/compartilhar PDF:', erro);
      alert('Não foi possível gerar ou compartilhar o PDF: ' + erro.message);
    }
  } finally {
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = originalHtml;
    }
  }
}

/**
 * Fecha o modal de confirmação de PDF baixado
 */
function fecharModalPdfDownload() {
  const modal = document.getElementById('modalPdfDownload');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Abre o WhatsApp informando que o PDF foi gerado
 */
function abrirWhatsAppComAviso() {
  fecharModalPdfDownload();
  abrirNoWhatsapp();
}

/**
 * Abre modal com mensagem pronta e formatada para envio no WhatsApp
 */
function partilharOrcamento() {
  const numDoc = document.getElementById('inpNumero')?.value || '#0001';
  const cliNome = document.getElementById('inpClienteNome')?.value || 'Cliente';
  const veicModelo = document.getElementById('inpVeiculoModelo')?.value || 'Veículo';
  const veicPlaca = document.getElementById('inpVeiculoPlaca')?.value || '';
  const prazo = document.getElementById('inpPrazo')?.value || 'A combinar';
  const pagamento = document.getElementById('inpPagamento')?.value || 'A combinar';
  const total = document.getElementById('prevTotalGeral')?.innerText || 'R$ 0,00';

  // Montagem do texto formatado com emojis e destaques
  let texto = `*PREZZOTO MARTELINHO DE OURO & FUNILARIA*\n`;
  texto += `_Celso Prezzoto Filho • Goioerê/PR_\n\n`;
  texto += `Olá, *${cliNome}*! Segue a proposta detalhada do seu veículo:\n\n`;
  texto += `📄 *Orçamento:* ${numDoc}\n`;
  texto += `🚗 *Veículo:* ${veicModelo} (Placa: ${veicPlaca.toUpperCase()})\n\n`;
  texto += `🛠️ *SERVIÇOS INCLUSOS:*\n`;

  if (itensOrcamento.length === 0) {
    texto += `• (Nenhum serviço discriminado)\n`;
  } else {
    itensOrcamento.forEach((item) => {
      texto += `• ${item.quantidade}x ${item.descricao} — ${formatarMoeda(item.quantidade * item.valorUnitario)}\n`;
    });
  }

  texto += `\n💰 *VALOR TOTAL:* ${total}\n`;
  texto += `💳 *Condição:* ${pagamento}\n`;
  texto += `⏳ *Prazo de Execução:* ${prazo}\n`;
  texto += `📍 *Endereço:* Av. Santos Dumont, 100 - Goioerê/PR\n\n`;
  texto += `Qualquer dúvida estamos à inteira disposição para agendarmos o seu atendimento!`;

  const txtWhatsapp = document.getElementById('txtMensagemWhatsapp');
  if (txtWhatsapp) txtWhatsapp.value = texto;

  const modal = document.getElementById('modalPartilha');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

/**
 * Fecha o modal de partilha
 */
function fecharModalPartilha() {
  const modal = document.getElementById('modalPartilha');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Copia o texto formatado para a área de transferência
 */
function copiarMensagemWhatsapp() {
  const textarea = document.getElementById('txtMensagemWhatsapp');
  if (!textarea) return;

  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    const lbl = document.getElementById('labelCopiarTexto');
    if (lbl) {
      lbl.innerText = 'Copiado com Sucesso!';
      setTimeout(() => {
        lbl.innerText = 'Copiar Texto';
      }, 2000);
    }
  });
}

/**
 * Abre diretamente o link do WhatsApp para o número informado
 */
function abrirNoWhatsapp() {
  const telefone = (document.getElementById('inpClienteTelefone')?.value || '').replace(/\D/g, '');
  const mensagem = encodeURIComponent(document.getElementById('txtMensagemWhatsapp')?.value || '');
  
  let url = `https://api.whatsapp.com/send?text=${mensagem}`;
  if (telefone.length >= 10) {
    const ddi = telefone.startsWith('55') ? '' : '55';
    url = `https://api.whatsapp.com/send?phone=${ddi}${telefone}&text=${mensagem}`;
  }
  
  window.open(url, '_blank');
}

/**
 * Persistência automática no LocalStorage
 */
function salvarNoLocalStorage() {
  try {
    const dados = {
      numero: document.getElementById('inpNumero')?.value,
      data: document.getElementById('inpData')?.value,
      validade: document.getElementById('inpValidade')?.value,
      clienteNome: document.getElementById('inpClienteNome')?.value,
      clienteTelefone: document.getElementById('inpClienteTelefone')?.value,
      clienteDoc: document.getElementById('inpClienteDoc')?.value,
      clienteEndereco: document.getElementById('inpClienteEndereco')?.value,
      veiculoModelo: document.getElementById('inpVeiculoModelo')?.value,
      veiculoPlaca: document.getElementById('inpVeiculoPlaca')?.value,
      veiculoAno: document.getElementById('inpVeiculoAno')?.value,
      veiculoCor: document.getElementById('inpVeiculoCor')?.value,
      veiculoKm: document.getElementById('inpVeiculoKm')?.value,
      pagamento: document.getElementById('inpPagamento')?.value,
      prazo: document.getElementById('inpPrazo')?.value,
      desconto: document.getElementById('inpDesconto')?.value,
      observacoes: document.getElementById('inpObservacoes')?.value,
      itens: itensOrcamento
    };
    localStorage.setItem('prezzoto_orcamento_draft', JSON.stringify(dados));
  } catch (e) {
    console.warn('Não foi possível salvar no LocalStorage:', e);
  }
}

/**
 * Restaura o último rascunho salvo no navegador
 */
function restaurarDadosSalvos() {
  try {
    const salvo = localStorage.getItem('prezzoto_orcamento_draft');
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (dados.numero) document.getElementById('inpNumero').value = dados.numero;
      if (dados.data) document.getElementById('inpData').value = dados.data;
      if (dados.validade !== undefined) document.getElementById('inpValidade').value = dados.validade;
      if (dados.clienteNome) document.getElementById('inpClienteNome').value = dados.clienteNome;
      if (dados.clienteTelefone) document.getElementById('inpClienteTelefone').value = dados.clienteTelefone;
      if (dados.clienteDoc) document.getElementById('inpClienteDoc').value = dados.clienteDoc;
      if (dados.clienteEndereco) document.getElementById('inpClienteEndereco').value = dados.clienteEndereco;
      if (dados.veiculoModelo) document.getElementById('inpVeiculoModelo').value = dados.veiculoModelo;
      if (dados.veiculoPlaca) document.getElementById('inpVeiculoPlaca').value = dados.veiculoPlaca;
      if (dados.veiculoAno) document.getElementById('inpVeiculoAno').value = dados.veiculoAno;
      if (dados.veiculoCor) document.getElementById('inpVeiculoCor').value = dados.veiculoCor;
      if (dados.veiculoKm) document.getElementById('inpVeiculoKm').value = dados.veiculoKm;
      if (dados.pagamento) document.getElementById('inpPagamento').value = dados.pagamento;
      if (dados.prazo) document.getElementById('inpPrazo').value = dados.prazo;
      if (dados.desconto !== undefined) document.getElementById('inpDesconto').value = dados.desconto;
      if (dados.observacoes) document.getElementById('inpObservacoes').value = dados.observacoes;
      if (Array.isArray(dados.itens)) {
        itensOrcamento = dados.itens;
      }
    }
  } catch (e) {
    console.warn('Erro ao restaurar rascunho:', e);
  }
}

/**
 * Reinicia o formulário para um novo orçamento em branco
 */
function novoOrcamento() {
  if (confirm('Deseja iniciar um novo orçamento? Os campos atuais serão restaurados.')) {
    localStorage.removeItem('prezzoto_orcamento_draft');
    location.reload();
  }
}

/**
 * Prevenção de XSS ao renderizar dados do usuário no HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
