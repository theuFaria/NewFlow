# New Flow Moda Fitness

Projeto voluntário de um site para a [New Flow Moda Fitness](https://www.instagram.com/newflowmodafitness/), desenvolvido para apresentar a loja e seus produtos, com integração em desenvolvimento com o GestãoClick, ERP utilizado pelo cliente.

O projeto ainda está em construção. A apresentação visual, os textos e as imagens são provisórios e não representam uma versão final aprovada pelo cliente. **Nenhuma imagem presente no projeto é considerada material oficial para o site.**

## Funcionalidades atuais

- Home responsiva com apresentação da marca, destaques, galeria de looks e mapa de localização.
- Navegação e rodapé compartilhados entre as páginas.
- Estrutura inicial da página de catálogo, ainda sem listagem de produtos.
- Cliente HTTP para comunicação com a API do GestãoClick.
- Funções para consultar produtos das lojas New Flow e Intimidade.
- Tipos e mapeadores para adaptar os dados do ERP ao site.
- Implementação inicial da unificação de produtos e estoques das duas lojas, ainda em validação.

**Não há vendas, carrinho, checkout ou pagamento pelo site.**

## Tecnologias

- Next.js com App Router, React e TypeScript.
- CSS e Tailwind CSS.
- Fonte Poppins carregada com `next/font/google`.
- Otimização de imagens com `next/image`.
- API do GestãoClick.

## Executar localmente

Com Node.js e npm instalados, execute na pasta do projeto:

```bash
npm ci
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

A home está disponível em `/` e `/home`. A estrutura do catálogo está em `/catalogo`.

Para utilizar as consultas ao ERP, crie um arquivo `.env.local` na raiz do projeto e configure:

```dotenv
apiUrl=https://api.gestaoclick.com
apiAcessToken=
apiSecretToken=
newflow_id=
intimidade_id=
```

Preencha os campos com os dados autorizados pelo cliente. Não publique as credenciais no repositório.

## Credenciais e conteúdo

As credenciais são carregadas por variáveis de ambiente. O arquivo `.env.local` e os scripts locais chamados `teste.ts` não são incluídos no GitHub.

O repositório não possui uma licença de código definida. Sua disponibilidade no GitHub não concede, por si só, permissão para reutilizar o código ou os materiais visuais.
