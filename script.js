// O cardápio é a fonte única dos nomes, preços e descrições.
const productCards = [...document.querySelectorAll('#menu article')];
const products = productCards.map(card =>  [
card.querySelector('h3').textContent,
Number(card.dataset.price),
card.querySelector('small').textContent
]);
let cart={
};
const money=v => v.toLocaleString('pt-BR', {
  style:'currency', currency:'BRL'
});
const addFeedbackTimers=new WeakMap();
// Carrinho: inclusão, quantidades e retorno visual.
function add(i, button) {
  cart[i]=(cart[i]||0)+1;
  render();
  if(!button)return;
  clearTimeout(addFeedbackTimers.get(button));
  button.classList.add('added');
  button.textContent='✓';
  button.setAttribute('aria-label', products[i][0]+' adicionado à sacola');
  addFeedbackTimers.set(button, setTimeout(() => {
    button.classList.remove('added');
    button.textContent='+';
    button.setAttribute('aria-label', 'Adicionar '+products[i][0]);
    addFeedbackTimers.delete(button)
  }, 900))
}
function removeItem(i) {
  if(--cart[i]<=0)delete cart[i];
  render()
}
const productImages=productCards.map(card => card.querySelector('img').src);
// Atualiza o resumo, o carrinho completo, os totais e o contador.
function render() {
  const entries=Object.entries(cart), sum=entries.reduce((s, [i, q]) => s+products[i][1]*q, 0);
  const quantity=entries.reduce((s, [i, q]) => s+q, 0), badge=document.getElementById('count');
  badge.textContent=quantity;
  badge.hidden=quantity===0;
  document.querySelector('.order-button').setAttribute('aria-label', quantity?'Abrir meu pedido, '+quantity+(quantity===1?' item':' itens'):'Abrir meu pedido, sacola vazia');
  document.getElementById('lines').innerHTML=entries.map(([i, q]) => `<div class="mini-line"><img src="${productImages[i]}" alt=""><div>${products[i][0]}<small>Quantidade: ${q}</small></div><b>${money(products[i][1]*q)}</b></div>`).join('')||'Sua sacola está vazia.';
  document.getElementById('checkout-lines').innerHTML=entries.map(([i, q]) => `<div class="checkout-line"><img src="${productImages[i]}" alt=""><div><b>${products[i][0]}</b><small>${money(products[i][1])} por unidade</small><div class="qty"><button data-action="decrease" data-index="${i}" aria-label="Diminuir quantidade">−</button><span>${q}</span><button data-action="increase" data-index="${i}" aria-label="Aumentar quantidade">+</button><button class="delete" data-action="remove" data-index="${i}">Remover</button></div></div><strong>${money(products[i][1]*q)}</strong></div>`).join('')||'Seu carrinho está vazio. Volte ao cardápio para escolher seus produtos.';
  for(const id of ['total', 'subtotal', 'grand-total'])document.getElementById(id).textContent=money(sum);
  document.getElementById('go-checkout').disabled=!entries.length;
  document.querySelector('#checkout button').disabled=!entries.length
}
// Abertura do resumo e navegação para a finalização.
function openCart() {
  render();
  document.getElementById('cart').showModal()
}
function goCheckout() {
  if(!Object.keys(cart).length)return;
  document.getElementById('cart').close();
  document.getElementById('notice').textContent='';
  location.hash='pedido'
}
// Filtragem por categoria, inclusive em telas pequenas.
function filterMenu(c, b) {
  document.querySelectorAll('.filters button').forEach(x => {
    x.classList.toggle('active', x===b);
    x.setAttribute('aria-pressed', String(x===b))
  });
  productCards.forEach(x => x.hidden=c!=='Todos'&&x.dataset.cat!==c)
}
document.getElementById('checkout').onsubmit=e => {
  e.preventDefault();
  if(!Object.keys(cart).length)return;
  lastOrder={
    number:Date.now().toString().slice(-6), time:Date.now(), items:Object.entries(cart).map(([i, q]) => ({
      name:products[i][0], q, price:products[i][1]
    }))
  };
  cart={
  };
  render();
  e.target.reset();
  pendingConfirmation=true;
  updateTracking();
  location.hash='acompanhar'
};
function selectCategory(cat) {
  const b=[...document.querySelectorAll('.filters button')].find(x => x.textContent===cat);
  if(b)filterMenu(cat, b)
}
document.querySelectorAll('#menu article').forEach((card, i) => {
  card.tabIndex=0;
  card.setAttribute('aria-label', products[i][0]+' — '+money(products[i][1]));
  card.addEventListener('click', e => {
    if(e.target.closest('button'))return;
    const was=card.classList.contains('expanded');
    document.querySelectorAll('#menu article.expanded').forEach(x => x.classList.remove('expanded'));
    if(!was)card.classList.add('expanded')
  });
  card.addEventListener('keydown', e => {
    if(e.target!==card)return;
    if(e.key==='Enter'||e.key===' ') {
      e.preventDefault();
      card.click()
    }if(e.key==='Escape') {
      card.classList.remove('expanded');
      card.blur()
    }
  })
});
document.addEventListener('click', e => {
  if(!e.target.closest('#menu article'))document.querySelectorAll('#menu article.expanded').forEach(x => x.classList.remove('expanded'))
});
render();
let activeTab=null, transitionToken=0, wipeAnimation=null;
let pendingConfirmation=false;
function showConfirmation() {
  if(pendingConfirmation&&activeTab==='acompanhar') {
    pendingConfirmation=false;
    document.getElementById('order-confirm').showModal()
  }
}
// Navegação interna por hash e transição circular.
function showTab() {
  const target=['inicio', 'menu', 'pedido', 'acompanhar'].includes(location.hash.slice(1))?location.hash.slice(1):'inicio';
  const apply=() => {
    for(const id of ['inicio', 'menu', 'pedido', 'acompanhar'])document.getElementById(id).hidden=id!==target;
    document.querySelectorAll('[data-tab]').forEach(a => {
      if(a.dataset.tab===target)a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current')
    });
    window.scrollTo({
      top:0, behavior:'instant'
    });
    activeTab=target;
    if(target==='acompanhar')updateTracking()
  };
  const token=++transitionToken;
  const wipe=document.getElementById('page-wipe');
  if(wipeAnimation)wipeAnimation.cancel();
  if(activeTab===null||activeTab===target||matchMedia('(prefers-reduced-motion: reduce)').matches||!wipe.animate) {
    wipe.classList.remove('wiping');
    apply();
    showConfirmation();
    return
  }
  const r=document.querySelector('header .brand').getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
  const radius=Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y))+40;
  const start=`circle(0px at ${x}px ${y}px)`, end=`circle(${radius}px at ${x}px ${y}px)`;
  wipe.classList.add('wiping');
  wipeAnimation=wipe.animate([{
    clipPath:start
  }, {
    clipPath:end
  }], {
    duration:430, easing:'cubic-bezier(.55,.05,.3,1)', fill:'forwards'
  });
  wipeAnimation.onfinish=() => {
    if(token!==transitionToken)return;
    apply();
    wipeAnimation=wipe.animate([{
      clipPath:end
    }, {
      clipPath:start
    }], {
      duration:470, easing:'cubic-bezier(.3,.1,.2,1)', fill:'forwards'
    });
    wipeAnimation.onfinish=() => {
      if(token===transitionToken) {
        wipe.classList.remove('wiping');
        wipeAnimation.cancel();
        wipeAnimation=null;
        showConfirmation()
      }
    }
  }
}
let lastOrder=null;
// Acompanhamento demonstrativo do último pedido.
function updateTracking() {
  const el=document.getElementById('track-status');
  if(!lastOrder) {
    el.innerHTML='<p>Nenhum pedido confirmado ainda.</p><a class="cta" href="#menu">Explorar cardápio →</a>';
    return
  }
  const elapsed=Date.now()-lastOrder.time, stage=elapsed>=120000?2:elapsed>=20000?1:0;
  el.innerHTML=`<p>Pedido #${lastOrder.number} · Simulação</p>`+['Pedido recebido', 'Em preparo', 'Pronto para retirada'].map((name, i) => `<div class="track-step ${i<=stage?'done':'pending'}"><span>${i<=stage?'✓':i+1}</span>${name}</div>`).join('')+lastOrder.items.map(i => `<p>${i.q} × ${i.name}</p>`).join('')+`<strong>Total: ${money(lastOrder.items.reduce((sum,i)=>sum+i.q*i.price,0))}</strong><p><small>Status demonstrativo, não conectado à cafeteria.</small></p>`
}
let memoryDeck=[], memoryOpen=[], memoryPairs=0, memoryMoves=0, memoryLock=false, memoryRound=0, selectedGame='memory';
// Oro Play: alternância entre os jogos.
function chooseGame(game) {
  selectedGame=game;
  document.getElementById('memory-game').hidden=game!=='memory';
  document.getElementById('snake-game').hidden=game!=='snake';
  for(const name of ['memory', 'snake'])document.getElementById('pick-'+name).setAttribute('aria-pressed', String(name===game));
  if(game!=='snake')pauseSnake();
  else drawSnake()
}
// Jogo da memória: embaralhamento e formação de pares.
function newGame() {
  memoryRound++;
  memoryDeck=[0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7];
  for(let i=memoryDeck.length-1; i>0; i--) {
    const j=Math.floor(Math.random()*(i+1));
    [memoryDeck[i], memoryDeck[j]]=[memoryDeck[j], memoryDeck[i]]
  }memoryOpen=[];
  memoryPairs=0;
  memoryMoves=0;
  memoryLock=false;
  const board=document.getElementById('treasure-board');
  board.replaceChildren();
  memoryDeck.forEach((value, i) => {
    const b=document.createElement('button');
    b.type='button';
    b.innerHTML='<span class="memory-mark">ORO<small>CAFÉ</small></span>';
    b.setAttribute('aria-label', 'Virar carta '+(i+1));
    b.onclick=() => flipMemory(i, b);
    board.appendChild(b)
  });
  scoreGame()
}
function flipMemory(i, b) {
  if(memoryLock||b.disabled||memoryOpen.some(x => x.i===i))return;
  const value=memoryDeck[i];
  b.classList.add('revealed');
  const img=document.createElement('img');
  img.src=productImages[value];
  img.alt=products[value][0];
  b.replaceChildren(img);
  b.setAttribute('aria-label', products[value][0]);
  memoryOpen.push({
    i, b, value
  });
  if(memoryOpen.length!==2)return;
  memoryMoves++;
  const [a, c]=memoryOpen;
  if(a.value===c.value) {
    for(const x of memoryOpen) {
      x.b.classList.add('found');
      x.b.disabled=true;
      x.b.setAttribute('aria-label', products[x.value][0]+' — par encontrado')
    }memoryPairs++;
    memoryOpen=[];
    scoreGame();
    return
  }memoryLock=true;
  const round=memoryRound;
  scoreGame();
  setTimeout(() => {
    if(round!==memoryRound)return;
    for(const x of memoryOpen) {
      x.b.classList.remove('revealed');
      x.b.innerHTML='<span class="memory-mark">ORO<small>CAFÉ</small></span>';
      x.b.setAttribute('aria-label', 'Virar carta '+(x.i+1))
    }memoryOpen=[];
    memoryLock=false
  }, 850)
}
function scoreGame() {
  document.getElementById('game-score').textContent=memoryPairs===8?`Parabéns! Todos os 8 pares em ${memoryMoves} jogadas.`:`Pares: ${memoryPairs}/8 · Jogadas: ${memoryMoves}`
}
const snakeCanvas=document.getElementById('snake-board'), snakeCtx=snakeCanvas.getContext('2d'), snakeN=18, snakeCell=20;
let snakeBody=[], snakeDir={
  x:1, y:0
}, snakeNext={
  x:1, y:0
}, snakeFood=null, snakeTimer=null, snakeState='idle', snakePoints=0, snakeBest=0;
try {
  snakeBest=Number(localStorage.getItem('oro-snake-best'))||0
} catch(e) {
};
// Cobrinha: posicionamento do grão em uma célula livre.
function placeBean() {
  const free=[];
  for(let y=0; y<snakeN; y++)for(let x=0; x<snakeN; x++)if(!snakeBody.some(p => p.x===x&&p.y===y))free.push({
    x, y
  });
  snakeFood=free.length?free[Math.floor(Math.random()*free.length)]:null
}
function resetSnake() {
  snakeBody=[{
    x:8, y:9
  }, {
    x:7, y:9
  }, {
    x:6, y:9
  }];
  snakeDir={
    x:1, y:0
  };
  snakeNext={
    x:1, y:0
  };
  snakePoints=0;
  placeBean()
}
// Desenho do jogo em canvas.
function drawSnake() {
  const c=snakeCtx;
  c.fillStyle='#061426';
  c.fillRect(0, 0, 360, 360);
  c.strokeStyle='#142c43';
  c.lineWidth=.5;
  for(let i=0; i<=snakeN; i++) {
    c.beginPath();
    c.moveTo(i*20, 0);
    c.lineTo(i*20, 360);
    c.moveTo(0, i*20);
    c.lineTo(360, i*20);
    c.stroke()
  }snakeBody.forEach((p, i) => {
    c.fillStyle=i===0?'#f5cf8a':'#b78a42';
    c.fillRect(p.x*20+2, p.y*20+2, 16, 16);
    if(i===0) {
      c.fillStyle='#061426';
      c.fillRect(p.x*20+6, p.y*20+5, 3, 3);
      c.fillRect(p.x*20+11, p.y*20+5, 3, 3)
    }
  });
  if(snakeFood) {
    c.save();
    c.translate(snakeFood.x*20+10, snakeFood.y*20+10);
    c.rotate(.55);
    c.fillStyle='#e7b96a';
    c.beginPath();
    c.ellipse(0, 0, 6, 8, 0, 0, Math.PI*2);
    c.fill();
    c.strokeStyle='#704c24';
    c.beginPath();
    c.moveTo(0, -6);
    c.quadraticCurveTo(4, 0, 0, 6);
    c.stroke();
    c.restore()
  }if(snakeState!=='running') {
    c.fillStyle='#061426c9';
    c.fillRect(0, 140, 360, 80);
    c.fillStyle='#e7b96a';
    c.font='22px Georgia';
    c.textAlign='center';
    c.fillText(({
      idle:'Pronto para jogar?', paused:'Pausa para o café', over:'Fim de jogo', won:'Todos os grãos!'
    })[snakeState]||'', 180, 185)
  }
  document.getElementById('snake-score').textContent=`Grãos: ${snakePoints} · Recorde: ${snakeBest}`;
  document.getElementById('snake-start').textContent=snakeState==='paused'?'Continuar':snakeState==='running'?'Reiniciar':snakeState==='idle'?'Começar':'Jogar novamente'
}
function startSnake() {
  clearInterval(snakeTimer);
  if(snakeState!=='paused')resetSnake();
  snakeState='running';
  drawSnake();
  snakeTimer=setInterval(tickSnake, 145)
}
function pauseSnake() {
  if(snakeState==='running') {
    clearInterval(snakeTimer);
    snakeTimer=null;
    snakeState='paused';
    drawSnake()
  }
}
function endSnake(state) {
  clearInterval(snakeTimer);
  snakeTimer=null;
  snakeState=state;
  drawSnake()
}
function turnSnake(x, y) {
  if(snakeState!=='running')return;
  if(x===-snakeDir.x&&y===-snakeDir.y)return;
  snakeNext={
    x, y
  }
}
// Atualização da cobrinha, colisões e pontuação.
function tickSnake() {
  snakeDir=snakeNext;
  const head={
    x:snakeBody[0].x+snakeDir.x, y:snakeBody[0].y+snakeDir.y
  };
  const eat=snakeFood&&head.x===snakeFood.x&&head.y===snakeFood.y;
  const body=eat?snakeBody:snakeBody.slice(0, -1);
  if(head.x<0||head.y<0||head.x>=snakeN||head.y>=snakeN||body.some(p => p.x===head.x&&p.y===head.y)) {
    endSnake('over');
    return
  }snakeBody.unshift(head);
  if(eat) {
    snakePoints++;
    if(snakePoints>snakeBest) {
      snakeBest=snakePoints;
      try {
        localStorage.setItem('oro-snake-best', snakeBest)
      } catch(e) {
      }
    }placeBean();
    if(!snakeFood) {
      endSnake('won');
      return
    }
  } else snakeBody.pop();
  drawSnake()
}
resetSnake();
drawSnake();
document.addEventListener('keydown', e => {
  if(activeTab!=='acompanhar'||selectedGame!=='snake'||snakeState!=='running'||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const d={
    ArrowUp:[0, -1], w:[0, -1], ArrowDown:[0, 1], s:[0, 1], ArrowLeft:[-1, 0], a:[-1, 0], ArrowRight:[1, 0], d:[1, 0]
  }[e.key];
  if(d) {
    e.preventDefault();
    turnSnake(...d)
  }
});
window.addEventListener('hashchange', () => {
  if(location.hash!=='#acompanhar')pauseSnake()
});
document.addEventListener('visibilitychange', () => {
  if(document.hidden)pauseSnake()
});
newGame();
setInterval(() => {
  if(activeTab==='acompanhar'&&lastOrder)updateTracking()
}, 1000);
window.addEventListener('hashchange', showTab);
showTab();
// Fecha a sacola ao clicar fora de seus limites, sem afetar os controles internos.
const miniCart = document.getElementById('cart');
let startedOutside = false;
function outsideCart(e) {
  const r = miniCart.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}
miniCart.addEventListener('pointerdown', e =>  {
  startedOutside = e.target === miniCart && outsideCart(e);
});
miniCart.addEventListener('click', e =>  {
  if (startedOutside && e.target === miniCart && outsideCart(e)) miniCart.close();
  startedOutside = false;
});
miniCart.addEventListener('close', () =>  {
  startedOutside = false;
});
// Eventos da interface: os botões declaram sua ação no HTML.
document.addEventListener('click', event =>  {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const index = Number(button.dataset.index);
  switch (button.dataset.action) {
    case 'add-product': add(index, button);
    break;
    case 'increase': add(index);
    break;
    case 'decrease': removeItem(index);
    break;
    case 'remove': delete cart[index];
    render();
    break;
    case 'open-cart': openCart();
    break;
    case 'checkout': goCheckout();
    break;
    case 'filter': filterMenu(button.dataset.category, button);
    break;
    case 'select-category': selectCategory(button.dataset.category);
    break;
    case 'choose-game': chooseGame(button.dataset.game);
    break;
    case 'new-memory': newGame();
    break;
    case 'start-snake': startSnake();
    break;
    case 'pause-snake': pauseSnake();
    break;
    case 'turn-snake': turnSnake(Number(button.dataset.x), Number(button.dataset.y));
    break;
    case 'close-confirm': document.getElementById('order-confirm').close();
    break;
    case 'scroll-top': event.preventDefault();
    window.scrollTo({
      top:0, behavior:'smooth'
    });
    break;
  }
});
