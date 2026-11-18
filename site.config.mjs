const instagram={handle:'@mixalimentos.rj',url:'https://www.instagram.com/mixalimentos.rj/'};
export default {
  name: 'Mix Alimentos',
  whatsapp: '5524999619682',
  phoneDisplay: '(24) 99961-9682',
  domain: 'https://mixalimentos.com',
  experience: 'Mais de 20 anos', // Tempo de atuação atualizado pelo contratante.
  cities: ['Barra Mansa', 'Pinheiral', 'Volta Redonda', 'Resende', 'Angra dos Reis'],
  // Localidade confirmada; incluir rua e CEP somente após confirmação.
  address: {addressLocality:'Barra Mansa',addressRegion:'RJ',addressCountry:'BR'},
  instagram,
  sameAs: [instagram.url], // Somente URLs confirmadas de perfis oficiais da Mix.
  // Alterar apenas quando o conteúdo da respectiva página mudar, nunca a cada build.
  lastModified: {'':'2026-11-17','ovos-de-galinha':'2026-11-17','ovos-de-codorna-em-conserva':'2026-11-17','batata-palha':'2026-11-17','sobre':'2026-11-17','contato':'2026-11-17','privacidade':'2026-11-17','termos':'2026-11-17'},
  analyticsId: '', // Reservado. Nenhum rastreador é carregado nesta versão.
  searchConsoleVerification: ''
};
