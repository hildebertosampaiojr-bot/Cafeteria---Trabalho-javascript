<div align="center">

<img src="assets/logo.webp" width="180" alt="Logo dourado do Oro Café">

# ☕ Oro Café

**O valor dos pequenos momentos.**

<img alt="PROJETO ACADÊMICO" src="https://img.shields.io/static/v1?label=&amp;message=PROJETO%20ACAD%C3%8AMICO&amp;color=061426&amp;style=for-the-badge">
<img alt="FRONT-END" src="https://img.shields.io/static/v1?label=&amp;message=FRONT-END&amp;color=B78A42&amp;style=for-the-badge">
<img alt="JAVASCRIPT PURO" src="https://img.shields.io/static/v1?label=&amp;message=JAVASCRIPT%20PURO&amp;color=E7B96A&amp;style=for-the-badge&amp;logo=javascript&amp;logoColor=061426">

<a href="https://hildebertosampaiojr-bot.github.io/Cafeteria---Trabalho-javascript/"><img alt="ACESSAR DEMONSTRAÇÃO" src="https://img.shields.io/static/v1?label=&amp;message=ACESSAR%20DEMONSTRA%C3%87%C3%83O&amp;color=946B31&amp;style=for-the-badge&amp;logo=githubpages&amp;logoColor=white"></a>
<a href="#-como-executar-localmente"><img alt="EXECUTAR LOCALMENTE" src="https://img.shields.io/static/v1?label=&amp;message=EXECUTAR%20LOCALMENTE&amp;color=061426&amp;style=for-the-badge&amp;logo=visualstudiocode&amp;logoColor=white"></a>

</div>

---

Projeto acadêmico de JavaScript que simula a experiência digital de uma cafeteria fictícia, reunindo cardápio interativo, carrinho de compras, acompanhamento de pedidos e jogos personalizados.

## 🎯 Objetivo

Aplicar conceitos de desenvolvimento web front-end e lógica de programação em uma aplicação interativa, responsiva e organizada, utilizando tecnologias nativas do navegador.

## 🛠️ Tecnologias utilizadas

<div align="center">

<img alt="HTML5" src="https://img.shields.io/static/v1?label=&amp;message=HTML5&amp;color=E34F26&amp;style=flat-square&amp;logo=html5&amp;logoColor=white">
<img alt="CSS3" src="https://img.shields.io/static/v1?label=&amp;message=CSS3&amp;color=1572B6&amp;style=flat-square&amp;logo=css3&amp;logoColor=white">
<img alt="JavaScript" src="https://img.shields.io/static/v1?label=&amp;message=JavaScript&amp;color=F7DF1E&amp;style=flat-square&amp;logo=javascript&amp;logoColor=202020">
<img alt="DOM API" src="https://img.shields.io/static/v1?label=&amp;message=DOM%20API&amp;color=5965A9&amp;style=flat-square">
<img alt="Canvas 2D API" src="https://img.shields.io/static/v1?label=&amp;message=Canvas%202D%20API&amp;color=8B5CF6&amp;style=flat-square">
<img alt="Web Animations API" src="https://img.shields.io/static/v1?label=&amp;message=Web%20Animations%20API&amp;color=B45309&amp;style=flat-square">
<img alt="Web Storage API" src="https://img.shields.io/static/v1?label=&amp;message=Web%20Storage%20API&amp;color=0F766E&amp;style=flat-square">
<img alt="WebP" src="https://img.shields.io/static/v1?label=&amp;message=WebP&amp;color=4285F4&amp;style=flat-square">
<img alt="Git" src="https://img.shields.io/static/v1?label=&amp;message=Git&amp;color=F05032&amp;style=flat-square&amp;logo=git&amp;logoColor=white">
<img alt="GitHub" src="https://img.shields.io/static/v1?label=&amp;message=GitHub&amp;color=24292F&amp;style=flat-square&amp;logo=github&amp;logoColor=white">
<img alt="GitHub Pages" src="https://img.shields.io/static/v1?label=&amp;message=GitHub%20Pages&amp;color=087F5B&amp;style=flat-square&amp;logo=githubpages&amp;logoColor=white">

</div>

