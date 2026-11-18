# Site Mix Alimentos

## Visualização

Abra `index.html` no navegador. Os links entre as quatro páginas também funcionam abrindo arquivos diretamente. Outra opção é executar `npm start` nesta pasta e abrir `http://127.0.0.1:4173`.

## Conteúdo e direção aprovados

- Marfim na abertura, texto e botões em verde, composição dos três produtos e sombra suave. Logo original com redução proporcional e remoção apenas das margens transparentes.
- Quatro páginas comerciais: principal, ovos de galinha, ovos de codorna em conserva e batata palha.
- Ovos de galinha como produto principal, codorna como segunda oferta e batata palha como complemento.
- Sem preços, custos, margens ou volumes comerciais internos publicados.
- Público: negócios que preparam, servem ou revendem alimentos, com destaque aos segmentos atuais de padarias, restaurantes e lanchonetes.
- Barra Mansa, Pinheiral, Volta Redonda, Resende e Angra dos Reis. Não prometemos dias fixos ou entrega garantida.
- WhatsApp oficial: (24) 99961-9682. Links abrem mensagens específicas por página. Nenhuma mensagem é enviada automaticamente.
- As imagens de produto vieram de `Identidade Visual/Produtos`. As embalagens de codorna e batata possuem identificação de imagem ilustrativa. Dados de seus rótulos não foram transcritos como especificações comprovadas.
- Os documentos da Otimizza não foram utilizados como conteúdo da Mix.

## Atualizar

`site.config.mjs` centraliza contato, cidades, experiência, domínio e verificação do Search Console. `build.mjs` contém conteúdo e geração das páginas; `quote.mjs` gera o formulário de cotação. Estilos e interações ficam em `assets/site.css` e `assets/site.js`.

Na cotação, marcar um produto revela sua quantidade: ovos de galinha em caixas, com incrementos de 0,5 e opção de meia caixa (6 cartelas, 180 ovos); codorna em pacotes inteiros; batata palha em unidades ou fardos inteiros. Desmarcar oculta o campo e exclui o item da mensagem, preservando a quantidade caso seja marcado novamente. Quantidades são opcionais, mas valores negativos e frações inválidas não podem ser enviados pelo botão da cotação. O link do WhatsApp contém uma lista dos produtos selecionados com suas quantidades, unidades e cidade. A mensagem só é enviada quando o visitante confirmar no WhatsApp.

Depois de alterar arquivos, execute `npm run build`. A pasta `public_html` é uma cópia pronta para hospedagem, sem os scripts e documentos internos. Não edite somente a cópia, pois o próximo build substituirá suas alterações.

Não há framework, dependência de runtime, banco de dados ou servidor Node necessário na hospedagem. O Node é usado apenas para gerar os arquivos e servir uma prévia opcional.

## Antes de publicar

1. O domínio oficial já está configurado: **https://mixalimentos.com**, sem www.
2. Tempo de atuação atualizado para **Mais de 20 anos**, conforme informado pelo contratante.
3. Execute `npm run build` depois de qualquer alteração. A versão atual já contém canonical, URLs absolutas de compartilhamento, sitemap com quatro URLs e indexação liberada. O .htaccess prepara redirecionamentos de HTTP e www para HTTPS sem www, além de consolidar as URLs index.html. Essas regras precisam ser verificadas no servidor real após o envio.
4. Envie o **conteúdo** de `public_html/` para a `public_html` do domínio Hostinger, incluindo `.htaccess`. Faça backup se já houver um site nesse destino.
5. Confira as quatro rotas em HTTPS, as imagens, o status 404 e os links de WhatsApp no celular.

Nenhuma publicação foi realizada. Não foram inventados CNPJ, endereço residencial, horário de atendimento ou redes sociais. O domínio foi informado pelo contratante. O rodapé das quatro páginas inclui o crédito “Desenvolvido por Otimizza”, com link para https://otimizza.com.br.

O build compacta CSS e JavaScript apenas no pacote público, conserva os fontes legíveis e adiciona uma versão de conteúdo aos links de CSS/JS para evitar cache antigo. A logo pública usa WebP. As fotos têm versões WebP responsivas e a imagem para redes sociais usa JPEG de 1200 × 630 px. O .htaccess configura compactação de texto e cache de arquivos estáticos quando os módulos do servidor estiverem disponíveis. Não há dependências de fontes externas ou frameworks de frontend. O contêiner do Google Tag Manager é carregado de forma assíncrona.

## Após o envio à Hostinger

- Aponte o domínio para o site correto e confirme o certificado SSL ativo.
- Confira https://mixalimentos.com e as três páginas de produto; teste o redirecionamento de HTTP e www.
- Abra https://mixalimentos.com/sitemap.xml e https://mixalimentos.com/robots.txt.
- Verifique a propriedade no Google Search Console e envie o sitemap. Esse passo exige acesso à conta Google ou ao DNS do domínio; nenhum token de verificação foi inventado.
- Vincule o domínio ao Perfil da Empresa no Google e confira o cadastro real da Mix.
- Teste os botões de WhatsApp no celular e o recebimento da mensagem, caso queira fazer um teste comercial real.
- Reavalie performance e indexação na hospedagem real. Os testes locais não verificam DNS, SSL, redirecionamentos Apache nem posições em buscadores.

## Mensuração e privacidade

Esta versão carrega o contêiner GTM-5CPHG7HX. O carregamento de ferramentas como GA4, pixels e cookies depende das tags publicadas nesse contêiner. Não há dependências de fontes externas. A interface não persiste os campos de cotação; eles são usados no navegador para compor a mensagem que o visitante escolhe abrir no WhatsApp.

Os links emitem um evento local `mix:whatsapp_click`, com `page_path`, `product`, `cta_position`, `quote_type` e `selected_city`. O código local não envia esses eventos automaticamente ao dataLayer; o uso em medição depende dos acionadores e tags configurados no GTM. Clique não representa lead recebido ou venda. As ferramentas de medição devem ser configuradas no GTM com os IDs reais; preencher `analyticsId` sozinho não ativa nada.

Os dados estruturados incluem Organization e Product sem ofertas ou avaliações fictícias. BreadcrumbList e WebSite são adicionados com domínio confirmado. LocalBusiness com endereço não foi incluído porque não há endereço público autorizado.

## Verificação

Execute `npm test` para a auditoria automatizada com Playwright e axe disponíveis no kit local do projeto. O teste usa o Chrome instalado. Resultados e capturas de revisão ficam em `validation/`, fora da pasta pública. `prepare-assets.cjs` é opcional, usado para refazer versões WebP a partir das imagens originais.

O ambiente de execução bloqueou conexões de loopback. A validação visual utilizou requisições interceptadas com os bytes exatos do pacote; o handler HTTP foi testado diretamente no processo. Isso não equivale a uma validação do servidor Hostinger ou da rede real. A abertura direta de index.html e a navegação por arquivos foram testadas no navegador.

Não foram executados Lighthouse, testes em aparelhos físicos iOS/Android ou confirmação de recebimento de mensagens. As metas de performance continuam metas; não há pontuação medida nem garantia de Core Web Vitals. As imagens WebP possuem versões de 480 e 900 px, com dimensões explícitas e lazy loading abaixo da abertura.

## Fontes

Briefing completo fornecido pelo contratante, decisões aprovadas nesta conversa e ativos da Mix. Os sites do setor foram consultados como referência funcional, sem copiar imagens, textos ou código. O foco da implementação é catálogo direto, identificação dos segmentos, cobertura regional e WhatsApp.
