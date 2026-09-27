# Experiencia de instrumentos y descoberta

## Pedido transformado em criterios verificaveis
- Um gesto deve produzir uma mudanca observavel: distancia, transposicao, centro tonal ou empilhamento.
- Nenhum questionario: controles sonoros, regua cromatica, segmentos proporcionais e construcao de acordes.
- Cor de repouso verde-menta, fundo tinta, notas secundarias azul-cinza; dourado para distancias e aviso de incompatibilidade.
- Slider cromatico de tonica com nomes visiveis. Comparador independente preservado.
- Braco em afinacao padrao E2 A2 D3 G3 B3 E4, corda aguda em cima. Casa zero significa corda solta.
- Cinco desenhos pentatonicos maior/menor, testados em todas as tonicas. Maior usa os desenhos da menor relativa com tonica destacada diferente.
- Pentatonica fora da colecao gera aviso; nunca chamar essa selecao de subconjunto.
- Catalogo explicito de 20 qualidades, apenas se todas as classes de altura pertencerem a escala.
- Posicoes calculadas ate a casa 15, cordas sonoras contiguas, alcance de quatro casas e ate quatro cordas pressionadas. Sem garantia ergonomica; nenhuma numeracao de dedos inventada.
- Audio do acorde toca as alturas MIDI reais de cada corda/casa.

## Referencia consultada
https://tune-support.fender.com/hc/en-us/articles/360002815431-What-is-the-Scales-tool
Referencia de produto para diagramas adaptados a escala, afinacao e posicao. Nenhum codigo ou desenho proprietario copiado; geometrias calculadas localmente.

## Organizacao
src/lib/guitar.ts: afinacao, catalogo, busca de posicoes, cinco desenhos.
src/components/GuitarStudio.tsx: braco e biblioteca.
src/components/StudyStudio.tsx: quatro experimentos sem avaliacao por questionario.
scripts/check-music.mjs: invariantes musicais e posicoes.
