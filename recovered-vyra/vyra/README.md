# VYRA 1.1

Seu dinheiro. Sua direção.

Saiba quanto você pode gastar antes do próximo salário.

## O que tem aqui

- `index.html`: o app inteiro (HTML, CSS e JavaScript juntos)
- `manifest.json`, `sw.js`, `icon*.png`, `icon.svg`: PWA instalável que funciona sem internet
- `package.json`, `capacitor.config.json`, `scripts/`, `assets/`, `.github/workflows/apk.yml`: geração do APK Android (`npm run apk`, ou automático no GitHub)
- `GUIA-ANDROID.md`: instalar no Android, testar, gerar o APK e publicar na Google Play

## Rodar no seu computador

Abra o `index.html` no navegador. Para testar a instalação e o modo offline, sirva a pasta:

    python3 -m http.server 8000

e abra http://localhost:8000 (o `localhost` conta como endereço seguro para a PWA).

## Publicar de graça

Netlify Drop: acesse https://app.netlify.com/drop e arraste a pasta `vyra` inteira (a que contém o `index.html`). Você recebe um link https. Crie uma conta grátis para o link não expirar.

Alternativas: GitHub Pages ou Cloudflare Pages.

## Telas

- **Início**: "Quanto posso gastar hoje?" (continua simples).
- **Gastos** e **Contas**: como na V4.
- **Extras**: ganhos extras (venda, freelance, presente). Não se misturam com salário e vale.
- **Mês**: Visão do mês, com totais e gráficos do mês escolhido.
- **Ajustes**: recebimentos normais (**salário** e **vale**), reserva, exemplo e dados.

## Como o cálculo funciona

    recebido    = salário e vale já recebidos + ganhos extras já recebidos
    disponível  = recebido − contas − gastos − reserva
    por dia     = disponível ÷ dias até o próximo salário

- **Salário e vale são renda normal**, não ganho extra. Cada um tem tipo, descrição, valor e data de recebimento.
- **A data manda.** Um recebimento (normal ou extra) só entra em "recebido" a partir do dia da data; antes disso aparece como "a receber". Hoje conta como já recebido.
- **Próximo salário**: é o próximo salário cadastrado com data depois de hoje. Se ainda não houver, o VYRA estima um mês depois do último, só para dividir os dias (aparece "estimado"). Esse dinheiro estimado não entra no cálculo.
- Conta paga ou pendente entra igual no cálculo. O status só organiza a lista. Não registre o pagamento de uma conta como gasto.
- Contas e gastos cadastrados entram todos no cálculo (como na V4), então o saldo funciona como um saldo corrente: o que sobra de um mês passa para o seguinte.
- Se o disponível ficar negativo, o limite diário mostra R$ 0,00 e aparece "Déficit de R$ ...".
- Os valores são guardados em centavos (números inteiros). O limite diário é arredondado para baixo, então nunca passa do que está disponível.
- As datas usam o calendário local, sem conversão para UTC.

## Visão do mês

Para o mês escolhido (setas), mostra: total recebido, total gasto, saldo, total reservado, salário e vale, ganhos extras e o que ainda falta receber.

- **Gastos por dia**: do dia 1 ao último dia do mês (28, 29, 30 ou 31, calculado pelo calendário). Dia sem gasto vale R$ 0. Dois gastos no mesmo dia somam. Só usa o que você cadastrou.
- **Ganhos x gastos**: recebido (salário e vale + extras) contra gasto (contas + gastos do dia a dia) e o saldo.
- Contas entram no mês pela data de vencimento. Saldo do mês = recebido − gasto.

## Dados

Tudo fica no `localStorage` do navegador (chave `vyra:v1`, formato `v: 2`). Nada é enviado a servidor. Não existe conta nem login. Trocar de aparelho ou de navegador começa do zero.

    {
      v: 2, reserve, demo,
      incomes:  [{ id, type: 'salario' | 'vale', desc, amount, date }],
      extras:   [{ id, desc, amount, date }],
      bills:    [{ id, name, amount, due, paid }],
      expenses: [{ id, desc, amount, cat, date }]
    }

Valores em centavos, datas em `AAAA-MM-DD`. Todo registro tem `id` e data.

**Migração da V4**: ao abrir a 1.1 com dados antigos, o salário vira um recebimento já recebido e o "próximo pagamento" vira o próximo salário. O limite diário continua igual ao da V4. Uma cópia dos dados antigos fica em `vyra:v1:backup-v4`.

## Para crescer (cartão, metas, categorias, relatórios, histórico, planos)

O cálculo fica em funções puras no começo do script (`compute`, `monthData`), separadas das telas. Cada lista é uma coleção de registros com `id`, então uma nova (cartões, metas) é só mais uma lista no estado, com `sanitize` e um seletor próprio. O histórico de meses já tem base: `monthData(estado, 'AAAA-MM', hoje)` serve para qualquer mês.

Para conferir no console do navegador: `VYRA.monthData(VYRA.getState(), '2026-11', VYRA.todayISO())`.

## Ao publicar uma versão nova

Troque o número em `const CACHE = 'vyra-v1.1'` no `sw.js` (por exemplo, `vyra-v1.2`) para os aparelhos pegarem a atualização.
