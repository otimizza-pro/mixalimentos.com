# Mix Alimentos

Site comercial de oito páginas para https://mixalimentos.com.

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

O build inclui páginas Sobre, Contato, Privacidade e Termos de uso, sitemap com datas de alteração, dados estruturados baseados no conteúdo visível, llms.txt e um index.md por página. As datas em site.config.mjs devem mudar apenas quando o conteúdo mudar. Não são datas de compilação.

O servidor Node negocia text/markdown pelo cabeçalho Accept, informa as alternativas no cabeçalho Link e usa Vary para separar formatos no cache. Entrega Brotli ou gzip para textos, cache de sete dias para recursos estáticos, ETags e respostas 304. As páginas HTML exigem revalidação. Não é necessário instalar bibliotecas em produção.

Na hospedagem estática Apache/LiteSpeed, o .htaccess também entrega a alternativa index.md existente para solicitações explícitas de Markdown, respeitando q=0. Requer mod_rewrite e permissão AllowOverride para estas regras. O cabeçalho Vary: Accept separa os formatos no cache. O servidor Node implementa a negociação completa por preferência. Se a plataforma servir os arquivos por um proxy que ignora .htaccess, é necessário configurar a negociação nesse proxy ou usar npm start com server.mjs.

Endereço confirmado: Rua Geraldo José de Freitas, 507, Boa Vista I, Barra Mansa, RJ, CEP 27332-180. O CNPJ continua pendente. O Instagram oficial confirmado é @mixalimentos.rj. Configure sameAs apenas com os perfis reais da Mix. O orçamento depende de revisão e envio pelo visitante no WhatsApp.

## Ferramentas para agentes

O JavaScript registra mix_list_products, mix_delivery_area e mix_prepare_quote quando document.modelContext (ou a API anterior navigator.modelContext) está disponível. Sem essa API, o site continua funcionando normalmente, sem instalar polyfills. As ferramentas apenas retornam informações públicas e uma prévia de cotação. Não enviam mensagens, não abrem aplicativos, não gravam dados e não confirmam compras.

O servidor Node oferece POST /mcp com JSON-RPC e Streamable HTTP na versão fixada 2025-11-25. Não oferece SSE ou sessões. O cartão dinâmico está em /.well-known/mcp/server-card.json, /.well-known/mcp.json e /mcp/server-card. O formato de cartão é uma compatibilidade com a proposta antiga SEP-1649, ainda usada pela auditoria. Ele declara apenas as três ferramentas que o endpoint executa. Os cartões não são copiados para public_html: só são servidos pelo processo que também atende /mcp.

Para ativar na Hostinger, a implantação precisa executar o projeto Node, com arquivo de entrada server.mjs e comando npm start, após npm run build. Não basta servir a pasta public_html como arquivos estáticos. A porta é lida de PORT; HOST pode ser configurado se necessário. A publicação estática mantém as páginas e WebMCP, mas não executa o servidor MCP.

Apenas o domínio oficial e os endereços locais de desenvolvimento são aceitos em Origin. Clientes MCP sem Origin podem consultar as informações públicas sem autenticação. Há limite de 64 KB por solicitação e 60 solicitações por minuto por IP. Não envie nome de cliente, endereço, telefone ou outros dados pessoais às ferramentas.

## Inicialização do Node

server.mjs chama listen() diretamente quando carregado pela Hostinger, inclusive se a plataforma o importar por um processo próprio. A porta usa PORT (ou 4173) e a interface usa HOST (ou 0.0.0.0). O tratamento das requisições fica em request-handler.mjs, que os testes podem importar sem abrir uma porta. validate-startup.mjs verifica a inicialização por importação, com porta definida pelo ambiente.

## Google Tag Manager

O contêiner GTM-5CPHG7HX está incluído no head de todas as oito páginas e na página 404. A fila dataLayer e o evento de inicialização gtm.js são preparados antes do carregamento assíncrono do script. A função gtag solicitada também é disponibilizada. As tags e os acionadores do contêiner são administrados no Google Tag Manager; não foi criado um ID de GA4 ou qualquer outra tag independente. A página de privacidade foi atualizada. Os testes interceptam o carregamento externo para não enviar dados de teste ao contêiner.
