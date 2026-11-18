# Fiscal Boom! 💣

Jogo arcade de fiscalização ambiental para Android: explodir balsa de garimpo, pôr fogo em escavadeira, prender garimpeiro ilegal e, na última fase, enfrentar o Deputado Motosserra no Plenário.

Jogo de humor, sem vínculo com órgãos públicos. Personagens fictícios.

## Baixar e instalar

Cada envio para a branch `main` gera um APK automaticamente (GitHub Actions).
Abra a página **Releases** do repositório no celular, baixe o `FiscalBoom-N.apk` mais recente e instale.
O Android vai pedir para permitir "instalar apps desconhecidos" na primeira vez.

## Como funciona

- O jogo inteiro está em `app/src/main/assets/index.html`: HTML + canvas, com imagens e sons embutidos. Roda offline.
- `MainActivity.java` abre esse arquivo numa WebView em tela cheia, na vertical.
- Botão **voltar**: pausa durante a partida; fora dela, fecha o app. Sair do app também pausa.
- Controles: joystick e botões **Fogo** e **Bomba** na tela.

Para testar o jogo no computador, basta abrir `app/src/main/assets/index.html` no navegador.

## Assinatura

O APK usa uma chave de teste (`app/debug.keystore`) fixa, para que cada versão nova instale por cima da anterior.
**Antes de publicar na Play Store**, crie uma chave de release própria e guarde-a fora do repositório (ou em *Secrets* do GitHub).

## Créditos

Baseado no jogo web "Bomberman: Ibama", de Wallace ([github.com/wallacerrlopes](https://github.com/wallacerrlopes)), adaptado com novo nome, chefe fictício e sem marcas de terceiros.
Uso da base sujeito à autorização do autor original.
