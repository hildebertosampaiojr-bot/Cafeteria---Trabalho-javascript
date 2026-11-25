const cardapio = [
  {
    id: "cafe-coado",
    nome: "Café coado",
    descricao: "Café especial passado na hora, encorpado e aromático.",
    preco: 7.5,
    categoria: "cafes",
    detalhe: "coado na hora",
    icone: "☕",
    cor: "cafe"
  },
  {
    id: "cappuccino",
    nome: "Cappuccino da casa",
    descricao: "Espresso cremoso com leite vaporizado e um toque de canela.",
    preco: 12,
    categoria: "cafes",
    detalhe: "o queridinho",
    icone: "🥛",
    cor: "canela"
  },
  {
    id: "bolo-cenoura",
    nome: "Bolo de cenoura",
    descricao: "Fatia fofinha com cobertura de chocolate feita na casa.",
    preco: 9,
    categoria: "comidinhas",
    detalhe: "feito hoje",
    icone: "🍰",
    cor: "pessego"
  },
  {
    id: "pao-queijo",
    nome: "Pão de queijo",
    descricao: "Douradinho por fora, macio por dentro e servido quentinho.",
    preco: 6,
    categoria: "comidinhas",
    detalhe: "sai quentinho",
    icone: "🧀",
    cor: "milho"
  },
  {
    id: "cha-hibisco",
    nome: "Chá de hibisco",
    descricao: "Infusão delicada, floral e servida com uma rodela de laranja.",
    preco: 8,
    categoria: "gelados",
    detalhe: "também vai gelado",
    icone: "🍵",
    cor: "rosa"
  },
  {
    id: "cookie",
    nome: "Cookie de chocolate",
    descricao: "Cookie artesanal com pedaços generosos de chocolate.",
    preco: 8.5,
    categoria: "comidinhas",
    detalhe: "feito na casa",
    icone: "🍪",
    cor: "chocolate"
  }
];

const chavePedido = "graoDeAfetoPedido";
const listaCardapio = document.getElementById("lista-cardapio");
const buscaCardapio = document.getElementById("busca-cardapio");
const semResultados = document.getElementById("sem-resultados");
const formulario = document.getElementById("form-pedido");
const seletorItem = document.getElementById("item-pedido");
const campoQuantidade = document.getElementById("quantidade");
const contadorPedido = document.getElementById("contador-pedido");
const quantidadeItens = document.getElementById("quantidade-itens");
const mensagemPedido = document.getElementById("mensagem-pedido");
const erroPedido = document.getElementById("erro-pedido");
const listaPedido = document.getElementById("itens-pedido");
const pedidoVazio = document.getElementById("pedido-vazio");
const totalPedido = document.getElementById("total-pedido");
const textoStatus = document.getElementById("texto-status");
const botaoStatus = document.getElementById("alternar-status");
const statusPonto = document.getElementById("status-ponto");
const formatoPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function lerPedidoSalvo() {
  let registro;

  try {
    registro = localStorage.getItem(chavePedido);
  } catch (erro) {
    console.error("Não foi possível acessar o pedido salvo.", erro);
    mensagemPedido.textContent = "Este navegador não liberou o salvamento do pedido.";
    return [];
  }

  if (!registro) {
    return [];
  }

  let dados;

  try {
    dados = JSON.parse(registro);
  } catch (erro) {
    console.error("O pedido salvo não contém dados válidos.", erro);
    mensagemPedido.textContent = "Não consegui ler o pedido salvo. Comece uma sacola nova.";
    return [];
  }

  if (!Array.isArray(dados)) {
    mensagemPedido.textContent = "O pedido salvo está fora do formato esperado. Comece uma sacola nova.";
    return [];
  }

  const pedidoValido = [];

  for (const item of dados) {
    const itemBemFormado = item && typeof item === "object";
    const produtoExiste = itemBemFormado && cardapio.some((produto) => produto.id === item.id);
    const quantidadeValida = itemBemFormado && Number.isInteger(item.quantidade) && item.quantidade > 0 && item.quantidade <= 99;

    if (produtoExiste && quantidadeValida) {
      pedidoValido.push({ id: item.id, quantidade: item.quantidade });
    } else {
      mensagemPedido.textContent = "Alguns itens salvos não puderam ser recuperados.";
    }
  }

  return pedidoValido;
}

let pedido = lerPedidoSalvo();
let aberta = true;

