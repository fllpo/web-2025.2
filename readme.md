# E-commerce

Este é um projeto desenvolvido em **[AdonisJS](https://adonisjs.com/)** para a disciplina de Programação Web.  
As instruções abaixo permitem que qualquer pessoa rode o projeto localmente.  

---

## Requisitos

Antes de começar, certifique-se de ter instalado no seu computador:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)  
- [AdonisJS CLI](https://docs.adonisjs.com/guides/installation)

---

## Clonando o projeto

```bash
git clone https://github.com/fllpo/web-2025.2.git
cd web-2025.2
```
## Instalando dependências

```bash
npm install
# ou
yarn install
```

## Configuração do ambiente

1. Crie um arquivo .env na raiz (caso ainda não exista).
2. Copie o conteúdo de .env.example (ou modelo) para .env.
3. Ajuste as variáveis conforme o ambiente local, por exemplo:

```bash
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=alguma_chave_secreta

# Exemplo de configurações para Postgres

DB_CONNECTION=pg
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=seu_usuario
PG_PASSWORD=sua_senha
PG_DB_NAME=nome_do_banco
```

### Gere a APP_KEY (se necessário):
```
node ace generate:key
```
## Como rodar o projeto

Para iniciar o servidor com Hot Module Reloading (HMR):

```node ace serve --hmr```

Por padrão, a aplicação estará disponível em:
http://localhost:3333
