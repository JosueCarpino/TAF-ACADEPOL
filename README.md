# Painel TAF ACADEPOL + COP

**Painel (GitHub Pages):** https://josuecarpino.github.io/TAF-ACADEPOL/

## Estado da configuração

- GitHub Pages: site publicado anteriormente; atualização automática após commits na branch `main`.
- Firebase Web SDK: **configuração do projeto `taf-acadepol` adicionada** em `firebase-config.js`.
- Firebase Authentication (Google): **precisa ser ativado ou confirmado no console do Firebase**.
- Cloud Firestore (Standard, banco `(default)`): **precisa ser criado ou confirmado**, e as regras de `firestore.rules` precisam ser **publicadas no console**.
- Sincronização real de dados: **ainda não verificada**; só considere ativa depois de testar login, gravação e leitura em outro dispositivo.

## Finalizar o Firebase — clique a clique

Leia **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**. Use o projeto existente `taf-acadepol`; não crie outro projeto. As tarefas pendentes estão no console:

1. [Ativar Google Authentication](https://console.firebase.google.com/project/taf-acadepol/authentication/providers) e autorizar o domínio `josuecarpino.github.io`.
2. [Criar/abrir banco Firestore](https://console.firebase.google.com/project/taf-acadepol/firestore) (Standard, `(default)`).
3. [Regras do Firestore](https://console.firebase.google.com/project/taf-acadepol/firestore/rules): copiar de `firestore.rules`, **Publish**.
4. Acessar o painel, entrar com Google, importar o CSV privado e selecionar **Enviar dados locais para nuvem**.
5. Em outro dispositivo, entrar com a mesma conta e conferir a leitura. Exportar backup CSV.

## Sobre npm / Firebase CLI

O painel é HTML/JavaScript puro em GitHub Pages, e `cloud.js` já importa o SDK via CDN. **Não há necessidade de `npm install`, `firebase init` ou `firebase deploy`**, nem de Firebase Hosting.

## Segurança

Este repositório público contém apenas o código. A configuração Web do Firebase é pública por natureza, mas **não concede autorização de leitura** aos dados: acesso é controlado por Authentication e Security Rules. Não compartilhe nem publique CSV com dados pessoais, senhas, tokens ou credenciais de conta de serviço. Enquanto não confirmar a sincronização, mantenha os backups CSV e os dados locais.

[Status do deploy](https://github.com/JosueCarpino/TAF-ACADEPOL/actions/workflows/pages.yml).
