# Sumario Tecnico de Continuidade

## Objetivo do Projeto

Estamos construindo uma aplicacao web premium para ensinar relatividade modal de forma visual, auditiva e intuitiva. O produto precisa deixar claro que diferentes modos podem compartilhar exatamente a mesma colecao de notas, enquanto a tonica redefine repouso, funcao intervalar, cor modal e progressao harmonica.

## Stack Tecnologica

- TypeScript
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- SVG para a geometria principal
- Canvas 2D para particulas e atmosfera visual
- Web Audio API para reproduzir notas, modos, acordes e progressoes

## Estrutura de Arquivos

- `src/App.tsx`: composicao geral da aplicacao, estado, autoplay e audio
- `src/data/modalFamilies.ts`: familias, modos, textos, cores e progressões
- `src/lib/music.ts`: logica teorica, colecoes, relativos, campos harmonicos e parsing de progressoes
- `src/lib/audio.ts`: sintese de audio via Web Audio
- `src/components/ControlBar.tsx`: topo com seletores principais e controles globais
- `src/components/ModalVisualizer.tsx`: roda/constelacao principal, gravity view, harmony view e slider acima da roda
- `src/components/InfoPanel.tsx`: painel teorico, campo harmonico e progressoes clicaveis
- `src/components/RelativeLab.tsx`: laboratorio para percorrer modos relativos e comparar centros tonais
- `src/components/ComparisonPanel.tsx`: comparacao entre modo A e modo B, com slider proprio do modo B
- `src/components/Tooltip.tsx`: tooltip visual
- `docs/architecture.md`: resumo de arquitetura
- `docs/prompt-master.md`: prompt base para futuras iteracoes
- `.github/workflows/deploy-pages.yml`: deploy automatico no GitHub Pages

## Estado Atual

Ja implementado e funcionando:

- explorador modal com familias maior, menor harmonica e menor melodica
- views `Orbit`, `Constellation`, `Gravity`, `Function` e `Harmony`
- `Gravity View` como view padrao
- roda ampliada com mais zoom e maior legibilidade
- slider principal movido para cima da roda
- modo comparacao com dois modos lado a lado
- slider do modo B independente, respeitando a propria colecao selecionada
- laboratorio dos 7 modos da mesma colecao
- reproducao de notas, modos, acordes e progressoes via Web Audio
- build validado com `npm run build`
- deploy automatico possivel em Vercel e GitHub Pages

## Proximos Passos

Itens mais provaveis para a proxima iteracao:

- revisar visualmente cada familia para dar identidade ainda mais marcante
- estudar se vale introduzir controles de volume, envelope ou escolha de timbre
- tornar o `Harmony View` ainda mais autoexplicativo para iniciantes
- revisar mais casos teoricos para garantir que nao exista nenhuma incoerencia de relativo ou funcao modal
- possivel polimento de responsividade em telas menores

## Decisoes de Design

- prioridade maxima para clareza pedagogica antes de efeito visual
- notacao usando apenas sustenidos por regra de produto
- componentes separados por responsabilidade
- logica musical concentrada em `src/lib/music.ts`
- animacoes suaves e com funcao didatica, evitando excesso
- interface com visual cosmico/editorial, glow controlado e fundo escuro
- nomes de funcoes e variaveis claros e sem abreviacoes desnecessarias
- build estatico, sem backend obrigatorio
