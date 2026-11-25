# Oro Café ☕

Trabalho acadêmico de JavaScript: uma cafeteria fictícia com cardápio digital, experiência de compra demonstrativa e entretenimento durante a espera.

**[Acessar o site](https://hildebertosampaiojr-bot.github.io/Cafeteria---Trabalho-javascript/)**

## Funcionalidades

- Página inicial com a história e a identidade visual do Oro Café.
- Cardápio com dez produtos, imagens, preços, filtros de bebidas e comidas e cartões interativos.
- Sacola com contador, confirmação visual ao adicionar, resumo e fechamento por X, Esc ou clique externo.
- Carrinho completo com ajuste de quantidades, remoção, total e nome para retirada.
- Confirmação que limpa a sacola e abre automaticamente o acompanhamento do pedido.
- Acompanhamento simulado: recebido, em preparo após 20 segundos e pronto após 2 minutos.
- Oro Play: jogo da memória (16 cartas, oito pares) e cobrinha do café (setas, WASD ou controles na tela).
- Transição circular azul-marinho entre as telas e layout responsivo.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem frameworks, dependências ou etapa de compilação. O jogo da cobrinha utiliza Canvas 2D; o recorde é armazenado localmente no navegador.

## Estrutura

```text
Cafeteria---Trabalho-javascript/
├── index.html          # Entrada do GitHub Pages e redirecionamento
├── cafeteria-oro.html   # Estrutura completa da interface
├── estilo.css          # Estilos e animações
├── script.js           # Cardápio, carrinho, navegação, pedidos e jogos
├── assets/             # Logo e imagens WebP dos produtos
└── README.md           # Documentação
```

## Como executar

1. Clone o repositório: `git clone https://github.com/hildebertosampaiojr-bot/Cafeteria---Trabalho-javascript.git`.
2. Abra a pasta e execute o `index.html` em um navegador atualizado, ou utilize o Live Server no VS Code.
3. Para acessar a página diretamente, abra `cafeteria-oro.html`.

## Como manter o código

Os produtos estão definidos nos cartões do cardápio em `cafeteria-oro.html`: nome, descrição, categoria, imagem e preço numérico em `data-price`. O preço exibido no cartão deve acompanhar esse valor. O JavaScript usa os dados desses cartões para calcular o carrinho e montar o jogo da memória. Os botões usam atributos `data-action` para concentrar os eventos no script. A folha de estilos contém a paleta, os componentes, as animações e os ajustes para telas menores.

## Limitações

Projeto exclusivamente demonstrativo, sem backend, pagamento, integração com uma cafeteria real ou persistência de pedidos após recarregar a página. Apenas o recorde da cobrinha é persistido localmente quando o navegador permite. O acompanhamento é uma simulação baseada no tempo.

