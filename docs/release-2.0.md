# Constelacao Tonal 2.0

## Brief de produto refinado

Construir um observatorio musical acessivel que permita a um iniciante descobrir notas, distancias, escalas, centros tonais e acordes por experimentacao. Cada conceito deve ter uma acao, uma consequencia visual, uma possibilidade de escuta e uma pergunta com feedback explicativo. Priorizar correcoes demonstraveis sobre adjetivos de qualidade.

## Contratos de interacao

- Explorar e Aprender sao ambientes separados. O aluno pode levar um exemplo para a roda por uma acao explicita.
- Somente os seletores principais reposicionam o par pedagogico. Os sliders relativos preservam a colecao.
- O comparador livre possui sua propria selecao e sua propria colecao; nunca segue o slider principal ou o par pedagogico.
- A geometria representa classes de altura fixas. O centro representa uma hierarquia musical, nao uma mudanca fisica das notas.
- Rotacionar notas nao basta para estabelecer musicalmente um modo: repouso, duracao, baixo e contexto harmonico importam.

## Implementacao e validacao

- StudyStudio: cinco descobertas com teclado cromatico, distancias, transposicao, modos, acordes, perguntas e progresso local.
- Audio sintetizado via Web Audio: seno e triangulo filtrados; nenhum arquivo MIDI externo. Escalas ascendentes calculadas em semitons desde a tonica, com oitava final.
- Escrita e reproducao de progressoes derivam dos mesmos acordes diatonicos. Numerais representam posicoes modais.
- npm test: 252 contextos (12 tonicas x 7 modos x 3 familias), rotacoes, pares, acordes e progressoes.
- Creditos: By Maycon, para Artistas do Futuro.
- Build estatico continua suficiente; nenhuma dependencia de servidor ou migracao de hospedagem necessaria.

## Limites pedagogicos explicitos

Menor melodica segue a forma ascendente usada no jazz. Nomes de notas usam sustenidos por convencao do produto; formulas intervalares tradicionais preservam indicacoes de alteracao. As descricoes de sensacao sao sugestoes, nao propriedades universais. O modo alterado pode ser reinterpretado sobre dominante, enquanto o campo por tercas diatonicas permanece calculado pela colecao.

## Publicacao

Executar npm test e npm run build antes de enviar a main. A integracao Git da Vercel deve criar um deployment de producao. Confirmar o status da nova revisao e o conteudo servido antes de afirmar que a atualizacao esta online.
