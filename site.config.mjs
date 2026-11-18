const instagram={handle:'@mixalimentos.rj',url:'https://www.instagram.com/mixalimentos.rj/'};
export default {
  name: 'Mix Alimentos',
  whatsapp: '5524999619682',
  phoneDisplay: '(24) 99961-9682',
  domain: 'https://mixalimentos.com',
  experience: 'Mais de 20 anos', // Tempo de atuação atualizado pelo contratante.
  cities: ['Barra Mansa', 'Pinheiral', 'Volta Redonda', 'Resende', 'Angra dos Reis'],
  // Endereço comercial completo informado pelo contratante.
  address: {streetAddress:'Rua Geraldo José de Freitas, 507, Boa Vista I',addressLocality:'Barra Mansa',addressRegion:'RJ',postalCode:'27332-180',addressCountry:'BR'},
  instagram,
  sameAs: [instagram.url], // Somente URLs confirmadas de perfis oficiais da Mix.
  // Alterar apenas quando o conteúdo da respectiva página mudar, nunca a cada build.
  lastModified: {'':'2026-11-17','ovos-de-galinha':'2026-11-17','ovos-de-codorna-em-conserva':'2026-11-17','batata-palha':'2026-11-17','sobre':'2026-11-17','contato':'2026-11-17','privacidade':'2026-11-17','termos':'2026-11-17'},
  gtmId: 'GTM-5CPHG7HX',
  analyticsId: 'G-0F0M7XHYGC', // Destino GA4 a configurar no GTM. Não instala uma segunda tag.
  searchConsoleVerification: ''
};
