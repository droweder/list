# Guia de Implantação na Netlify

Este guia explica como configurar as variáveis de ambiente na Netlify para garantir que a aplicação possa se conectar ao Supabase quando for implantada.

## Contexto

A aplicação utiliza variáveis de ambiente para armazenar as credenciais do Supabase (URL e chave anônima). Essas variáveis são definidas em um arquivo `.env` para o desenvolvimento local. No entanto, em um ambiente de produção como a Netlify, essas variáveis precisam ser configuradas diretamente na plataforma.

Se as variáveis não forem configuradas na Netlify, a aplicação não conseguirá se conectar ao Supabase e resultará em uma **tela em branco** com o erro `Uncaught Error: Supabase URL and anon key are required` no console do navegador.

## Passos para Configuração

Siga estes passos para adicionar as variáveis de ambiente ao seu site na Netlify:

1.  **Acesse o painel da Netlify:**
    *   Vá para [app.netlify.com](https://app.netlify.com/) e faça login.

2.  **Selecione o seu site:**
    *   Na lista de sites, clique no projeto correspondente (ex: `mercadin`).

3.  **Vá para as Configurações do Site:**
    *   No menu principal do site, clique em **Site configuration**.

4.  **Encontre a Seção de Variáveis de Ambiente:**
    *   No menu de configurações (à esquerda), navegue até **Environment variables**.

5.  **Adicione as Variáveis:**
    *   Você precisará adicionar duas variáveis. Clique em **Add a variable**.
    *   **Primeira variável (Supabase URL):**
        *   **Key:** `VITE_SUPABASE_URL`
        *   **Value:** Cole a URL do seu projeto Supabase aqui (ex: `https://<seu-id-de-projeto>.supabase.co`).
    *   **Segunda variável (Supabase Anon Key):**
        *   **Key:** `VITE_SUPABASE_ANON_KEY`
        *   **Value:** Cole a sua chave anônima (`anon key`) do Supabase aqui.

6.  **Acione um Novo Deploy:**
    *   Após salvar as variáveis, a Netlify geralmente inicia um novo build automaticamente. Caso contrário, vá para a aba **Deploys**.
    *   Clique no botão **Trigger deploy** e selecione **Deploy site**.

Após a conclusão da nova implantação, as variáveis de ambiente estarão disponíveis para a aplicação, e ela deverá funcionar corretamente.
