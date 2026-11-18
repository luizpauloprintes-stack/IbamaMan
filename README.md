# Ibamaman 💣

Jogo arcade de fiscalização ambiental para Android: explodir balsa de garimpo, pôr fogo em escavadeira, prender garimpeiro ilegal e, na última fase, enfrentar o Deputado Motosserra no Plenário.

Jogo de humor, sem vínculo com órgãos públicos. Personagens fictícios.

## Baixar e instalar

Cada envio para a branch `main` gera um APK automaticamente (GitHub Actions).
Abra a página **Releases** do repositório no celular, baixe o `FiscalBoom-N.apk` mais recente e instale.
O Android vai pedir para permitir "instalar apps desconhecidos" na primeira vez.

## Como funciona

- O jogo inteiro está em `app/src/main/assets/index.html`: HTML + canvas, com imagens e sons embutidos. Roda offline.
- `MainActivity.java` abre esse arquivo numa WebView em tela cheia, **na horizontal** (gira para os dois lados).
- Abre numa **capa animada** (logo, cena do rio com o fiscal) com os botões **Jogar** e **Como jogar**.
- Na partida: joystick à esquerda, tabuleiro no centro, botões **Fogo** e **Bomba** à direita.
- Botão **voltar**: fecha a ajuda; durante a partida, pausa e volta à capa (com "Continuar"); na capa, fecha o app. Sair do app também pausa.
- No navegador, em pé, o layout continua o vertical original.

Para testar o jogo no computador, basta abrir `app/src/main/assets/index.html` no navegador.

## Assinatura

O APK usa uma chave de teste (`app/debug.keystore`) fixa, para que cada versão nova instale por cima da anterior.
**Antes de publicar na Play Store**, crie uma chave de release própria e guarde-a fora do repositório (ou em *Secrets* do GitHub).

## Créditos

Baseado no jogo web "Bomberman: Ibama", de Wallace ([github.com/wallacerrlopes](https://github.com/wallacerrlopes)), adaptado com novo nome, chefe fictício e sem marcas de terceiros.
Uso da base sujeito à autorização do autor original.
