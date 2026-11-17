# Mix Alimentos

Site comercial de sete páginas para https://mixalimentos.com.

## Gerar e visualizar

Requer Node.js 24 ou superior. O build usa somente módulos nativos do Node.

```sh
npm run build
npm start
```

Abra http://127.0.0.1:4173. A saída de publicação fica em `public_html/`.

## Testar

```sh
npm install
npx playwright install chromium
npm test
```

Na estação original, as ferramentas também podem ser resolvidas pelo kit local da agência, sem incluí-lo no repositório. Os resultados são gerados em `validation/` e ficam fora do Git. O teste verifica páginas, navegação, responsividade, acessibilidade automatizada e composição das mensagens, sem enviar mensagens reais.

## Publicar na Hostinger

Envie somente o **conteúdo de `public_html/`** para a pasta pública do domínio, incluindo `.htaccess`. Não envie a raiz completa do repositório: ela contém os fontes, scripts e documentação de manutenção.

O domínio oficial é https://mixalimentos.com, sem www. O build gera sitemap, canonical, metadados e dados estruturados. A hospedagem precisa ter DNS e SSL configurados. Depois de publicar, confira as quatro páginas, redirecionamentos, 404 e contatos de WhatsApp. Verifique a propriedade no Search Console e envie `/sitemap.xml`.

## Manutenção

- `site.config.mjs`: domínio, contato e informações da empresa.
- `build.mjs` e `quote.mjs`: páginas e formulário de cotação.
- `assets/site.css` e `assets/site.js`: estilos e interações.
- `hosting.mjs`: regras da hospedagem.
- `optimize.mjs`: compactação do pacote público.
- `public_html/`: arquivos finais para publicação.
- `LEIA-ME.md`: decisões e instruções detalhadas.

Edite os fontes e refaça o build. Preserve a pasta `public_html/` atualizada no Git.

Os materiais de referência, imagens originais, arquivos internos da agência, capturas de testes e ZIPs não fazem parte do repositório. As imagens WebP necessárias ao build estão incluídas. `prepare-assets.cjs` só é necessário para refazer essas imagens a partir dos originais, que ficam fora do repositório.

## Descoberta e desempenho

O build inclui páginas Sobre, Contato e Privacidade, sitemap com datas de alteração, dados estruturados baseados no conteúdo visível, llms.txt e um index.md por página. As datas em site.config.mjs devem mudar apenas quando o conteúdo mudar. Não são datas de compilação.

O servidor Node negocia text/markdown pelo cabeçalho Accept, informa as alternativas no cabeçalho Link e usa Vary para separar formatos no cache. Entrega Brotli ou gzip para textos, cache de sete dias para recursos estáticos, ETags e respostas 304. As páginas HTML exigem revalidação. Não é necessário instalar bibliotecas em produção.

Na hospedagem estática Apache/LiteSpeed, o .htaccess também entrega a alternativa index.md existente para solicitações explícitas de Markdown, respeitando q=0. Requer mod_rewrite e permissão AllowOverride para estas regras. O cabeçalho Vary: Accept separa os formatos no cache. O servidor Node implementa a negociação completa por preferência. Se a plataforma servir os arquivos por um proxy que ignora .htaccess, é necessário configurar a negociação nesse proxy ou usar npm start com server.mjs.

Apenas Barra Mansa, RJ, Brasil está confirmada como localidade. Rua, número, CEP, CNPJ e perfis oficiais continuam pendentes. Configure sameAs apenas com os perfis reais da Mix. Não há servidor MCP nem ferramentas WebMCP, pois o site não possui backend de pedidos. O orçamento depende de revisão e envio pelo visitante no WhatsApp.
