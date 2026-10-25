# Financeiro PCESP — painel de simulacao pessoal

**Site (GitHub Pages):** https://josuecarpino.github.io/TAF-ACADEPOL/financeiro/

O projeto fica na pasta `financeiro/` do repositório público do TAF. Apenas código e valores fictícios fazem parte do repositório; **não envie extratos, planilhas pessoais, exportações JSON, senhas ou credenciais para o GitHub**.

## Situação da instalação (25/10/2026)

- Arquivos do simulador e fluxo de deploy enviados ao GitHub, com GitHub Actions Pages concluído com sucesso.
- Funcionamento público do URL em navegador e login Google **ainda não foram verificados ponta a ponta**.
- O arquivo `/firestore.rules` foi atualizado para a coleção financeira, mas **editar o GitHub não publica as regras no Firebase**. Confirme e publique a versão atual das regras no Console.
- O aplicativo continua utilizável em **modo local**, independente do Firebase. Os valores precisam ser preenchidos pelo usuário.

## Ativar sincronização privada

O Firebase Web do TAF já é referenciado por `../firebase-config.js`; reutilize o mesmo projeto **taf-acadepol**, sem criar outro banco ou hospedar em Firebase Hosting.

1. Entre em [Firebase Console — projeto taf-acadepol](https://console.firebase.google.com/project/taf-acadepol/overview).
2. Em **Authentication → Sign-in method**, ative **Google** e salve. Em **Settings → Authorized domains**, confira `josuecarpino.github.io` (sem https nem caminho).
3. Em **Firestore Database**, confirme que existe o banco **(default)**. Se não existir, crie em modo de produção. Não use regras abertas `allow read, write: if true`.
4. Abra [Firestore → Rules](https://console.firebase.google.com/project/taf-acadepol/firestore/rules). Copie **todo** o conteúdo de [firestore.rules na raiz](../firestore.rules), que contém as regras originais do TAF e a regra específica `users/{uid}/finance/{id}`, e clique em **Publish**. **Não substitua pelas regras antigas de dois blocos, pois elas impediriam o uso da coleção financeira.**
5. Abra o [simulador](https://josuecarpino.github.io/TAF-ACADEPOL/financeiro/), preencha os valores, clique **Backup JSON** e guarde o backup fora do GitHub.
6. Em **Sincronização privada**, clique **Entrar com Google** e depois **Enviar à nuvem** para o primeiro envio. Espere aparecer mensagem de sucesso.
7. Para verificar: abra em outro navegador/dispositivo, entre com a mesma conta Google, clique **Carregar da nuvem**, confirme a substituição e compare os valores.

**Importante:** o primeiro login **não faz envio nem download automático** para evitar sobrescrever dados. Depois do primeiro envio/carregamento confirmado, o painel passa a enviar automaticamente alterações locais. Antes de alternar entre dois dispositivos, confira a sincronização do primeiro. Não existe resolução automática de conflitos: a última gravação pode prevalecer.

## Como funciona

- **Manter dívidas:** considera as parcelas das três dívidas atuais. Não presume quitação imediata ou prazo conhecido.
- **Consolidar caras:** quita Nubank e Bradesco novo no primeiro mês, usa crédito do BB e **continua pagando o Bradesco antigo**.
- **Consolidar tudo:** quita as três dívidas no primeiro mês e paga o novo consignado nos meses definidos.
- Em consolidações, se o BB não cobrir as quitações, a diferença sai do caixa. Se exceder, o restante entra no caixa, mas o total financiado continua gerando prestações.
- A primeira parcela do BB tem carência de um ou dois meses, conforme selecionado. O valor Price usa taxa mensal e prazo indicados.
- `Gastos no primeiro mês` **substitui** gastos fixos apenas naquele mês.
- Recebimentos-base: FGTS em outubro de 2026, competências da ACADEPOL em novembro de 2026, salário acadêmico até março/2027 e posterior desde abril/2027. O 13º/extra é **manual**. Ajustes extraordinários são feitos em lançamentos.
- O painel não calcula a evolução real do saldo devedor dos contratos antigos sem prazo e taxa remanescentes, tampouco CET, tarifas, impostos ou reajustes desconhecidos. **Saldo de caixa não equivale a patrimônio.**

## Backups e segurança

- O **modo local** salva automaticamente em `localStorage` deste domínio/navegador. Navegação anônima, limpeza de dados ou uso de outro aparelho pode apagar ou ocultar o conteúdo local.
- **Backup JSON** inclui premissas e lançamentos; guarde em pasta privada, não em GitHub público.
- **Importar JSON** substitui completamente o plano local após confirmação.
- **Fluxo CSV** exporta as projeções do cenário em tela.
- O Firestore salva **um documento por usuário Google** em `users/{uid}/finance/plan`, com regras exigindo autenticação e UID correspondente. O JavaScript do aplicativo é público, mas as finanças não são publicadas pelo GitHub.
- O armazenamento Firebase gratuito é sujeito aos limites do plano Spark e regras do serviço.

## Testes e deploy

Sem `npm install`:

```bash
node --check financeiro/app.js
node --check financeiro/cloud.js
node financeiro/verify.cjs
```

A automação `.github/workflows/pages.yml` publica a pasta `financeiro/` no GitHub Pages junto ao TAF. **A automação não envia regras ao Firestore**.

Se o Google não entrar: confira provider e authorized domains. Se aparecer `permission-denied`: publique `firestore.rules` atualizado e confira a conta Google. Se o site não atualizar: verifique [GitHub Actions](https://github.com/JosueCarpino/TAF-ACADEPOL/actions/workflows/pages.yml) e faça recarga forçada do navegador.
