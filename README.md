# 🚗 Gerador de Orçamentos Profissional — Funilaria & Martelinho de Ouro

> **Automação determinística local-first para oficinas automotivas: alta precisão, fidelidade visual de impressão e o fim do uso ineficiente de Inteligência Artificial em processos operacionais.**

---

[![Licença MIT](https://img.shields.io/badge/license-MIT-amber.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-10b981.svg)](#)
[![Zero-Token Cost](https://img.shields.io/badge/Runtime_Cost-R%24_0%2C00-brightgreen.svg)](#)

---

## 💡 O Problema: O Fim do Uso Ineficiente de IA

Com a popularização de ferramentas de IA generativa (como ChatGPT, Claude e similares), muitos profissionais e oficinas passaram a recorrer a assistentes de chat para criar orçamentos e propostas comerciais no dia a dia. Embora pareça moderno à primeira vista, esse processo revelou-se **ineficiente, arriscado e improdutivo**:

1. ⚠️ **Alucinação Numérica e Risco Financeiro:** Modelos de linguagem (LLMs) são motores probabilísticos de texto, não calculadoras. Frequentemente erram somas simples de mão de obra e peças, descontos percentuais e divisões de parcelas, gerando prejuízos ou constrangimento com clientes.
2. ⏳ **Desperdício de Tempo e Retrabalho Diário:** Digitar prompts longos repetidamente ("*atue como funileiro e gere um orçamento com tais peças...*"), aguardar a geração de tokens e ajustar o texto consome preciosos minutos a cada cliente no balcão.
3. 📄 **Falta de Padronização e Trabalho Manual:** O texto gerado pelo chat ainda precisa ser copiado, colado e formatado no Word, Docs ou Canva para se transformar em um documento ou PDF minimamente apresentável.
4. 🔌 **Dependência de Conexão e Custos Recorrentes:** Se faltar internet no pátio da oficina ou a API do modelo de IA ficar instável, a operação de vendas é interrompida. Além disso, gasta-se créditos/tokens de IA para tarefas que deveriam ser instantâneas e gratuitas.

---

## 🚀 A Solução: A IA como Engenheira, o Código como Motor

A abordagem deste projeto segue um princípio fundamental de engenharia de software contemporânea:

> **Use a Inteligência Artificial onde ela brilha** (na arquitetura, concepção de interface e codificação inicial) e **use código determinístico e local-first onde o seu negócio precisa de solidez** (cálculos exatos, velocidade instantânea, privacidade de dados e custo zero de execução).

Este gerador foi concebido como uma aplicação web moderna, reativa e **100% cliente-side**, sem qualquer necessidade de servidores, bancos de dados em nuvem ou APIs pagas.

---

## ✨ Principais Funcionalidades

### 1. 📋 Fluxo em Duas Etapas (UX Focada)
- **Modo Preenchimento:** Interface escura (*Dark Mode* sofisticado com paleta grafite e âmbar/dourado), pensada para oficinas de alto padrão, livre de poluição visual.
- **Modo Visualização A4 (PDF):** A folha de impressão e exportação só entra em cena após o clique em **"Concluir e Visualizar Orçamento (PDF)"**, permitindo focar 100% na digitação antes de revisar o documento final.

### 2. 🖩 Motor de Cálculo Reativo e Livre de Erros
- Cálculo instantâneo de **Subtotal**, **Descontos** (em Reais `R$` ou Porcentagem `%`), **Total Geral** e divisão de parcelas sem recarregar a página.
- Adição e remoção dinâmica de serviços/peças, permitindo inclusive orçamentos zerados ou personalizados sob demanda.

### 3. 🖨️ Impressão e PDF A4 Pixel-Perfect
- Estilizado rigorosamente para o padrão A4 (210mm x 297mm) através de regras CSS `@page` e `print-color-adjust: exact`.
- Integração de alta fidelidade com os assets da oficina:
  - Banner superior com `cabecalho.png` de alta resolução em proporção exata sem distorção.
  - Logotipo oficial `logo.png` no cabeçalho e rodapé.
- Barra flutuante de ações no modo visualização: **Partilhar PDF**, **Partilhar WhatsApp**, **Imprimir** e **Voltar para Edição**.

### 4. 📄 Partilha Direta do Arquivo PDF (Web Share API)
- Geração client-side do arquivo `.pdf` oficial em alta resolução via `html2pdf.js`, nomeado automaticamente com número do orçamento e nome do cliente (ex: `Orcamento_PREZZOTO_#0024_Cliente.pdf`).
- **Dispositivos Móveis (Android / iOS):** Integração com a **Web Share API nativa** — ao clicar em "Partilhar PDF", abre o menu do sistema e anexa o arquivo PDF diretamente na conversa do WhatsApp, Telegram ou E-mail com apenas um toque!
- **Ambiente Desktop:** Caso o navegador desktop não suporte anexação nativa de arquivos, o PDF é baixado automaticamente para a pasta Downloads e a aplicação abre um assistente para disparar o WhatsApp Web com o texto de apresentação pronto.

### 5. 📲 Compartilhamento via WhatsApp (Texto Estruturado)
- Modal de envio rápido gerando automaticamente uma mensagem estruturada e polida com emojis, discriminação de serviços, valores e forma de pagamento.
- Gera link direto `https://wa.me/` pronto para disparo no WhatsApp Web ou aplicativo mobile.

### 6. 💾 Persistência Local (LocalStorage)
- Se a página for recarregada ou fechada por engano, os dados preenchidos são restaurados automaticamente pelo navegador.

### 7. ⚡ Zero Dependências e Zero Instalação
- Não requer `npm install`, `node`, `docker` nem back-end. Basta dar um duplo clique em `index.html` em qualquer computador, tablet ou celular.

---

## 📁 Estrutura do Projeto

```text
martelinho-de-ouro/
├── imagem/
│   ├── cabecalho.png      # Banner/Cabeçalho oficial em alta resolução
│   └── logo.png           # Logotipo da oficina
├── index.html             # Estrutura semântica e folha A4 com Tailwind CSS
├── style.css              # Tipografia (Montserrat/Inter), tema dark e regras de impressão
├── script.js              # Lógica de cálculo, reatividade, PDF e WhatsApp
├── .gitignore             # Arquivos ignorados pelo controle de versão
└── README.md              # Documentação completa do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estruturação acessível e otimizada para navegadores modernos.
- **Tailwind CSS (via CDN):** Design responsivo com tokens customizados de cor (`brand.gold`, `brand.dark`).
- **Vanilla JavaScript (ES6+):** Código limpo, reativo, com manipulação do DOM e `Intl.NumberFormat` para moeda brasileira (`BRL`).
- **Google Fonts:** Famílias tipográficas `Montserrat` (identidade forte para marcas automotivas) e `Inter` (clareza e precisão numérica).

---

## 🖥️ Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/procopiooo/gerador-orcamento-oficina.git
   ```
2. **Abra o arquivo principal:**
   - Navegue até a pasta do projeto e dê dois cliques no arquivo `index.html`.
   - Ou abra via terminal:
     ```bash
     start index.html
     ```

Pronto! A aplicação roda imediatamente de forma 100% offline.

---

## 🌐 Como Publicar Gratuitamente no GitHub Pages

Você pode disponibilizar este gerador online para ser acessado de qualquer lugar (inclusive pelo celular no pátio da oficina):

1. No seu repositório no GitHub, vá na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Na seção **Build and deployment**:
   - **Source:** Selecione `Deploy from a branch`.
   - **Branch:** Escolha `main` e a pasta `/ (root)`.
4. Clique em **Save**.
5. Em menos de 1 minuto, seu gerador estará online com link seguro `https://seu-usuario.github.io/seu-repositorio/`.

---

## 📝 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo de licença para mais detalhes.

---

<p align="center">
  Desenvolvido com foco em produtividade, economia de tempo e precisão operacional para oficinas de Funilaria e Martelinho de Ouro.
</p>

