# Painel TAF ACADEPOL + COP

Repositório público de código. **Não publique dados de treinos, saúde ou CSVs neste repositório.**

## Estado atual

O GitHub Actions de publicação já existe em `.github/workflows/pages.yml`, mas o primeiro deploy não avançou porque o GitHub Pages ainda não havia sido habilitado. A configuração do Firebase também está pendente.

## Publicar site no GitHub Pages (uma vez)

1. Abra https://github.com/JosueCarpino/TAF-ACADEPOL/settings/pages
2. Em **Build and deployment → Source**, escolha **GitHub Actions** (não 'Deploy from a branch').
3. Salve a alteração, se solicitado.
4. Abra https://github.com/JosueCarpino/TAF-ACADEPOL/actions/workflows/pages.yml
5. Clique em **Run workflow**, selecione **main** e confirme. O workflow também será executado automaticamente em futuras atualizações dos arquivos publicados.
6. Quando aparecer **success**, acesse https://josuecarpino.github.io/TAF-ACADEPOL/

A etapa de habilitação do Pages requer acesso às configurações do repositório. O token padrão de GitHub Actions não pode habilitar Pages sozinho.

## Sincronização na nuvem: Firebase (opcional, ainda não ativado)

O plugin do Firebase no ChatGPT não é necessário; use o console oficial. Enquanto estiver desativado, o painel salva apenas no navegador do dispositivo. Exportações CSV continuam importantes.

1. Em https://console.firebase.google.com, crie um projeto Spark gratuito e adicione um aplicativo Web.
2. Em **Authentication → Sign-in method**, ative Google; inclua `josuecarpino.github.io` em **Authorized domains**.
3. Crie o Cloud Firestore, publique as regras contidas em `firestore.rules` (sem alterá-las para acesso público).
4. Copie somente os parâmetros da **configuração Web** do projeto para `firebase-config.js` (não use chave de conta de serviço, token privado ou senha).
5. No painel, entre com Google, importe o CSV privado e escolha **Enviar dados locais para nuvem**. Confira os registros em um segundo dispositivo antes de considerar a migração concluída.

O arquivo de CSV particular e o histórico pessoal não estão no repositório. Recomendado manter backups CSV periódicos.
