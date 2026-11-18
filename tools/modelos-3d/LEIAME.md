# Modelos 3D do Fiscal Boom!

Os personagens e objetos são modelados em 3D com Three.js (`studio.js`) e
pré-renderizados como sprites (visão de cima 3/4, fundo transparente, contorno).

Para gerar de novo depois de mexer em um modelo:

```bash
cd tools/modelos-3d
npm install                       # instala o three
python3 -m http.server 8765 &     # serve o estúdio
python3 preview.py                # gera preview.png com todos os modelos
python3 atlas.py                  # gera atlas.json (sprites em WebP/base64)
```

Depois, troque o conteúdo de `window.SPRITES3D=` em `app/src/main/assets/index.html`
pelo conteúdo de `atlas.json`. Requer Python com Playwright e Chromium.
