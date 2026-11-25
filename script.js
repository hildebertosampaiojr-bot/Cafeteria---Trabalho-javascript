// O cardápio é a fonte única dos nomes, preços e descrições.
const cartoesProdutos = [...document.querySelectorAll('#menu article')];
const produtos = cartoesProdutos.map(cartao =>  [
cartao.querySelector('h3').textContent,
Number(cartao.dataset.preco),
cartao.querySelector('small').textContent
]);
let carrinho={
};
const formatarMoeda=valor => valor.toLocaleString('pt-BR', {
  style:'currency', currency:'BRL'
});
const temporizadoresConfirmacao=new WeakMap();
// Carrinho: inclusão, quantidades e retorno visual.
function adicionarProduto(indice, botao) {
  carrinho[indice]=(carrinho[indice]||0)+1;
  atualizarCarrinho();
  if(!botao)return;
  clearTimeout(temporizadoresConfirmacao.get(botao));
  botao.classList.add('adicionado');
  botao.textContent='✓';
  botao.setAttribute('aria-label', produtos[indice][0]+' adicionado à sacola');
  temporizadoresConfirmacao.set(botao, setTimeout(() => {
    botao.classList.remove('adicionado');
    botao.textContent='+';
    botao.setAttribute('aria-label', 'Adicionar '+produtos[indice][0]);
    temporizadoresConfirmacao.delete(botao)
  }, 900))
}
function removerUnidade(indice) {
  if(--carrinho[indice]<=0)delete carrinho[indice];
  atualizarCarrinho()
}
const imagensProdutos=cartoesProdutos.map(cartao => cartao.querySelector('img').src);
// Atualiza o resumo, o carrinho completo, os totais e o contador.
function atualizarCarrinho() {
  const itensCarrinho=Object.entries(carrinho), soma=itensCarrinho.reduce((acumulado, [indice, quantidade]) => acumulado+produtos[indice][1]*quantidade, 0);
  const quantidade=itensCarrinho.reduce((acumulado, [indice, quantidade]) => acumulado+quantidade, 0), contador=document.getElementById('contador-sacola');
  contador.textContent=quantidade;
  contador.hidden=quantidade===0;
  document.querySelector('.botao-sacola').setAttribute('aria-label', quantidade?'Abrir meu pedido, '+quantidade+(quantidade===1?' item':' itens'):'Abrir meu pedido, sacola vazia');
  document.getElementById('itens-sacola').innerHTML=itensCarrinho.map(([indice, quantidade]) => `<div class="linha-sacola"><img src="${imagensProdutos[indice]}" alt=""><div>${produtos[indice][0]}<small>Quantidade: ${quantidade}</small></div><b>${formatarMoeda(produtos[indice][1]*quantidade)}</b></div>`).join('')||'Sua sacola está vazia.';
  document.getElementById('itens-carrinho').innerHTML=itensCarrinho.map(([indice, quantidade]) => `<div class="linha-carrinho"><img src="${imagensProdutos[indice]}" alt=""><div><b>${produtos[indice][0]}</b><small>${formatarMoeda(produtos[indice][1])} por unidade</small><div class="quantidade"><button data-acao="diminuir" data-indice="${indice}" aria-label="Diminuir quantidade">−</button><span>${quantidade}</span><button data-acao="aumentar" data-indice="${indice}" aria-label="Aumentar quantidade">+</button><button class="remover-item" data-acao="remover" data-indice="${indice}">Remover</button></div></div><strong>${formatarMoeda(produtos[indice][1]*quantidade)}</strong></div>`).join('')||'Seu carrinho está vazio. Volte ao cardápio para escolher seus produtos.';
  for(const id of ['total', 'subtotal', 'total-geral'])document.getElementById(id).textContent=formatarMoeda(soma);
  document.getElementById('ir-carrinho').disabled=!itensCarrinho.length;
  document.querySelector('#finalizar-pedido button').disabled=!itensCarrinho.length
}
// Abertura do resumo e navegação para a finalização.
function abrirSacola() {
  atualizarCarrinho();
  document.getElementById('sacola').showModal()
}
function irParaCarrinho() {
  if(!Object.keys(carrinho).length)return;
  document.getElementById('sacola').close();
  document.getElementById('aviso').textContent='';
  location.hash='pedido'
}
// Filtragem por categoria, inclusive em telas pequenas.
function filtrarCardapio(categoria, botao) {
  document.querySelectorAll('.filtros button').forEach(x => {
    x.classList.toggle('ativo', x===botao);
    x.setAttribute('aria-pressed', String(x===botao))
  });
  cartoesProdutos.forEach(x => x.hidden=categoria!=='Todos'&&x.dataset.categoriaProduto!==categoria)
}
document.getElementById('finalizar-pedido').onsubmit=evento => {
  evento.preventDefault();
  if(!Object.keys(carrinho).length)return;
  ultimoPedido={
    numero:Date.now().toString().slice(-6), horario:Date.now(), itens:Object.entries(carrinho).map(([indice, quantidade]) => ({
      nome:produtos[indice][0], quantidade, preco:produtos[indice][1]
    }))
  };
  carrinho={
  };
  atualizarCarrinho();
  evento.target.reset();
  confirmacaoPendente=true;
  atualizarAcompanhamento();
  location.hash='acompanhar'
};
function selecionarCategoria(categoria) {
  const botao=[...document.querySelectorAll('.filtros button')].find(x => x.textContent===categoria);
  if(botao)filtrarCardapio(categoria, botao)
}
document.querySelectorAll('#menu article').forEach((cartao, indice) => {
  cartao.tabIndex=0;
  cartao.setAttribute('aria-label', produtos[indice][0]+' — '+formatarMoeda(produtos[indice][1]));
  cartao.addEventListener('click', evento => {
    if(evento.target.closest('button'))return;
    const estavaExpandido=cartao.classList.contains('expandido');
    document.querySelectorAll('#menu article.expandido').forEach(x => x.classList.remove('expandido'));
    if(!estavaExpandido)cartao.classList.add('expandido')
  });
  cartao.addEventListener('keydown', evento => {
    if(evento.target!==cartao)return;
    if(evento.key==='Enter'||evento.key===' ') {
      evento.preventDefault();
      cartao.click()
    }if(evento.key==='Escape') {
      cartao.classList.remove('expandido');
      cartao.blur()
    }
  })
});
document.addEventListener('click', evento => {
  if(!evento.target.closest('#menu article'))document.querySelectorAll('#menu article.expandido').forEach(x => x.classList.remove('expandido'))
});
atualizarCarrinho();
let telaAtual=null, controleTransicao=0, animacaoTransicao=null;
let confirmacaoPendente=false;
function mostrarConfirmacao() {
  if(confirmacaoPendente&&telaAtual==='acompanhar') {
    confirmacaoPendente=false;
    document.getElementById('confirmacao-pedido').showModal()
  }
}
// Navegação interna por hash e transição circular.
function mostrarTela() {
  const telaDestino=['inicio', 'menu', 'pedido', 'acompanhar'].includes(location.hash.slice(1))?location.hash.slice(1):'inicio';
  const aplicarTela=() => {
    for(const id of ['inicio', 'menu', 'pedido', 'acompanhar'])document.getElementById(id).hidden=id!==telaDestino;
    document.querySelectorAll('[data-tela]').forEach(link => {
      if(link.dataset.tela===telaDestino)link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current')
    });
    window.scrollTo({
      top:0, behavior:'instant'
    });
    telaAtual=telaDestino;
    if(telaDestino==='acompanhar')atualizarAcompanhamento()
  };
  const controle=++controleTransicao;
  const transicao=document.getElementById('transicao-tela');
  if(animacaoTransicao)animacaoTransicao.cancel();
  if(telaAtual===null||telaAtual===telaDestino||matchMedia('(prefers-reduced-motion: reduce)').matches||!transicao.animate) {
    transicao.classList.remove('transicionando');
    aplicarTela();
    mostrarConfirmacao();
    return
  }
  const retangulo=document.querySelector('header .marca').getBoundingClientRect(), x=retangulo.left+retangulo.width/2, y=retangulo.top+retangulo.height/2;
  const raio=Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y))+40;
  const inicioCirculo=`circle(0px at ${x}px ${y}px)`, fimCirculo=`circle(${raio}px at ${x}px ${y}px)`;
  transicao.classList.add('transicionando');
  animacaoTransicao=transicao.animate([{
    clipPath:inicioCirculo
  }, {
    clipPath:fimCirculo
  }], {
    duration:430, easing:'cubic-bezier(.55,.05,.3,1)', fill:'forwards'
  });
  animacaoTransicao.onfinish=() => {
    if(controle!==controleTransicao)return;
    aplicarTela();
    animacaoTransicao=transicao.animate([{
      clipPath:fimCirculo
    }, {
      clipPath:inicioCirculo
    }], {
      duration:470, easing:'cubic-bezier(.3,.1,.2,1)', fill:'forwards'
    });
    animacaoTransicao.onfinish=() => {
      if(controle===controleTransicao) {
        transicao.classList.remove('transicionando');
        animacaoTransicao.cancel();
        animacaoTransicao=null;
        mostrarConfirmacao()
      }
    }
  }
}
let ultimoPedido=null;
// Acompanhamento demonstrativo do último pedido.
function atualizarAcompanhamento() {
  const elemento=document.getElementById('situacao-pedido');
  if(!ultimoPedido) {
    elemento.innerHTML='<p>Nenhum pedido confirmado ainda.</p><a class="link-destaque" href="#menu">Explorar cardápio →</a>';
    return
  }
  const tempoDecorrido=Date.now()-ultimoPedido.horario, etapa=tempoDecorrido>=120000?2:tempoDecorrido>=20000?1:0;
  elemento.innerHTML=`<p>Pedido #${ultimoPedido.numero} · Simulação</p>`+['Pedido recebido', 'Em preparo', 'Pronto para retirada'].map((nome, indice) => `<div class="etapa-pedido ${indice<=etapa?'concluida':'pendente'}"><span>${indice<=etapa?'✓':indice+1}</span>${nome}</div>`).join('')+ultimoPedido.itens.map(indice => `<p>${indice.quantidade} × ${indice.nome}</p>`).join('')+`<strong>Total: ${formatarMoeda(ultimoPedido.itens.reduce((soma,indice)=>soma+indice.quantidade*indice.preco,0))}</strong><p><small>Status demonstrativo, não conectado à cafeteria.</small></p>`
}
let baralhoMemoria=[], cartasViradas=[], paresEncontrados=0, jogadasMemoria=0, memoriaBloqueada=false, rodadaMemoria=0, jogoSelecionado='memoria';
// Oro Play: alternância entre os jogos.
function escolherJogo(jogo) {
  jogoSelecionado=jogo;
  document.getElementById('jogo-memoria').hidden=jogo!=='memoria';
  document.getElementById('jogo-cobrinha').hidden=jogo!=='cobrinha';
  for(const nome of ['memoria', 'cobrinha'])document.getElementById('escolher-'+nome).setAttribute('aria-pressed', String(nome===jogo));
  if(jogo!=='cobrinha')pausarCobrinha();
  else desenharCobrinha()
}
// Jogo da memória: embaralhamento e formação de pares.
function reiniciarMemoria() {
  rodadaMemoria++;
  baralhoMemoria=[0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7];
  for(let indice=baralhoMemoria.length-1; indice>0; indice--) {
    const indiceSorteado=Math.floor(Math.random()*(indice+1));
    [baralhoMemoria[indice], baralhoMemoria[indiceSorteado]]=[baralhoMemoria[indiceSorteado], baralhoMemoria[indice]]
  }cartasViradas=[];
  paresEncontrados=0;
  jogadasMemoria=0;
  memoriaBloqueada=false;
  const tabuleiro=document.getElementById('tabuleiro-memoria');
  tabuleiro.replaceChildren();
  baralhoMemoria.forEach((valor, indice) => {
    const botao=document.createElement('button');
    botao.type='button';
    botao.innerHTML='<span class="marca-carta">ORO<small>CAFÉ</small></span>';
    botao.setAttribute('aria-label', 'Virar carta '+(indice+1));
    botao.onclick=() => virarCarta(indice, botao);
    tabuleiro.appendChild(botao)
  });
  atualizarPlacarMemoria()
}
function virarCarta(indice, botao) {
  if(memoriaBloqueada||botao.disabled||cartasViradas.some(x => x.indice===indice))return;
  const valor=baralhoMemoria[indice];
  botao.classList.add('revelada');
  const imagem=document.createElement('img');
  imagem.src=imagensProdutos[valor];
  imagem.alt=produtos[valor][0];
  botao.replaceChildren(imagem);
  botao.setAttribute('aria-label', produtos[valor][0]);
  cartasViradas.push({
    indice, botao, valor
  });
  if(cartasViradas.length!==2)return;
  jogadasMemoria++;
  const [primeiraCarta, segundaCarta]=cartasViradas;
  if(primeiraCarta.valor===segundaCarta.valor) {
    for(const x of cartasViradas) {
      x.botao.classList.add('encontrado');
      x.botao.disabled=true;
      x.botao.setAttribute('aria-label', produtos[x.valor][0]+' — par encontrado')
    }paresEncontrados++;
    cartasViradas=[];
    atualizarPlacarMemoria();
    return
  }memoriaBloqueada=true;
  const rodada=rodadaMemoria;
  atualizarPlacarMemoria();
  setTimeout(() => {
    if(rodada!==rodadaMemoria)return;
    for(const x of cartasViradas) {
      x.botao.classList.remove('revelada');
      x.botao.innerHTML='<span class="marca-carta">ORO<small>CAFÉ</small></span>';
      x.botao.setAttribute('aria-label', 'Virar carta '+(x.indice+1))
    }cartasViradas=[];
    memoriaBloqueada=false
  }, 850)
}
function atualizarPlacarMemoria() {
  document.getElementById('placar-memoria').textContent=paresEncontrados===8?`Parabéns! Todos os 8 pares em ${jogadasMemoria} jogadas.`:`Pares: ${paresEncontrados}/8 · Jogadas: ${jogadasMemoria}`
}
const quadroCobrinha=document.getElementById('tabuleiro-cobrinha'), contextoCobrinha=quadroCobrinha.getContext('2d'), tamanhoGrade=18, tamanhoCelula=20;
let corpoCobrinha=[], direcaoAtual={
  x:1, y:0
}, proximaDirecao={
  x:1, y:0
}, grao=null, temporizadorCobrinha=null, estadoCobrinha='aguardando', pontosCobrinha=0, recordeCobrinha=0;
try {
  recordeCobrinha=Number(localStorage.getItem('oro-snake-best'))||0
} catch(evento) {
};
// Cobrinha: posicionamento do grão em uma célula livre.
function posicionarGrao() {
  const celulasLivres=[];
  for(let y=0; y<tamanhoGrade; y++)for(let x=0; x<tamanhoGrade; x++)if(!corpoCobrinha.some(posicao => posicao.x===x&&posicao.y===y))celulasLivres.push({
    x, y
  });
  grao=celulasLivres.length?celulasLivres[Math.floor(Math.random()*celulasLivres.length)]:null
}
function reiniciarCobrinha() {
  corpoCobrinha=[{
    x:8, y:9
  }, {
    x:7, y:9
  }, {
    x:6, y:9
  }];
  direcaoAtual={
    x:1, y:0
  };
  proximaDirecao={
    x:1, y:0
  };
  pontosCobrinha=0;
  posicionarGrao()
}
// Desenho do jogo em canvas.
function desenharCobrinha() {
  const contexto=contextoCobrinha;
  contexto.fillStyle='#061426';
  contexto.fillRect(0, 0, 360, 360);
  contexto.strokeStyle='#142c43';
  contexto.lineWidth=.5;
  for(let indice=0; indice<=tamanhoGrade; indice++) {
    contexto.beginPath();
    contexto.moveTo(indice*20, 0);
    contexto.lineTo(indice*20, 360);
    contexto.moveTo(0, indice*20);
    contexto.lineTo(360, indice*20);
    contexto.stroke()
  }corpoCobrinha.forEach((posicao, indice) => {
    contexto.fillStyle=indice===0?'#f5cf8a':'#b78a42';
    contexto.fillRect(posicao.x*20+2, posicao.y*20+2, 16, 16);
    if(indice===0) {
      contexto.fillStyle='#061426';
      contexto.fillRect(posicao.x*20+6, posicao.y*20+5, 3, 3);
      contexto.fillRect(posicao.x*20+11, posicao.y*20+5, 3, 3)
    }
  });
  if(grao) {
    contexto.save();
    contexto.translate(grao.x*20+10, grao.y*20+10);
    contexto.rotate(.55);
    contexto.fillStyle='#e7b96a';
    contexto.beginPath();
    contexto.ellipse(0, 0, 6, 8, 0, 0, Math.PI*2);
    contexto.fill();
    contexto.strokeStyle='#704c24';
    contexto.beginPath();
    contexto.moveTo(0, -6);
    contexto.quadraticCurveTo(4, 0, 0, 6);
    contexto.stroke();
    contexto.restore()
  }if(estadoCobrinha!=='jogando') {
    contexto.fillStyle='#061426c9';
    contexto.fillRect(0, 140, 360, 80);
    contexto.fillStyle='#e7b96a';
    contexto.font='22px Georgia';
    contexto.textAlign='center';
    contexto.fillText(({
      aguardando:'Pronto para jogar?', pausada:'Pausa para o café', encerrada:'Fim de jogo', vitoria:'Todos os grãos!'
    })[estadoCobrinha]||'', 180, 185)
  }
  document.getElementById('placar-cobrinha').textContent=`Grãos: ${pontosCobrinha} · Recorde: ${recordeCobrinha}`;
  document.getElementById('iniciar-cobrinha').textContent=estadoCobrinha==='pausada'?'Continuar':estadoCobrinha==='jogando'?'Reiniciar':estadoCobrinha==='aguardando'?'Começar':'Jogar novamente'
}
function iniciarCobrinha() {
  clearInterval(temporizadorCobrinha);
  if(estadoCobrinha!=='pausada')reiniciarCobrinha();
  estadoCobrinha='jogando';
  desenharCobrinha();
  temporizadorCobrinha=setInterval(avancarCobrinha, 145)
}
function pausarCobrinha() {
  if(estadoCobrinha==='jogando') {
    clearInterval(temporizadorCobrinha);
    temporizadorCobrinha=null;
    estadoCobrinha='pausada';
    desenharCobrinha()
  }
}
function encerrarCobrinha(estado) {
  clearInterval(temporizadorCobrinha);
  temporizadorCobrinha=null;
  estadoCobrinha=estado;
  desenharCobrinha()
}
function direcionarCobrinha(x, y) {
  if(estadoCobrinha!=='jogando')return;
  if(x===-direcaoAtual.x&&y===-direcaoAtual.y)return;
  proximaDirecao={
    x, y
  }
}
// Atualização da cobrinha, colisões e pontuação.
function avancarCobrinha() {
  direcaoAtual=proximaDirecao;
  const cabeca={
    x:corpoCobrinha[0].x+direcaoAtual.x, y:corpoCobrinha[0].y+direcaoAtual.y
  };
  const comeuGrao=grao&&cabeca.x===grao.x&&cabeca.y===grao.y;
  const corpo=comeuGrao?corpoCobrinha:corpoCobrinha.slice(0, -1);
  if(cabeca.x<0||cabeca.y<0||cabeca.x>=tamanhoGrade||cabeca.y>=tamanhoGrade||corpo.some(posicao => posicao.x===cabeca.x&&posicao.y===cabeca.y)) {
    encerrarCobrinha('encerrada');
    return
  }corpoCobrinha.unshift(cabeca);
  if(comeuGrao) {
    pontosCobrinha++;
    if(pontosCobrinha>recordeCobrinha) {
      recordeCobrinha=pontosCobrinha;
      try {
        localStorage.setItem('oro-snake-best', recordeCobrinha)
      } catch(evento) {
      }
    }posicionarGrao();
    if(!grao) {
      encerrarCobrinha('vitoria');
      return
    }
  } else corpoCobrinha.pop();
  desenharCobrinha()
}
reiniciarCobrinha();
desenharCobrinha();
document.addEventListener('keydown', evento => {
  if(telaAtual!=='acompanhar'||jogoSelecionado!=='cobrinha'||estadoCobrinha!=='jogando'||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(evento.target.tagName))return;
  const direcao={
    ArrowUp:[0, -1], w:[0, -1], ArrowDown:[0, 1], s:[0, 1], ArrowLeft:[-1, 0], a:[-1, 0], ArrowRight:[1, 0], d:[1, 0]
  }[evento.key];
  if(direcao) {
    evento.preventDefault();
    direcionarCobrinha(...direcao)
  }
});
window.addEventListener('hashchange', () => {
  if(location.hash!=='#acompanhar')pausarCobrinha()
});
document.addEventListener('visibilitychange', () => {
  if(document.hidden)pausarCobrinha()
});
reiniciarMemoria();
setInterval(() => {
  if(telaAtual==='acompanhar'&&ultimoPedido)atualizarAcompanhamento()
}, 1000);
window.addEventListener('hashchange', mostrarTela);
mostrarTela();
// Fecha a sacola ao clicar fora de seus limites, sem afetar os controles internos.
const resumoSacola = document.getElementById('sacola');
let cliqueIniciadoFora = false;
function foraDaSacola(evento) {
  const retangulo = resumoSacola.getBoundingClientRect();
  return evento.clientX < retangulo.left || evento.clientX > retangulo.right || evento.clientY < retangulo.top || evento.clientY > retangulo.bottom;
}
resumoSacola.addEventListener('pointerdown', evento =>  {
  cliqueIniciadoFora = evento.target === resumoSacola && foraDaSacola(evento);
});
resumoSacola.addEventListener('click', evento =>  {
  if (cliqueIniciadoFora && evento.target === resumoSacola && foraDaSacola(evento)) resumoSacola.close();
  cliqueIniciadoFora = false;
});
resumoSacola.addEventListener('close', () =>  {
  cliqueIniciadoFora = false;
});
// Eventos da interface: os botões declaram sua ação no HTML.
document.addEventListener('click', evento =>  {
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;
  const indice = Number(botao.dataset.indice);
  switch (botao.dataset.acao) {
    case 'adicionar-produto': adicionarProduto(indice, botao);
    break;
    case 'aumentar': adicionarProduto(indice);
    break;
    case 'diminuir': removerUnidade(indice);
    break;
    case 'remover': delete carrinho[indice];
    atualizarCarrinho();
    break;
    case 'abrir-sacola': abrirSacola();
    break;
    case 'finalizar-pedido': irParaCarrinho();
    break;
    case 'filtrar': filtrarCardapio(botao.dataset.categoria, botao);
    break;
    case 'selecionar-categoria': selecionarCategoria(botao.dataset.categoria);
    break;
    case 'escolher-jogo': escolherJogo(botao.dataset.jogo);
    break;
    case 'reiniciar-memoria': reiniciarMemoria();
    break;
    case 'iniciar-cobrinha': iniciarCobrinha();
    break;
    case 'pausar-cobrinha': pausarCobrinha();
    break;
    case 'direcionar-cobrinha': direcionarCobrinha(Number(botao.dataset.x), Number(botao.dataset.y));
    break;
    case 'fechar-confirmacao': document.getElementById('confirmacao-pedido').close();
    break;
    case 'voltar-topo': evento.preventDefault();
    window.scrollTo({
      top:0, behavior:'smooth'
    });
    break;
  }
});
