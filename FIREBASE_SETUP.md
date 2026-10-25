# Configurar Firebase: painel TAF ACADEPOL

**Estado verificado em 25/10/2026:** GitHub Pages publicado com sucesso em https://josuecarpino.github.io/TAF-ACADEPOL/ . O banco **ainda não foi ativado**: os campos de `firebase-config.js` continuam `COLE_AQUI`. O aplicativo continua utilizável no modo local.

## 1. Criar projeto (somente pelo proprietário da conta Google)

1. Acesse https://console.firebase.google.com/ e entre na sua conta Google.
2. Clique em **Criar projeto**. Sugestão de nome: **TAF ACADEPOL**.
3. Mantenha o plano **Spark (gratuito)**. Analytics é opcional para este aplicativo.
4. Após criar, no painel do projeto, clique no ícone Web **</>** para adicionar um app. Nome sugerido: **taf-acadepol-web**. **Não marque Firebase Hosting** (a hospedagem já é GitHub Pages).
5. Copie a configuração do SDK Web, com `apiKey`, `authDomain`, `projectId` e `appId`. Essa configuração pública de cliente **não é uma senha**; porém, **não compartilhe chaves de conta de serviço, arquivos JSON privados nem tokens**.

## 2. Ativar login com Google

1. No console: **Build → Authentication → Get started → Sign-in method → Google**.
2. Ative Google, escolha o e-mail de suporte solicitado e salve.
3. Na seção **Settings → Authorized domains**, adicione **josuecarpino.github.io** (sem protocolo, barra ou /TAF-ACADEPOL).
4. O painel usa `signInWithPopup`. Em dispositivos com bloqueio de pop-ups, permita a janela de login.

## 3. Criar o banco Cloud Firestore

1. No console: **Build → Firestore Database → Create database**.
2. Se houver escolha de edição, escolha **Standard**. Use o banco **(default)**.
3. Escolha região próxima e compatível com o plano e as suas preferências; a localização é difícil de alterar depois.
4. Selecione **Start in production mode** (regras iniciais restritivas). Nunca use o modo de teste aberto para dados privados.
5. Depois de criar, abra a aba **Rules**, cole o conteúdo de `firestore.rules` deste repositório e clique em **Publish**:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/logs/{id} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid}/settings/{id} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Essas regras permitem cada pessoa autenticada acessar apenas seus próprios documentos. Qualquer outro caminho fica sem permissão. Ao publicar, teste as regras no simulador do próprio Firebase.

## 4. Ligar Firebase ao aplicativo GitHub

O projeto deve fornecer a configuração Web no formato abaixo (exemplo, não valores reais):

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "meu-projeto.firebaseapp.com",
  projectId: "meu-projeto",
  storageBucket: "meu-projeto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Transcreva os quatro campos necessários para `firebase-config.js`:

```js
window.TAF_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  appId: "..."
};
```

**Atenção:** após editar e confirmar o commit, o GitHub Actions publicará novamente o app. Verifique o status em https://github.com/JosueCarpino/TAF-ACADEPOL/actions/workflows/pages.yml .

## 5. Primeira sincronização e teste entre dispositivos

1. Abra https://josuecarpino.github.io/TAF-ACADEPOL/ e navegue até a aba **Registros**.
2. Clique **Entrar com Google**, usando a mesma conta Google escolhida para seu histórico.
3. Importe o CSV privado com os testes de outubro caso ainda não tenha esses registros no navegador atual.
4. Clique **Enviar dados locais para nuvem**. Verifique confirmação de sucesso; **não presuma envio apenas por aparecer no histórico local**.
5. Em outro dispositivo, abra o mesmo site, entre com a mesma conta e clique **Buscar dados da nuvem**.
6. Confira os valores e faça **Exportar CSV** para ter backup offline periódico.

Se aparecer `permission-denied`, reveja as regras e a conta Google. Se aparecer `auth/unauthorized-domain`, confira o domínio autorizado. Se o site indicar `COLE_AQUI`, a configuração ainda não foi publicada.

## Segurança

- **Não inclua** históricos pessoais, peso, lesões, CSVs, credenciais ou contas de serviço no repositório público.
- O JavaScript da configuração Web é público por natureza. A segurança de seus dados depende de **Authentication + Firestore Rules**.
- O GitHub Pages **não é um banco de dados**. Não exclua o histórico local até confirmar uma sincronização e exportar um backup.
- Se o plugin Firebase não conectar ao ChatGPT, o console do Firebase é suficiente para criar e configurar o projeto manualmente.

Documentação oficial:
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/web/setup
