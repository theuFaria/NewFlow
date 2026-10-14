# New Flow Moda Fitness

Site da [New Flow Moda Fitness](https://www.instagram.com/newflowmodafitness/), criado como um projeto voluntário para ajudar a divulgar a loja e suas peças. Esta é a primeira etapa do projeto: uma página de apresentação com fotos, destaques e caminhos para entrar em contato. A intenção é evoluí-lo para um e-commerce, mas **ainda não há vendas pelo site**.

## O que existe hoje

- Home responsiva com apresentação da marca, peças em destaque e galeria de looks.
- Links para o Instagram; os contatos das peças também usam o Instagram enquanto não houver um WhatsApp confirmado.
- Navegação por seções, textos alternativos nas imagens e suporte à preferência por movimento reduzido.
- Rodapé compartilhado entre as páginas.

Não há catálogo completo, conta de cliente, carrinho, checkout ou pagamento nesta versão.

## Tecnologias

- Next.js (App Router), React e TypeScript.
- CSS próprio e fonte Poppins armazenada no projeto.
- Otimização das fotos exibidas com `next/image`.

## Executar localmente

Tenha Node.js e npm instalados. Na pasta do projeto, execute:

```bash
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para conferir o código e gerar uma versão de produção:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

A home está disponível em `/` e `/home`; ambas usam a mesma implementação.

## Organização do projeto

```text
app/
  layout.tsx         Layout compartilhado e metadados
  globals.css        Estilos globais, navegação e rodapé
  home/
    page.tsx         Seções da home
    home.css         Estilos da home
    content.ts       Fotos e dados editáveis da loja
  fonts/             Arquivos locais da fonte Poppins
components/          Navbar e Footer
lib/site.ts          Link do Instagram usado no site
public/images/       Fotos dos looks exibidos na home
```

## Uso do conteúdo
As fotos de looks foram obtidas do perfil público da marca. O repositório ainda não possui uma licença de código definida; a presença do código no GitHub não concede, por si só, permissão para reutilizá-lo.
