// Public information only. Keep these pages and agent resources in the same build.
export function informationPages(config, whatsapp) {
  const cities = config.cities.join(', ');
  return [
    {id:'sobre',name:'Sobre a Mix Alimentos',title:'Sobre a Mix Alimentos | Alimentos entregues no seu comércio',meta:'Há 10 anos, a Mix Alimentos fornece ovos, codorna em conserva e batata palha para comércios de Barra Mansa e outras quatro cidades do Rio de Janeiro.',body:`<span class="section-label">Sobre a Mix Alimentos</span><h1>Há 10 anos ao lado de quem produz e revende alimentos.</h1>
<p>Por trás de uma padaria que começa cedo, de um restaurante que prepara o almoço e de uma lanchonete que recebe pedidos ao longo do dia, existe uma rotina de compras e reposição. Os alimentos precisam estar disponíveis para que cada negócio possa seguir trabalhando.</p>
<p>É nessa rotina que a Mix Alimentos atua. Há ${config.experience}, fornecemos ovos de galinha, ovos de codorna em conserva e batata palha para estabelecimentos que preparam, servem ou revendem alimentos. Nossa base é Barra Mansa, no estado do Rio de Janeiro, e nosso atendimento alcança também Pinheiral, Volta Redonda, Resende e Angra dos Reis.</p>
<h2>O abastecimento faz parte do seu dia a dia. Do nosso também.</h2>
<p>Quem trabalha com alimentos precisa conciliar produção, estoque, atendimento e compras. Cada estabelecimento tem uma realidade: alguns utilizam ovos nas receitas, outros servem porções e acompanhamentos, e há também quem compra para revender.</p>
<p>Nosso atendimento parte dessa necessidade. Você informa os produtos, as quantidades e sua cidade. A partir daí, conversa diretamente com a Mix para consultar as condições de fornecimento e a programação de entrega no seu comércio.</p>
<h2>Três produtos para diferentes necessidades.</h2>
<p>Os <a href="../ovos-de-galinha/index.html">ovos de galinha</a> estão presentes em massas, bolos, pães, refeições e nas prateleiras de muitos comércios. Trabalhamos com caixas de 12 cartelas de 30 ovos, totalizando 360 unidades. Também é possível solicitar cotação de meia caixa, com 6 cartelas e 180 ovos.</p>
<p>Os <a href="../ovos-de-codorna-em-conserva/index.html">ovos de codorna em conserva</a> são uma opção para porções, saladas, acompanhamentos e revenda. Na cotação, você informa a quantidade de pacotes e confirma com nossa equipe a apresentação e a disponibilidade.</p>
<p>A <a href="../batata-palha/index.html">batata palha</a> completa o fornecimento para lanches, refeições e revenda. A consulta pode ser feita por unidades ou fardos, com as condições confirmadas no atendimento. Os três produtos podem fazer parte da mesma solicitação de orçamento.</p>
<h2>Para quem prepara, serve ou revende alimentos.</h2>
<p>Padarias, restaurantes e lanchonetes já fazem parte da nossa rotina. Mas a Mix não se limita a esses segmentos: o atendimento também é voltado a outros negócios que utilizam nossos produtos na produção, no serviço de alimentação ou na revenda.</p>
<p>Confeitarias, pizzarias, hamburguerias, operações de delivery, hotéis, pousadas, buffets e cozinhas industriais podem consultar o fornecimento. Mercados, mercearias e hortifrutis também encontram na Mix um contato para cotar os produtos para suas prateleiras.</p>
<h2>Entregamos no seu comércio.</h2>
<p>Atendemos Barra Mansa, Pinheiral, Volta Redonda, Resende e Angra dos Reis. A entrega é programada conforme a rota e a disponibilidade para o endereço informado. Por isso, conhecer sua cidade e a localização do estabelecimento faz parte da conversa sobre o pedido.</p>
<p>Antes de confirmar a compra, consulte a programação para sua região. Quantidades, condições de fornecimento e detalhes da entrega são combinados diretamente com nossa equipe pelo WhatsApp.</p>
<h2>Atendimento direto para organizar o próximo pedido.</h2>
<p>No site, você pode conhecer os produtos e montar uma lista de cotação com as quantidades desejadas. Essa lista abre no WhatsApp para sua revisão antes do envio. Se preferir começar com uma dúvida, os botões de contato também permitem iniciar uma conversa sem preencher a cotação.</p>
<p>O orçamento é uma etapa de consulta: nossa equipe confirma as informações do fornecimento no atendimento. Você pode perguntar sobre um único produto ou aproveitar o mesmo contato para consultar os três.</p>
<h2>Converse com a Mix Alimentos.</h2>
<p>Se o seu negócio utiliza ovos, codorna em conserva ou batata palha, conte para a gente o que precisa. Informe sua cidade, os produtos e as quantidades para consultar o abastecimento do seu comércio.</p>${whatsapp()}`},
    {id:'contato',name:'Contato',title:'Contato e entregas | Mix Alimentos',meta:'Fale com a Mix Alimentos pelo WhatsApp (24) 99961-9682 e consulte produtos e entregas em cinco cidades do Rio de Janeiro.',body:`<h1>Fale com a Mix Alimentos.</h1><p>WhatsApp comercial: <strong>${config.phoneDisplay}</strong>.</p>${whatsapp()}<h2>Para solicitar um orçamento</h2><p>Informe os produtos, as quantidades desejadas e sua cidade. Também é possível montar a lista na <a href="../index.html#cotacao">cotação da página inicial</a>.</p><h2>Entregas no seu comércio</h2><p>Atendemos ${cities}. Consulte a programação e a disponibilidade para seu endereço. Condições de fornecimento e entrega são confirmadas no atendimento.</p><p>Base de atendimento: Barra Mansa, Rio de Janeiro, Brasil.</p>`},
    {id:'termos',name:'Termos de uso',title:'Termos de uso e cotações | Mix Alimentos',meta:'Entenda como consultar produtos, montar uma cotação e combinar o fornecimento e a entrega com a Mix Alimentos.',body:`<span class="section-label">Uso do site e atendimento</span><h1>Termos de uso e cotações.</h1><p>Este site apresenta os produtos e a área de atendimento da Mix Alimentos e permite iniciar uma solicitação de orçamento pelo WhatsApp. Não há pagamento nem fechamento automático de compras pelo site.</p><h2>Informações dos produtos</h2><p>As páginas apresentam ovos de galinha, ovos de codorna em conserva e batata palha. As imagens são ilustrativas. Apresentações, embalagens, quantidades disponíveis e condições de fornecimento devem ser confirmadas com a Mix no atendimento.</p><h2>Como funciona a cotação</h2><p>Você pode selecionar os produtos, informar quantidades e escolher sua cidade. Essas informações compõem uma mensagem que será aberta no WhatsApp para sua revisão e envio. Também é possível entrar em contato sem preencher a lista.</p><p>A seleção de produtos e a abertura da mensagem não concluem uma compra, não geram cobrança automática e não confirmam reserva de estoque. A solicitação segue para atendimento da Mix Alimentos após o seu envio.</p><h2>Condições do pedido</h2><p>O site não publica preços. Valores, disponibilidade, formas de pagamento e demais condições do pedido são consultados e confirmados diretamente no atendimento. Revise as informações combinadas antes de confirmar a compra.</p><h2>Área de entrega</h2><p>A Mix atende ${cities}. A programação da entrega depende da rota e da disponibilidade para o endereço informado. A presença de uma cidade na área atendida não representa confirmação automática de prazo para todos os endereços.</p><h2>Serviços externos e privacidade</h2><p>Os links de contato direcionam ao WhatsApp, um serviço externo com suas próprias condições e políticas. O tratamento das informações usadas no site e no atendimento está descrito na nossa <a href="../privacidade/index.html">Política de Privacidade</a>.</p><h2>Dúvidas e atendimento</h2><p>Para esclarecer informações dos produtos, corrigir uma solicitação ou consultar condições de fornecimento, fale com a Mix Alimentos pelo WhatsApp ${config.phoneDisplay}.</p>${whatsapp()}`},
    {id:'privacidade',name:'Privacidade',title:'Privacidade | Mix Alimentos',meta:'Saiba como funcionam a cotação no navegador e o contato pelo WhatsApp no site da Mix Alimentos.',body:`<span class="section-label">Política de privacidade</span><h1>Sua privacidade na Mix Alimentos.</h1><p>Este site apresenta os produtos e a área de entrega da Mix Alimentos. Aqui explicamos quais informações são usadas na cotação e como funciona o contato com a nossa equipe.</p><h2>Navegação e cotação</h2><p>Esta versão do site não utiliza cookies de análise, publicidade ou rastreadores. Não há cadastro. As seleções de produto, quantidade e cidade são usadas no navegador para montar a mensagem de cotação.</p><h2>Contato pelo WhatsApp</h2><p>O site abre uma mensagem para você revisar e enviar. As informações que decidir enviar são utilizadas pela Mix Alimentos para atender sua solicitação comercial. O WhatsApp é um serviço externo e possui suas próprias políticas.</p><h2>Hospedagem</h2><p>A infraestrutura de hospedagem pode registrar dados técnicos de acesso, como endereço IP, data, horário e recurso solicitado, para operação e segurança do serviço.</p><h2>Fale sobre seus dados</h2><p>Para dúvidas ou solicitações relacionadas aos seus dados no atendimento da Mix Alimentos, fale pelo WhatsApp ${config.phoneDisplay}.</p>${whatsapp()}`}
  ];
}

