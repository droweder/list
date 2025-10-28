# Configuração do Login com Google (OAuth) via Supabase

Este guia descreve os passos necessários para configurar e habilitar o login com uma conta Google na aplicação, utilizando o Supabase como provedor de autenticação.

## Visão Geral

Para que o login com Google funcione, é preciso registrar a aplicação no Google Cloud Console, obter as credenciais (Client ID e Client Secret) e configurá-las no painel do Supabase. Este processo garante que o Google confie na sua aplicação para autenticar usuários.

## Guia Passo a Passo

Você precisará alternar entre duas janelas: o painel do **Supabase** e o painel do **Google Cloud**.

### Parte 1: Iniciar no Supabase

1.  **Abra seu projeto no Supabase:** Acesse [supabase.com](https://supabase.com/).
2.  **Navegue até os Provedores de Autenticação:**
    *   No menu da esquerda, vá para **Authentication** (ícone de chave).
    *   Clique em **Providers**.
3.  **Habilite o Google:**
    *   Encontre **Google** na lista de provedores e ative-o.
    *   Você verá dois campos vazios: **Client ID** e **Client Secret**.
    *   Copie a **URL de Callback** fornecida. Ela será algo como:
        `https://<seu-id-de-projeto>.supabase.co/auth/v1/callback`
    *   Mantenha esta página aberta.

### Parte 2: Configurar no Google Cloud Console

1.  **Abra o Google Cloud Console:** Acesse [console.cloud.google.com](https://console.cloud.google.com/).
2.  **Selecione ou Crie um Projeto:** No topo da página, selecione o projeto que deseja usar ou crie um novo.
3.  **Vá para a seção de Credenciais:**
    *   No menu de navegação (ícone de três linhas no canto superior esquerdo), vá para **APIs & Services > Credentials**.
4.  **Crie as Credenciais OAuth:**
    *   Na parte superior da página, clique em **+ CREATE CREDENTIALS** e escolha **OAuth client ID**.
    *   **Nota:** Se for a primeira vez, talvez seja necessário configurar a "tela de consentimento" (OAuth consent screen). Preencha o nome do aplicativo e seu e-mail, e salve. Para projetos em teste, isso é suficiente.
5.  **Configure o Client ID:**
    *   Como tipo de aplicação, selecione **Web application**.
    *   Dê um nome para a credencial (ex: "Meu Mercadin Login").
    *   Na seção **Authorized redirect URIs**, clique em **+ ADD URI**.
    *   **Cole a URL de Callback** que você copiou do Supabase.
6.  **Crie e Copie as Credenciais:**
    *   Clique em **Create**.
    *   Uma janela aparecerá mostrando seu **Client ID** e seu **Client Secret**.

### Parte 3: Finalizar no Supabase

1.  **Volte para o painel do Supabase.**
2.  **Cole as credenciais do Google Cloud:**
    *   Copie o **Client ID** do Google Cloud e cole no campo **Client ID** no Supabase.
    *   Copie o **Client Secret** do Google Cloud e cole no campo **Client Secret** no Supabase.
3.  **Salve as configurações** no painel do Supabase.

Após salvar, a configuração estará completa. A autenticação com o Google na sua aplicação deve começar a funcionar imediatamente.
