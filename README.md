# Painel TAF ACADEPOL + COP

O site é público, mas **nenhum histórico pessoal deve estar no repositório**. Até configurar o Firebase, os registros ficam no navegador. Exporte backups CSV.

## Ativar GitHub Pages
Settings → Pages → Deploy from a branch → main → /(root) → Save.

## Configurar Firebase
1. Crie projeto gratuito Spark em https://console.firebase.google.com e adicione um aplicativo Web.
2. Copie os campos da configuração Web para `firebase-config.js` (nunca use conta de serviço ou chave privada).
3. Ative Firebase Authentication → Google e autorize o domínio `josuecarpino.github.io`.
4. Crie o Firestore e **publique** as regras incluídas em `firestore.rules` antes de inserir dados.
5. Entre com Google na aba Registros. Importe o arquivo CSV pessoal separadamente e selecione Enviar dados locais para nuvem.

A publicação do repositório no Pages e a configuração do projeto Firebase dependem de acesso às configurações dessas plataformas. Não publique registros pessoais no GitHub.
