# Rastreamento da Mix Alimentos

## Estado da auditoria

- Contêiner encontrado anteriormente no projeto: GTM-5CPHG7HX, uma instalação por página.
- Contêiner confirmado pelo responsável: **GTM-5CPHG7HX**. A sugestão de outro ID foi cancelada; nenhuma migração de contêiner será publicada.
- Destino GA4: **G-0F0M7XHYGC**.
- Antes desta alteração, não havia carregamento independente de gtag.js nem comando gtag('config') no projeto. Os cliques emitiam somente o evento local mix:whatsapp_click.
- A versão publicada do contêiner não pôde ser consultada deste ambiente: o domínio do site e googletagmanager.com não resolveram no acesso HTTP; o acesso de pesquisa também falhou.
- Não há conexão autenticada disponível com a conta GTM ou com a propriedade GA4. Portanto, a presença da tag GA4 no contêiner e sua publicação continuam **não verificadas**. Não crie uma segunda tag sem conferir a existente.
- **Recebimento de eventos no GA4: NÃO VALIDADO.** Build, fila dataLayer e testes locais não comprovam ingestão no Analytics.

## O que o código faz

Mantém uma única instalação do contêiner atual em cada uma das oito páginas e na página 404. A fila é preservada, com carregamento assíncrono conforme o snippet atual documentado pelo Google. Não adiciona uma instalação independente de GA4, uma segunda biblioteca gtag.js, um comando config ou um page_view manual.

O Google tag no GTM será responsável pelo page_view automático. O site não o envia novamente. O código prepara quatro interações mutuamente exclusivas:

| Evento | Ação | Limite da interpretação |
| --- | --- | --- |
| whatsapp_click | Clique válido em contato direto de WhatsApp, incluindo o rodapé, exceto consulta de entrega | Intenção de abrir contato; não prova envio de mensagem |
| quote_request | Clique válido na cotação combinada | Intenção de solicitar cotação; não confirma recebimento, lead ou venda |
| city_whatsapp | Clique em Consultar entrega na minha cidade | Não dispara também whatsapp_click ou quote_request |
| footer_instagram | Clique no Instagram do rodapé | Não mede o link de Instagram do corpo da página Contato |

Um clique na cotação emite apenas quote_request. Formulários inválidos não emitem esse evento. Não se deve configurar outro acionador de clique para contar essas mesmas ações.

## Parâmetros permitidos

- page_path: somente as rotas conhecidas, sem query string ou fragmento; rotas desconhecidas são representadas por /404.html.
- page_location: URL canônica controlada pela geração da página, sem parâmetros de consulta ou fragmento.
- page_referrer: somente a origem do referenciador, sem caminho, query ou fragmento.
- product: IDs públicos dos produtos ou geral.
- cta_position: posição controlada do botão.
- quote_type: direct ou combined.
- selected_city: uma das cinco cidades, outra_cidade ou nao_informada. Não recebe texto livre.

Não são enviados pelo código de eventos: nome, e-mail, telefone, endereço do cliente, mensagem, quantidade, valores preenchidos, URL do WhatsApp, texto do link ou IDs de usuário. As URLs reais de navegação e WhatsApp não são alteradas. Os metadados de análise descartam query/hash, inclusive parâmetros de campanha, para reduzir a possibilidade de inclusão acidental de dados pessoais.

## Configuração no GTM, sem duplicar

1. Abra o contêiner **GTM-5CPHG7HX**. Confira Tags e a última versão publicada. Pesquise G-0F0M7XHYGC. Se já houver uma Tag do Google para esse ID, reutilize-a; não crie outra. Não mantenha tags de configuração GA4 antigas disparando o mesmo destino em paralelo.
2. Se não existir, crie uma **Tag do Google**, ID **G-0F0M7XHYGC**, com acionador **Inicialização: todas as páginas**. Mantenha uma única tag base e um único disparo por carregamento. Não crie uma tag de evento page_view adicional.
3. Crie variáveis de **Camada de dados**, versão 2, para analytics_page_location e analytics_page_referrer. Na Tag do Google, defina page_location e page_referrer usando essas variáveis para evitar o envio das URLs completas.
4. Crie variáveis de Camada de dados, versão 2, para page_path, product, cta_position, quote_type e selected_city.
5. Crie um acionador **Evento personalizado**, nome exato whatsapp_click. Crie uma tag **Google Analytics: evento do GA4**, ID G-0F0M7XHYGC, nome whatsapp_click, usando somente esse acionador. Mapeie os cinco parâmetros do item 4; use analytics_page_location e analytics_page_referrer para os parâmetros page_location e page_referrer.
6. Repita com tags e acionadores distintos para os nomes exatos **quote_request**, **city_whatsapp** e **footer_instagram**. Não dispare whatsapp_click nesse acionador e não adicione acionadores de clique, formulário ou Todas as páginas às tags desses eventos.
7. Não use Click URL, Click Text, variáveis de formulário ou a mensagem de cotação como parâmetros. No GA4, revise a medição otimizada: desative cliques de saída e interações de formulário para este fluxo, evitando coleta automática do link de WhatsApp e uma contagem paralela das mesmas ações. Confira também eventuais regras existentes que criem generate_lead, form_submit ou page_view adicionais para estes cliques.
8. Confira o descarte de e-mails e parâmetros sensíveis no fluxo GA4. Não habilite dados fornecidos pelo usuário ou outras tags adicionais nesta configuração.

## Validação que ainda falta na conta

Use **Visualizar** no GTM e conecte o Tag Assistant ao site já implantado. Confira uma tag base por carregamento e nenhuma segunda instalação. Abra a homepage, uma página de produto e Contato. O page_view não deve ocorrer novamente só por alterar a quantidade da cotação.

Clique uma vez em contato direto: deve aparecer exatamente um whatsapp_click. Clique no telefone do rodapé: deve aparecer whatsapp_click. Clique em consultar entrega: deve aparecer city_whatsapp. Clique no Instagram do rodapé: deve aparecer apenas footer_instagram. Monte uma cotação válida e clique uma vez: deve aparecer exatamente um quote_request. Com quantidade inválida, não deve existir quote_request. Revise os parâmetros de cada evento; nenhum deve conter telefone, mensagem, endereço, quantidade ou query string.

No GA4, selecione o fluxo de ID **G-0F0M7XHYGC**, abra **Administrador > Exibição de dados > DebugView** e confirme a chegada de page_view, whatsapp_click, quote_request, city_whatsapp e footer_instagram no dispositivo de teste. Use o modo de depuração do Tag Assistant somente para a validação, sem fixar debug_mode para todos os visitantes no código de produção.

Somente depois de conferir o destino e ausência de duplicidades, publique a versão do contêiner e valide também o tráfego publicado em Tempo real. Registre a versão GTM, horário/dispositivo, nomes e parâmetros dos eventos recebidos. Até haver essa evidência, a instalação permanece pendente de validação. Não classifique automaticamente os cliques como leads recebidos.

## Fontes oficiais

- Instalação: https://support.google.com/tagmanager/answer/14847097
- Camada de dados: https://developers.google.com/tag-platform/tag-manager/datalayer
- Tag do Google no GTM: https://support.google.com/tagmanager/answer/9442095
- Eventos GA4 no GTM: https://support.google.com/tagmanager/answer/13034206
- DebugView: https://support.google.com/analytics/answer/7201382
- Dados pessoais: https://support.google.com/analytics/answer/6366371
- Medição otimizada: https://support.google.com/analytics/answer/9216061