| Tecnologia | Aplicação no projeto |
| --- | --- |
| **HTML5** | Estrutura semântica, seções, formulários, diálogos, SVG e elemento Canvas. |
| **CSS3** | Identidade visual, variáveis CSS, Grid, Flexbox, responsividade, transições e animações. |
| **JavaScript (Vanilla JS)** | Cardápio, filtros, carrinho, cálculos, navegação, pedidos e lógica dos jogos. |
| **DOM API** | Eventos, seleção e criação de elementos, atualização de conteúdo e atributos. |
| **Canvas 2D API** | Desenho do tabuleiro, cobrinha e grãos de café. |
| **Web Animations API** | Transição circular entre as telas com `Element.animate()`. |
| **Web Storage API** | Uso de `localStorage` para armazenar o recorde da cobrinha. |
| **Git** | Controle de versões do código-fonte. |
| **GitHub** | Hospedagem e gerenciamento do repositório. |
| **GitHub Pages** | Publicação estática do site. |
| **WebP** | Formato das imagens da marca e dos produtos, armazenadas na pasta `assets/`. |

Toda a aplicação funciona com HTML, CSS e JavaScript puro, sem frameworks, dependências externas ou etapa de compilação.

## ✨ Funcionalidades

### Cardápio digital

- Dez produtos com imagens, descrições e preços.
- Filtros por categoria: todos, bebidas e comidas.
- Cartões expansíveis por mouse, toque ou teclado.
- Confirmação temporária ao adicionar um produto à sacola.

<div align="center">
  <img src="assets/cappuccino.webp" alt="Cappuccino" width="120">
  <img src="assets/croissant.webp" alt="Croissant" width="120">
  <img src="assets/brownie.webp" alt="Brownie" width="120">
</div>

### Sacola e carrinho

- Contador de itens atualizado automaticamente.
- Resumo dos produtos, quantidades e valores.
- Fechamento do resumo pelo botão X, Esc ou clique externo.
- Ajuste de quantidades, remoção de itens e cálculo do total em reais.
- Formulário com campo obrigatório de nome para retirada.

### Acompanhamento de pedidos

Ao confirmar, o sistema registra o pedido demonstrativo, esvazia o carrinho e redireciona para a tela de acompanhamento, com uma mensagem de confirmação.

| Etapa | Momento simulado |
| --- | --- |
| Pedido recebido | Imediatamente após a confirmação |
| Em preparo | Após 20 segundos |
| Pronto para retirada | Após 2 minutos |

### Oro Play

Enquanto aguarda, o cliente pode escolher um dos dois jogos:

| Jogo | Funcionamento |
| --- | --- |
| Caça ao Ouro | Jogo da memória com 16 cartas, oito pares de produtos, embaralhamento e contador de jogadas. |
| Cobrinha do Café | Coleta de grãos de café em um tabuleiro Canvas, com pontuação, recorde local, pausa e reinício. |

A cobrinha pode ser controlada pelas setas, pelas teclas WASD ou pelos botões direcionais na tela.

## 🎨 Identidade visual

<div align="center">

<img alt="AZUL-MARINHO · 061426" src="https://img.shields.io/static/v1?label=&amp;message=AZUL-MARINHO%20%C2%B7%20061426&amp;color=061426&amp;style=for-the-badge">
<img alt="DOURADO · E7B96A" src="https://img.shields.io/static/v1?label=&amp;message=DOURADO%20%C2%B7%20E7B96A&amp;color=B78A42&amp;style=for-the-badge">
<img alt="CREME · F8F1E4" src="https://img.shields.io/static/v1?label=&amp;message=CREME%20%C2%B7%20F5F2EC&amp;color=F8F1E4&amp;style=for-the-badge">

</div>

A interface apresenta uma combinação de azul-marinho, dourado e tons claros, com uma proposta visual inspirada em cafeterias de cafés especiais e confeitaria artesanal.

| Cor | Hexadecimal | Aplicação |
| --- | --- | --- |
| Azul-marinho | `#061426` | Fundo principal e transição entre telas |
| Dourado | `#E7B96A` | Destaques, botões e detalhes |
| Creme | `#F8F1E4` | Textos e elementos claros |

O layout utiliza CSS Grid, Flexbox e media queries para adaptação a diferentes dimensões de tela. Também considera a preferência do navegador por movimento reduzido.

## 📁 Estrutura do projeto

```text
Cafeteria---Trabalho-javascript/
├── index.html          # Entrada e redirecionamento do site
├── cafeteria-oro.html  # Interface completa da cafeteria
├── estilo.css          # Estilos, componentes e responsividade
├── script.js           # Lógica da aplicação e dos jogos
├── assets/             # Logo e imagens WebP dos dez produtos
└── README.md           # Documentação
```