export function prefersMarkdown(accept = '') {
  const ranges = String(accept).toLowerCase().split(',').map(item => {
    const [type, ...params] = item.trim().split(';');
    const q = params.find(p => p.trim().startsWith('q='));
    return {type, q:q ? Number(q.trim().slice(2)) : 1};
  });
  const markdown = ranges.find(r => r.type === 'text/markdown');
  const html = ranges.find(r => r.type === 'text/html');
  return !!markdown && markdown.q > 0 && markdown.q >= (html?.q ?? 0);
}

export function discoveryLinks(route = '/') {
  const base = route.replace(/index\.(?:html|md)$/, '');
  return `</llms.txt>; rel="describedby", <${base}index.md>; rel="alternate"; type="text/markdown"`;
}

// Convert the generated public main content, never the internal brief or source files.
export function markdownPage(html, url, config) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  const text = main
    .replace(/<(svg|form|script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, label) => {
      const destination = new URL(href.replaceAll('&amp;','&'), url).href.replace(/index\.html(?=#|$)/, '');
      const readable = label.replace(/<[^>]+>/g, '').trim();
      return readable ? `[${readable}](${destination}) ` : '';
    })
    .replace(/<h([1-6])[^>]*>/g, (_, level) => '\n\n'+'#'.repeat(Number(level))+' ')
    .replace(/<\/(?:h[1-6]|p|div|section|article|details|summary|dt|dd|nav)>/g, '\n\n')
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(?:span|strong|small)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/[ \t]+/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return `${text}\n\nFonte: ${url}\n\nContato: WhatsApp ${config.phoneDisplay}. Orçamentos e entregas são confirmados no atendimento.\n`;
}
