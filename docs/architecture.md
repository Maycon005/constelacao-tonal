# Arquitetura

## Stack

- React 18 + TypeScript
- Vite para desenvolvimento e build estatico
- Tailwind CSS para composicao visual
- Framer Motion para transicoes e microinteracoes
- SVG como motor principal da geometria modal
- Canvas 2D para o campo de particulas e atmosfera cosmica

## Estrutura

- `src/App.tsx`: orquestracao do estado global, autoplay e layout
- `src/lib/music.ts`: motor teorico com colecoes, funcoes, intervalos e campo harmonico
- `src/data/modalFamilies.ts`: familias, modos, assinaturas visuais e progressões
- `src/components/ModalVisualizer.tsx`: orbitas, constelacao, gravidade, function view e harmony view
- `src/components/InfoPanel.tsx`: leitura pedagogica, chips funcionais, acordes e progressões
- `src/components/ComparisonPanel.tsx`: comparacao lado a lado entre dois modos

## Decisoes

- A geometria fica fixa em 12 posicoes cromaticas para tornar a relatividade modal imediatamente visivel.
- O slider relativo e o autoplay trocam a tonica dentro da mesma colecao para que a forma nao mude.
- A notacao usa somente sustenidos para manter a leitura consistente em toda a UI.
- O produto prioriza clareza didatica: o brilho e a animacao reforcam a teoria em vez de competir com ela.