function formatarPreco(valor) {
  return formatoPreco.format(valor);
}

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function desenharCardapio() {
  const categoriaAtiva = document.querySelector(".filtro.ativo").dataset.categoria;
  const busca = normalizarTexto(buscaCardapio.value.trim());
  const produtosVisiveis = cardapio.filter((produto) => {
    const correspondeCategoria = categoriaAtiva === "todos" || produto.categoria === categoriaAtiva;
    const textoProduto = normalizarTexto(`${produto.nome} ${produto.descricao}`);
    const correspondeBusca = textoProduto.includes(busca);
    return correspondeCategoria && correspondeBusca;
  });

  listaCardapio.replaceChildren();
  semResultados.hidden = produtosVisiveis.length > 0;

  for (const produto of produtosVisiveis) {
    const artigo = document.createElement("article");
    artigo.className = `produto produto-${produto.cor}`;
    artigo.dataset.produto = produto.id;

    const topo = document.createElement("div");
    topo.className = "produto-arte";
    topo.setAttribute("aria-hidden", "true");
    topo.appendChild(criarElemento("span", "produto-icone", produto.icone));
    topo.appendChild(criarElemento("span", "produto-detalhe", produto.detalhe));

    const conteudo = document.createElement("div");
    conteudo.className = "produto-conteudo";
    conteudo.appendChild(criarElemento("h3", "", produto.nome));
    conteudo.appendChild(criarElemento("p", "produto-descricao", produto.descricao));

    const rodape = document.createElement("div");
    rodape.className = "produto-rodape";
    rodape.appendChild(criarElemento("span", "produto-preco", formatarPreco(produto.preco)));

    const botao = criarElemento("button", "adicionar-cardapio", "Pôr na sacola +");
    botao.type = "button";
    botao.dataset.adicionar = produto.id;
    botao.setAttribute("aria-label", `Adicionar ${produto.nome} à sacola`);
    rodape.appendChild(botao);

    conteudo.appendChild(rodape);
    artigo.append(topo, conteudo);
    listaCardapio.appendChild(artigo);
  }
}

for (const produto of cardapio) {
  const opcao = document.createElement("option");
  opcao.value = produto.id;
  opcao.textContent = `${produto.nome} — ${formatarPreco(produto.preco)}`;
  seletorItem.appendChild(opcao);
}

function salvarPedido() {
  try {
    localStorage.setItem(chavePedido, JSON.stringify(pedido));
    return true;
  } catch (erro) {
    console.error("Não foi possível salvar o pedido.", erro);
    mensagemPedido.textContent = "O navegador não conseguiu salvar o pedido. Ele pode sumir ao fechar a página.";
    return false;
  }
}

function desenharPedido() {
  listaPedido.replaceChildren();
  let total = 0;
  let quantidadeTotal = 0;

  for (const item of pedido) {
    const produto = cardapio.find((opcao) => opcao.id === item.id);

    if (!produto) {
      continue;
    }

    const subtotal = produto.preco * item.quantidade;
    total += subtotal;
    quantidadeTotal += item.quantidade;

    const linha = document.createElement("li");
    linha.className = "linha-pedido";

    const identificacao = document.createElement("div");
    identificacao.className = "item-identificacao";
    identificacao.appendChild(criarElemento("span", "item-icone", produto.icone));

    const nome = document.createElement("div");
    nome.appendChild(criarElemento("strong", "item-nome", produto.nome));
    nome.appendChild(criarElemento("span", "item-subtotal", formatarPreco(subtotal)));
    identificacao.appendChild(nome);

    const controles = document.createElement("div");
    controles.className = "controles-quantidade";

    const diminuir = criarElemento("button", "controle", "−");
    diminuir.type = "button";
    diminuir.dataset.acao = "diminuir";
    diminuir.dataset.id = item.id;
    diminuir.setAttribute("aria-label", `Diminuir quantidade de ${produto.nome}`);

    const quantidade = criarElemento("span", "quantidade-item", String(item.quantidade));
    quantidade.setAttribute("aria-label", `Quantidade: ${item.quantidade}`);

    const aumentar = criarElemento("button", "controle", "+");
    aumentar.type = "button";
    aumentar.dataset.acao = "aumentar";
    aumentar.dataset.id = item.id;
    aumentar.setAttribute("aria-label", `Aumentar quantidade de ${produto.nome}`);

    const remover = criarElemento("button", "remover-item", "Tirar");
    remover.type = "button";
    remover.dataset.acao = "remover";
    remover.dataset.id = item.id;
    remover.setAttribute("aria-label", `Remover ${produto.nome} da sacola`);

    controles.append(diminuir, quantidade, aumentar, remover);
    linha.append(identificacao, controles);
    listaPedido.appendChild(linha);
  }

  pedidoVazio.hidden = pedido.length > 0;
  totalPedido.textContent = formatarPreco(total);
  quantidadeItens.textContent = `(${quantidadeTotal})`;
  contadorPedido.textContent = String(quantidadeTotal);
  contadorPedido.setAttribute("aria-label", `${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"} no pedido`);
  document.getElementById("limpar-pedido").disabled = pedido.length === 0;
}

