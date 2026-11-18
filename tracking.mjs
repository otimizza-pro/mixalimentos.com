// One GTM loader. The GA4 destination and event tags are configured inside GTM.
// No gtag.js loader, gtag('config') or manual page_view is emitted here.
export function renderTracking(config,pageUrl){
  if(!config.gtmId||!config.domain)return '';
  if(!/^GTM-[A-Z0-9]+$/.test(config.gtmId))throw new Error('Contêiner GTM inválido.');
  if(!/^G-[A-Z0-9]+$/.test(config.analyticsId))throw new Error('Destino GA4 inválido.');
  const canonical=new URL(pageUrl);
  canonical.search='';canonical.hash='';
  const context={analytics_page_location:canonical.href,analytics_page_path:canonical.pathname,ga4_measurement_id:config.analyticsId};
  const serialized=JSON.stringify(context).replaceAll('<','\\u003c');
  return `<!-- Google Tag Manager -->
<script>window.dataLayer = window.dataLayer || [];window.dataLayer.push(Object.assign(${serialized},{analytics_page_referrer:(function(){try{return document.referrer?new URL(document.referrer).origin:'';}catch{return '';}})()}));function gtag(){dataLayer.push(arguments);}gtag('js', new Date());</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=${config.gtmId}"></script>
<!-- End Google Tag Manager -->`;
}
