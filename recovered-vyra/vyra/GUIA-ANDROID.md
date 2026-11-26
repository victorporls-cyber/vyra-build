# VYRA 1.1: guia para Android

Caminho: **app web, depois PWA instalável, depois APK**. Cada etapa usa o mesmo código.

## 1. Instalar no Android (PWA)

A instalação só funciona com o app publicado em um endereço **https** (por exemplo, no Netlify). Abrir o `index.html` direto do arquivo não instala.

1. Publique a pasta (veja o README, seção "Publicar").
2. Abra o link no **Chrome** do celular.
3. Toque em **Ajustes**. Se o Chrome já liberou a instalação, aparece o botão **Instalar app**. Toque nele.
4. Se o botão não aparecer, toque nos três pontinhos (⋮) do Chrome e depois em **Instalar app** (ou **Adicionar à tela inicial**).
5. O ícone do VYRA aparece na tela inicial. Ao abrir por ele, o app roda em tela cheia, sem a barra do navegador.

Dica: segurando o ícone do VYRA, o Android mostra o atalho **Adicionar gasto**.

## 2. Como testar

No celular, depois de instalar:

- Cadastre o salário e o vale (Ajustes), um ganho extra (aba Extras), uma conta, um gasto e a reserva: o valor "Quanto posso gastar hoje?" muda na hora. Dinheiro com data futura só entra no cálculo quando a data chega.
- Abra a aba **Mês** (Visão do mês): totais, gráfico de gastos por dia e ganhos x gastos.
- Toque em um gasto ou em uma conta para editar. Exclua e use **Desfazer**.
- Feche o app (arraste para fora dos recentes), abra de novo: os dados continuam.
- Ligue o **modo avião** e abra o app: ele abre e continua funcionando.
- Abra um formulário e toque nos campos com o teclado aberto: o botão de salvar deve ficar alcançável (role a gaveta se precisar).
- Teste um caso de déficit (reserva maior que o dinheiro que sobra): aparece "Déficit de R$ ..." e o limite fica R$ 0,00.

Para inspecionar no computador: no Chrome do PC, abra `chrome://inspect` com o celular ligado por cabo (depuração USB ligada).

Atualizações: ao publicar uma versão nova, troque o número em `const CACHE = 'vyra-v1.1'` no `sw.js` (por exemplo, `vyra-v1.2`). Quem já instalou recebe o aviso "Nova versão disponível".

## 3. Gerar o APK (Capacitor)

O projeto já tem `capacitor.config.json`, `package.json` e o script `scripts/copy-web.mjs`. O APK **não foi gerado** nesta etapa, porque exige o Android Studio no seu computador.

Requisitos (segundo a documentação do Capacitor 8): Node.js 22 ou mais novo e Android Studio 2025.2.1 ou mais novo. O Android Studio instala o JDK sozinho.

O ID do app (`appId`) já está definido como `com.vyra.app` em `capacitor.config.json`. Depois de publicado na Google Play, ele não pode mais mudar.

Na pasta do projeto, um comando faz tudo (copia o app para `www/`, embute as fontes, cria o projeto Android, aplica o logo, compila e gera `VYRA.apk`):

    npm install
    npm run apk

Requer Node 22+, Java 21 e o Android SDK (`ANDROID_HOME`; o Android Studio instala). O APK sai na pasta do projeto, com o nome `VYRA.apk`.

Para abrir no Android Studio em vez disso: `npm run android:add` (só na primeira vez), `npm run android:sync` e `npm run android:open`.

No Android Studio, use **Build > Build Bundle(s) / APK(s) > Build APK(s)**. O arquivo de teste (debug) fica em `android/app/build/outputs/apk/debug/app-debug.apk`.

Instalar o APK de teste no seu celular: conecte por cabo com a depuração USB ligada e use o botão **Run** do Android Studio. Instalar um `.apk` copiado para o celular também funciona, mas veja o aviso da seção 5 sobre a verificação de desenvolvedor.

No APK, o app e as fontes já vêm dentro do pacote (nada é carregado de um site). Por isso o `copy-web.mjs` remove o service worker e o cartão "Instalar app" da cópia que vai para o Android.

Ícone e abertura do APK: o projeto Android nasce com o ícone padrão do Capacitor. Para usar o ícone do VYRA, o caminho comum é o pacote `@capacitor/assets` (veja a documentação dele). Use o `icon-512.png` como ponto de partida.

