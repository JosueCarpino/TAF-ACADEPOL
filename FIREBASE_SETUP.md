# Configurar Firebase: painel TAF ACADEPOL

**Estado verificado em 25/10/2026:** GitHub Pages publicado com sucesso em https://josuecarpino.github.io/TAF-ACADEPOL/ . A configuração Web do projeto Firebase `taf-acadepol` **já foi aplicada** ao arquivo `firebase-config.js` e publicada com sucesso. Ainda **não foi possível verificar** se Authentication (Google), Firestore (default) e as regras de acesso estão ativados. Enquanto não houver confirmação de login e de gravação/leitura, não presuma que os registros estejam sincronizados.

## 1. Projeto e aplicativo Web — concluídos

O projeto Firebase `taf-acadepol` e o aplicativo Web foram criados pelo proprietário, que forneceu a configuração Web. A configuração foi adicionada ao site do GitHub Pages; **não execute npm install, firebase init, firebase deploy nem ative Firebase Hosting** para esse painel.

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
5. Depois de criar, abra a aba **Rules**, cole o conteúdo **integral e atualizado** de `firestore.rules` deste repositório e clique em **Publish**. A coleção financeira `users/{uid}/finance/{id}` foi adicionada; o bloco abaixo contém a versão integral atual (confirme sempre o conteúdo do arquivo no GitHub antes de publicar):

```rules
rules_version = '2';
service cloud.firestore {
 match /databases/{database}/documents {
  match /users/{uid}/logs/{id} { allow read, write: if request.auth != null && request.auth.uid == uid; }
  match /users/{uid}/settings/{id} { allow read, write: if request.auth != null && request.auth.uid == uid; }
  // Dados financeiros isolados de cada usuario autenticado.
  match /users/{uid}/finance/{id} {
   allow read: if request.auth != null && request.auth.uid == uid;
   allow create, update: if request.auth != null && request.auth.uid == uid
    && request.resource.data.keys().hasOnly(['schemaVersion', 'payload', 'updatedAt'])
    && request.resource.data.schemaVersion == 2
    && request.resource.data.payload is map;
   allow delete: if request.auth != null && request.auth.uid == uid;
  }
 }
}
```

Essas regras permitem cada pessoa autenticada acessar apenas seus próprios documentos, incluindo a coleção financeira. Qualquer outro caminho fica sem permissão. **Publique a versão integral de `firestore.rules` no Firebase Console; commits do GitHub não fazem essa etapa automaticamente.** Ao publicar, teste as regras no simulador do próprio Firebase.

## 4. Conexão Web — já configurada

O arquivo `firebase-config.js` foi atualizado e publicado. **Não é necessário reenviar as chaves de configuração**. A sincronização só funcionará depois que Google Authentication estiver ativo e o banco Firestore existir com as regras publicadas.

## 5. Primeira sincronização e teste entre dispositivos

1. Abra https://josuecarpino.github.io/TAF-ACADEPOL/ e navegue até a aba **Registros**.
2. Clique **Entrar com Google**, usando a mesma conta Google escolhida para seu histórico.
3. Importe o CSV privado com os testes de outubro caso ainda não tenha esses registros no navegador atual.
4. Clique **Enviar dados locais para nuvem**. Verifique confirmação de sucesso; **não presuma envio apenas por aparecer no histórico local**.
5. Em outro dispositivo, abra o mesmo site, entre com a mesma conta e clique **Buscar dados da nuvem**.
6. Confira os valores e faça **Exportar CSV** para ter backup offline periódico.

Se aparecer `permission-denied`, reveja as regras e a conta Google. Se aparecer `auth/unauthorized-domain`, confira o domínio autorizado. Se o site indicar modo local sem Firebase, atualize o navegador sem cache e confirme a publicação no GitHub Actions.

## Segurança

- **Não inclua** históricos pessoais, peso, lesões, CSVs, credenciais ou contas de serviço no repositório público.
- O JavaScript da configuração Web é público por natureza. A segurança de seus dados depende de **Authentication + Firestore Rules**.
- O GitHub Pages **não é um banco de dados**. Não exclua o histórico local até confirmar uma sincronização e exportar um backup.
- Se o plugin Firebase não conectar ao ChatGPT, o console do Firebase é suficiente para criar e configurar o projeto manualmente.

Documentação oficial:
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/web/setup
