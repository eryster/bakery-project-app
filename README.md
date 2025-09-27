
## **🍞 Projeto Padaria: Guia de Início Rápido**

*Este **guia** cobre os passos necessários para **configurar o ambiente de desenvolvimento e o banco de dados** **Firebase** para este projeto em **React Native/Expo**.*

## ⚙️ Configuração Local (Clonagem e Instalação)

*Siga os passos abaixo no seu terminal para baixar o código e instalar as dependências do projeto (**React Native, Expo, Firebase, etc.**).*

 1. Clonar o Repositório
> `git clone https://github.com/ErickDevPy/project-bakery-app.git`

2. Acessar a Pasta do Projeto
> `cd project-bakery-app`

3. Instalar as Dependências
> `npm install`

## 🔧 Configuração do Firebase (Backend)

*Para o correto **funcionamento do aplicativo**, você precisa criar o projeto no **Firebase**, **configurar o banco de dados Firestore** e **definir as regras de segurança.***

### 1. Criar o Projeto e o Firestore

-   Acesse o Firebase Console.
    
-   Crie um novo projeto.
    
-   No menu lateral, vá até **Firestore Database** e clique em **Criar banco de dados**.
    
-   Escolha o **modo de produção** para garantir a segurança dos dados.

### 2. Adicionar Regras de Segurança**

 - Para garantir que **apenas usuários autenticados** tenham acesso ao banco de dados, **substitua as regras** padrão no Firestore pelas regras abaixo:

>     rules_version = '2';
>     service cloud.firestore {
>       match /databases/{database}/documents {
>         // Permite leitura e escrita apenas se houver um usuário autenticado.
>         match /{document=**} {
>           allow read, write: if request.auth != null;
>         }
>       }
>     }

- Após realizar a substituição clique em **Publicar**.

### 3. Habilitar o Login Anônimo

 - No Firebase Console, vá até **Autenticação**.
   
 - Na aba **Método de login**, ative a opção **Login Anônimo**.

 - Clique em **Salvar**.

## 🔗 Conexão com o Aplicativo

*Agora, é necessário conectar o aplicativo ao Firebase utilizando as chaves de configuração.*

###  1. Obter as Chaves do Firebase

 - No Firebase Console, acesse **Configurações do Projeto** (ícone de
   engrenagem ao lado de **Visão geral do projeto**).
   
 - Role para baixo e clique em **Adicionar aplicativo Web** (`</>`).
 
 - Copie as chaves exibidas (como `apiKey`, `projectId`, etc.).

### 2. Editar o Arquivo .env

 - Vá para um arquivo chamado **.env** na raiz do projeto.
 
 - **Preencha o arquivo com as chaves que você copiou**, usando o prefixo EXPO_PUBLIC_:

>     EXPO_PUBLIC_API_KEY="SUA_CHAVE_API_AQUI"
>     EXPO_PUBLIC_AUTH_DOMAIN="SEU_DOMINIO.firebaseapp.com"
>     EXPO_PUBLIC_PROJECT_ID="seu-id-do-projeto"
>     EXPO_PUBLIC_STORAGE_BUCKET="seu-projeto.appspot.com"
>     EXPO_PUBLIC_MESSAGING_SENDER_ID="SEU_SENDER_ID"
>     EXPO_PUBLIC_APP_ID="SEU_APP_ID"`


⚠️ **Atenção:** Certifique-se de que os valores estão entre **aspas**.

## ▶️ Rodar o Aplicativo

*Para iniciar o aplicativo você deve executar o comando a seguir no console:*

> `npm start`

*Use o **Expo Go** no seu celular para escanear o QR code exibido no terminal. Seu aplicativo agora estará conectado ao Firebase e pronto para ser usado.*

## 📌 Detalhes

*Este projeto foi desenvolvido como atividade de extensão do meu curso de **Análise e Desenvolvimento de Sistemas**, feito inteiramente por mim, com o objetivo de ajudar uma padaria local com controle de estoque e vendas.*

## 📄 Licença

*Este projeto está licenciado sob a Licença MIT.  
Consulte o arquivo [LICENSE](./LICENSE) para mais informações*