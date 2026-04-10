# Constelacao Tonal

Microproduto interativo para ensinar modos gregos, menor harmonica e menor melodica com uma metafora visual de observatorio cosmico: a mesma colecao de notas pode manter a mesma geometria enquanto a tonica redefine repouso, tensao, funcao e cor modal.

## O que a app mostra

- explorador modal com familia, tonica e modo
- views `Orbit`, `Constellation`, `Gravity`, `Function` e `Harmony`
- comparacao entre dois modos
- autoplay que percorre modos relativos preservando a colecao
- campo harmonico em triades e tetrades
- microtextos didaticos sobre relatividade modal

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- SVG + Canvas 2D

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereco mostrado pelo Vite no navegador.

## Build de producao

```bash
npm run build
```

O resultado fica em `dist/`.

## Publicacao

### Vercel

1. Importe o repositorio.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

### Netlify

1. Conecte o repositorio.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

### GitHub Pages

1. Rode `npm run build`.
2. Publique o conteudo de `dist/` em uma branch de pages.
3. O projeto usa `base: "./"` em `vite.config.ts`, o que facilita deploy estatico.

## Arquitetura curta

Veja `docs/architecture.md`.

## Principais decisoes de produto

- mesma colecao, novo centro tonal: a geometria no anel cromatico permanece fixa
- a tonica atual recebe halo, peso visual e fluxo gravitacional
- as funcoes intervalares mudam em tempo real conforme o centro tonal
- a comparacao destaca explicitamente o que permanece e o que muda
- a UI usa apenas sustenidos por decisao de produto

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Validacao realizada

- `npm install`
- `npm run build`
