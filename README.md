# Painel TAF ACADEPOL + COP

**Site publicado:** https://josuecarpino.github.io/TAF-ACADEPOL/

O workflow de GitHub Pages concluiu o deploy com sucesso em 25/10/2026. O arquivo `firebase-config.js` **ainda está com `COLE_AQUI`**, portanto login e sincronização na nuvem estão pendentes. Sem Firebase, os treinos são salvos localmente no navegador.

## Configurar o banco privado

Siga o guia específico, com todos os links, etapas, regras e testes:

**[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

O Firebase pode ser configurado pelo [console oficial](https://console.firebase.google.com/) mesmo que a integração Firebase no ChatGPT tenha apresentado erro. Crie o projeto Spark, ative o provedor Google no Authentication, crie o Firestore em modo de produção, publique `firestore.rules` e inclua a configuração Web em `firebase-config.js`.

## Código e segurança

- `index.html`: painel visual e rotinas de registro.
- `cloud.js`: integração com Firebase Authentication e Firestore.
- `firebase-config.js`: configuração pública do SDK Web, ainda pendente.
- `firestore.rules`: acesso permitido apenas ao UID autenticado, na pasta de dados dele.
- `.github/workflows/pages.yml`: publica somente os arquivos web, excluindo os dados pessoais.
- **Nunca** envie CSV de histórico, credenciais privadas ou arquivos de conta de serviço para este repositório público.

## Links

- [Site](https://josuecarpino.github.io/TAF-ACADEPOL/)
- [Status das publicações](https://github.com/JosueCarpino/TAF-ACADEPOL/actions/workflows/pages.yml)
- [Configuração do Firebase](./FIREBASE_SETUP.md)