function adicionarAoPedido(id, quantidade = 1) {
  const itemExistente = pedido.find((item) => item.id === id);

  if (itemExistente) {
    if (itemExistente.quantidade + quantidade > 99) {
      mensagemPedido.textContent = "O limite é 99 unidades por item.";
      return;
    }

    itemExistente.quantidade += quantidade;
  } else {
    pedido.push({ id: id, quantidade: quantidade });
  }

  const salvo = salvarPedido();
  desenharPedido();
  if (salvo) {
    mensagemPedido.textContent = "Foi pra sacola. Escolha mais um se quiser!";
  }
  erroPedido.textContent = "";
}

document.querySelector(".filtros").addEventListener("click", function (evento) {
  const botao = evento.target.closest("[data-categoria]");

  if (!botao) {
    return;
  }

  for (const filtro of document.querySelectorAll(".filtro")) {
    const selecionado = filtro === botao;
    filtro.classList.toggle("ativo", selecionado);
    filtro.setAttribute("aria-pressed", String(selecionado));
  }

  desenharCardapio();
});

buscaCardapio.addEventListener("input", desenharCardapio);

listaCardapio.addEventListener("click", function (evento) {
  const botao = evento.target.closest("[data-adicionar]");

  if (botao) {
    adicionarAoPedido(botao.dataset.adicionar);
  }
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensagemPedido.textContent = "";
  erroPedido.textContent = "";

  const id = document.getElementById("item-pedido").value;
  const quantidadeTexto = campoQuantidade.value.trim();
  const quantidade = Number(quantidadeTexto);

  if (!id) {
    erroPedido.textContent = "Escolha uma coisa gostosa do cardápio primeiro.";
    document.getElementById("item-pedido").focus();
    return;
  } else if (!quantidadeTexto || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 20) {
    erroPedido.textContent = "A quantidade precisa ser um número inteiro entre 1 e 20.";
    campoQuantidade.focus();
    return;
  }

  adicionarAoPedido(id, quantidade);
  formulario.reset();
});

listaPedido.addEventListener("click", function (evento) {
  const botao = evento.target.closest("[data-acao]");

  if (!botao) {
    return;
  }

  const item = pedido.find((linha) => linha.id === botao.dataset.id);

  if (!item) {
    return;
  }

  if (botao.dataset.acao === "remover" || (botao.dataset.acao === "diminuir" && item.quantidade === 1)) {
    pedido = pedido.filter((linha) => linha.id !== item.id);
  } else if (botao.dataset.acao === "diminuir") {
    item.quantidade -= 1;
  } else if (botao.dataset.acao === "aumentar") {
    if (item.quantidade >= 99) {
      mensagemPedido.textContent = "O limite é 99 unidades por item.";
      return;
    }

    item.quantidade += 1;
  }

  const salvo = salvarPedido();
  desenharPedido();
  if (salvo) {
    mensagemPedido.textContent = "";
  }
});

botaoStatus.addEventListener("click", function () {
  if (aberta) {
    aberta = false;
    textoStatus.textContent = "Fechamos por hoje. Até a próxima!";
    botaoStatus.textContent = "Abrir a casa";
    statusPonto.classList.add("fechado");
  } else {
    aberta = true;
    textoStatus.textContent = "Estamos abertos. Chega mais!";
    botaoStatus.textContent = "Fechar a casa";
    statusPonto.classList.remove("fechado");
  }
});

document.getElementById("limpar-pedido").addEventListener("click", function () {
  pedido = [];
  const salvo = salvarPedido();
  desenharPedido();
  if (salvo) {
    mensagemPedido.textContent = "Sacola vazia. Quando quiser, a gente está por aqui.";
  }
});

desenharCardapio();
desenharPedido();