## 🧠 Conceitos de JavaScript aplicados

| Conceito | Exemplo no projeto |
| --- | --- |
| Variáveis, arrays e objetos | Produtos, quantidades, pedidos e estado dos jogos. |
| Condicionais e laços | Validação de ações, filtros, formação de pares e colisões. |
| Funções e eventos | Interações do cardápio, sacola e controles dos jogos. |
| Métodos de arrays | `map()`, `reduce()`, `forEach()`, `find()` e `some()`. |
| Manipulação do DOM | Renderização dinâmica do carrinho e das cartas. |
| Temporizadores | `setTimeout()` e `setInterval()` no feedback, nos pedidos e nos jogos. |
| Números e aleatoriedade | Cálculos, embaralhamento das cartas e posição dos grãos. |
| Navegação por hash | Alternância de seções com `location.hash` e `hashchange`. |
| Persistência local | Recorde da cobrinha com `localStorage`. |

## 🔄 Fluxo da aplicação

```mermaid
flowchart TD
    A[index.html] --> B[cafeteria-oro.html]
    B --> C[Início]
    C --> D[Cardápio]
    D --> E[Sacola]
    E --> F[Carrinho]
    F --> G[Confirmar pedido]
    G --> H[Acompanhar pedido]
    H --> I[Caça ao Ouro]
    H --> J[Cobrinha do Café]
    classDef base fill:#061426,stroke:#B78A42,color:#F8F1E4;
    classDef order fill:#E7B96A,stroke:#B78A42,color:#061426;
    classDef game fill:#20394E,stroke:#E7B96A,color:#F8F1E4;
    class A,B,C,D,E,F base;
    class G,H order;
    class I,J game;
```

## 🚀 Como executar localmente

```bash
git clone https://github.com/hildebertosampaiojr-bot/Cafeteria---Trabalho-javascript.git
cd Cafeteria---Trabalho-javascript
```

Abra `index.html` em um navegador atualizado ou utilize a extensão Live Server no Visual Studio Code. O arquivo de entrada redireciona para `cafeteria-oro.html`, que também pode ser aberto diretamente.

## 🔧 Manutenção e evolução

- **Produtos:** edite os cartões do cardápio em `cafeteria-oro.html`, mantendo a categoria, descrição, imagem, preço exibido e atributo `data-preco` consistentes. O JavaScript lê os dados desses cartões.
- **Visual:** ajuste a paleta, os componentes e os pontos de quebra em `estilo.css`.
- **Interações:** altere as funções correspondentes em `script.js`. Os principais botões usam atributos `data-acao`. As funções, variáveis, classes, identificadores e atributos personalizados do projeto têm nomes em português. Palavras reservadas e APIs nativas mantêm a sintaxe original.
- **Imagens:** utilize arquivos na pasta `assets/` e atualize os caminhos no HTML.

Possíveis melhorias futuras incluem integração com backend, catálogo dinâmico, persistência de pedidos e painel administrativo.

## ⚠️ Limitações

Esta é uma aplicação demonstrativa, sem backend, banco de dados, autenticação, pagamentos ou integração com uma cafeteria real. Os pedidos e o carrinho permanecem na memória da página; apenas o recorde da cobrinha é salvo localmente quando o navegador permite. Os estados do pedido são simulados por tempo.

## 🔗 Outro trabalho acadêmico

Conheça também **[Lâmpada Funcional](https://github.com/hildebertosampaiojr-bot/Lampada-Funcional)**, um simulador de interruptor que pratica condicionais, eventos e manipulação do DOM.

[Abrir Lâmpada Funcional](https://hildebertosampaiojr-bot.github.io/Lampada-Funcional/)

---

<div align="center">

<img alt="DESENVOLVIMENTO WEB" src="https://img.shields.io/static/v1?label=&amp;message=DESENVOLVIMENTO%20WEB&amp;color=B78A42&amp;style=flat-square"> <img alt="PROJETO EDUCACIONAL" src="https://img.shields.io/static/v1?label=&amp;message=PROJETO%20EDUCACIONAL&amp;color=061426&amp;style=flat-square">

**Desenvolvimento web front-end · Trabalho acadêmico**

[Voltar ao topo](#-oro-café)

</div>
