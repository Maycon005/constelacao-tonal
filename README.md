# Constelacao Tonal

Aplicacao interativa premium para estudar modos gregos, menor harmonica e menor melodica com uma metafora visual de observatorio cosmico: a mesma colecao de notas pode manter a mesma geometria enquanto a tonica redefine repouso, tensao, funcao e cor modal.

## O que a app mostra

- explorador modal com familia, tonica e modo
- views `Orbit`, `Constellation`, `Gravity`, `Function` e `Harmony`
- comparacao entre dois modos
- laboratorio de relativos com slider para os 7 modos da mesma colecao
- autoplay modal
- campo harmonico em triades e tetrades
- audio Web Audio para ouvir notas, modos, acordes e progressoes

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- SVG + Canvas 2D
- Web Audio API

## Rodando localmente

```bash
npm install
npm run dev -- --host
```

Abra o endereco mostrado pelo Vite no navegador. Se `localhost` nao abrir no seu ambiente, use `127.0.0.1`.

## Build de producao

```bash
npm run build
```

O resultado fica em `dist/`.

## Publicacao

### Vercel

1. Conecte o repositorio.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Cada `git push` para `main` gera um novo deploy.

### GitHub Pages automatizado

O projeto inclui workflow em `.github/workflows/deploy-pages.yml`.

Para ativar:

1. No GitHub, abra `Settings` do repositorio.
2. Clique em `Pages`.
3. Em `Build and deployment`, escolha `GitHub Actions`.
4. Depois do proximo `git push`, o Pages publica automaticamente.

## Fluxo de atualizacao

```bash
git add .
git commit -m "Sua mudanca"
git push
```

No Vercel, isso atualiza automaticamente. No GitHub Pages, a action tambem rebuilda e republica.

## Arquitetura curta

Veja `docs/architecture.md`.

## Prompt master

Veja `docs/prompt-master.md`.

## Continuidade de contexto

Veja `docs/continuity-summary.md`.

## Validacao realizada

- `npm install`
- `npm run build`
