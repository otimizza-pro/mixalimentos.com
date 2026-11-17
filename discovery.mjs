// Public information only. Keep these pages and agent resources in the same build.
export function informationPages(config, whatsapp) {
  const cities = config.cities.join(', ');
  return [
    {id:'sobre',name:'Sobre a Mix Alimentos',title:'Sobre a Mix Alimentos | Fornecimento para comércios',meta:'Conheça a Mix Alimentos e o fornecimento de ovos, codorna em conserva e batata palha em Barra Mansa e região.',body:`<h1>Alimentos para a rotina do seu comércio.</h1><p>Há ${config.experience}, a Mix Alimentos fornece ovos de galinha, ovos de codorna em conserva e batata palha para quem prepara, serve ou revende alimentos.</p><h2>Quem atendemos</h2><p>Padarias, restaurantes e lanchonetes fazem parte da nossa rotina. Também atendemos confeitarias, pizzarias, hamburguerias, hotéis, pousadas, buffets, mercados, hortifrutis, delivery e cozinhas industriais.</p><h2>Onde entregamos</h2><p>Nossa base é Barra Mansa, RJ. Entregamos no comércio do cliente em ${cities}. A programação e a disponibilidade para cada endereço são confirmadas pelo WhatsApp.</p><h2>Atendimento direto</h2><p>Consulte produtos, quantidades e condições antes de fechar seu pedido.</p>${whatsapp()}`},
    {id:'contato',name:'Contato',title:'Contato e entregas | Mix Alimentos',meta:'Fale com a Mix Alimentos pelo WhatsApp (24) 99961-9682 e consulte produtos e entregas em cinco cidades do Rio de Janeiro.',body:`<h1>Fale com a Mix Alimentos.</h1><p>WhatsApp comercial: <strong>${config.phoneDisplay}</strong>.</p>${whatsapp()}<h2>Para solicitar um orçamento</h2><p>Informe os produtos, as quantidades desejadas e sua cidade. Também é possível montar a lista na <a href="../index.html#cotacao">cotação da página inicial</a>.</p><h2>Entregas no seu comércio</h2><p>Atendemos ${cities}. Consulte a programação e a disponibilidade para seu endereço. Condições de fornecimento e entrega são confirmadas no atendimento.</p><p>Base de atendimento: Barra Mansa, Rio de Janeiro, Brasil.</p>`},
    {id:'privacidade',name:'Privacidade',title:'Privacidade | Mix Alimentos',meta:'Saiba como funcionam a cotação no navegador e o contato pelo WhatsApp no site da Mix Alimentos.',body:`<h1>Privacidade no site da Mix Alimentos.</h1><h2>Navegação e cotação</h2><p>Esta versão do site não utiliza cookies de análise, publicidade ou rastreadores. Não há cadastro. As seleções de produto, quantidade e cidade são usadas no navegador para montar a mensagem de cotação.</p><h2>Contato pelo WhatsApp</h2><p>O site abre uma mensagem para você revisar e enviar. As informações que decidir enviar são utilizadas pela Mix Alimentos para atender sua solicitação comercial. O WhatsApp é um serviço externo e possui suas próprias políticas.</p><h2>Hospedagem</h2><p>A infraestrutura de hospedagem pode registrar dados técnicos de acesso, como endereço IP, data, horário e recurso solicitado, para operação e segurança do serviço.</p><h2>Fale sobre seus dados</h2><p>Para dúvidas ou solicitações relacionadas aos seus dados no atendimento da Mix Alimentos, fale pelo WhatsApp ${config.phoneDisplay}.</p>${whatsapp()}`}
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
    .replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return `${text}\n\nFonte: ${url}\n\nContato: WhatsApp ${config.phoneDisplay}. Orçamentos e entregas são confirmados no atendimento.\n`;
}