Alternativa sem código: o PWABuilder (pwabuilder.com) gera um pacote Android a partir do link https da PWA publicada. É uma opção boa se você só quer o app na Play Store e não precisa de recursos nativos.

## APK automático no GitHub (sem instalar nada)

O projeto traz `.github/workflows/apk.yml`, que instala o Capacitor, cria o projeto Android com o logo da VYRA, compila e entrega o `VYRA.apk` de teste (debug, já instalável).

1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta, incluindo `.github` e `assets`.
2. Abra a aba **Actions**, escolha **Gerar VYRA.apk** e toque em **Run workflow**.
3. Quando terminar (alguns minutos), abra a execução e baixe o arquivo **VYRA-apk** em Artifacts. Dentro está o `VYRA.apk`.

Essa automação não foi executada ainda, porque o ambiente onde o projeto foi preparado não tem acesso aos servidores do Android e do npm. Se algum passo falhar, o log da aba Actions mostra qual.

## 4. O que mudou na 1.1

- `index.html`: salário e vale separados (renda normal), página **Ganhos extras**, cálculo pelas datas de recebimento, página **Visão do mês** (aba Mês) com gráficos, e migração automática dos dados da V4.
- `sw.js`: cache `vyra-v1.1`.
- `package.json`: versão `1.1.0`.
- Detalhes do cálculo e dos dados: veja o `README.md`.

## 4.1 Arquivos alterados na V4

- `index.html`: Home com "Quanto posso gastar hoje?", aviso de déficit, edição de gastos e contas, tela de abertura, ajustes para o teclado do celular, cartão "Instalar o VYRA", selo "Exemplo", atalho "Adicionar gasto".
- `manifest.json`: novo (substitui o `manifest.webmanifest` da V1). Nome, cores, ícones, tela cheia e atalho.
- `sw.js`: cache `vyra-v4` (hoje `vyra-v1.1`), atualização em segundo plano e aviso de nova versão.
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `icon.svg`: o logo original do VYRA sobre fundo escuro, nos tamanhos que o Android pede.
- Novos: `package.json`, `capacitor.config.json`, `scripts/copy-web.mjs`, `.gitignore`, este guia.

Os dados continuam na mesma chave do `localStorage` (`vyra:v1`), então quem testou a V1 no mesmo endereço não perde nada.

## 5. Próximos passos para a Google Play

1. **Conta de desenvolvedor** no Google Play Console (há uma taxa única; confira o valor atual).
2. **Teste fechado obrigatório** para contas pessoais criadas depois de 13/11/2023: é preciso rodar um teste fechado com pelo menos 12 testadores que ficaram inscritos de forma contínua por 14 dias antes de pedir acesso à produção. Fonte oficial: https://support.google.com/googleplay/android-developer/answer/14151465
3. **Pacote assinado**: a Play pede um Android App Bundle (`.aab`), gerado no Android Studio em **Build > Generate Signed App Bundle**. Guarde a chave de assinatura em lugar seguro.
4. **Ficha da loja**: nome, descrição curta e longa, ícone 512x512, imagem de destaque, capturas de tela do celular.
5. **Política de privacidade** com endereço público e o formulário de **Segurança dos dados** (o VYRA guarda tudo só no aparelho, o que simplifica as respostas). Preencha também as declarações de app financeiro que o Play Console pedir. O VYRA não oferece empréstimos, investimentos nem pagamentos, e vale deixar isso claro na descrição.
6. **Versão mínima de API exigida pela Play**: ela muda todo ano. Confira o requisito atual no Play Console antes de enviar.
7. **Verificação de desenvolvedor do Android**: a partir de 30/09/2026, no Brasil, apps de desenvolvedores não registrados só instalam por `adb` ou por um fluxo avançado de instalação. Apps na Google Play em geral já são tratados automaticamente, mas confira o status no Play Console. Há também a conta de distribuição limitada (até 20 aparelhos, sem taxa) para estudantes e hobistas. Fonte: https://android-developers.googleblog.com/2026/06/android-developer-verification.html

## O que ainda falta

- Gerar e testar o APK no seu computador (seção 3).
- Confirmar a instalação da PWA em um Android de verdade (seção 1).
- Trocar o `appId`, criar a conta na Play e cumprir o teste fechado (seção 5).
