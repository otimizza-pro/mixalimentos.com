const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const opened=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(opened));nav.classList.toggle('is-open',opened)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
const quote=document.querySelector('.quote-form');
function updateQuote(){
if(!quote)return;
const selected=[...quote.querySelectorAll('input[name="product"]:checked')];
const ids=new Set(selected.map(input=>input.dataset.productId));
quote.querySelectorAll('[data-quantity-panel]').forEach(panel=>{
const active=ids.has(panel.dataset.quantityPanel);
panel.hidden=!active;
panel.querySelectorAll('input,select').forEach(input=>{input.disabled=!active});
});
const city=quote.querySelector('[name="city"]').value;
const lines=selected.map(input=>{
const id=input.dataset.productId;
const panel=quote.querySelector(`[data-quantity-panel="${id}"]`);
const field=panel.querySelector('[data-quantity]');
const count=field.value&&field.validity.valid?Number(field.value):null;
let quantity='quantidade a combinar';
if(count!==null){
const formatted=count.toLocaleString('pt-BR',{maximumFractionDigits:1});
if(id==='ovos-de-galinha')quantity=count===0.5?'meia caixa (6 cartelas, 180 ovos)':`${formatted} ${count===1?'caixa':'caixas'}`;
else if(id==='ovos-de-codorna-em-conserva')quantity=`${formatted} ${count===1?'pacote':'pacotes'}`;
else {const unit=panel.querySelector('[data-unit]').value;quantity=`${formatted} ${unit==='fardo'?(count===1?'fardo':'fardos'):(count===1?'unidade':'unidades')}`;}
}
return `- ${input.value}: ${quantity}`;
});
const message=`Olá! Vim pelo site da Mix Alimentos e gostaria de solicitar uma cotação para meu comércio.\n\nProdutos de interesse:\n${lines.length?lines.join('\n'):'Gostaria de conhecer os produtos.'}\n\nCidade: ${city||'a informar'}\n\nPodem me informar as condições e a disponibilidade de entrega?`;
const link=quote.querySelector('[data-combined]');
link.href=`https://wa.me/${quote.dataset.phone}?text=${encodeURIComponent(message)}`;
link.dataset.selectedCity=city;
link.dataset.product=selected.map(input=>input.value).join(',');
}
quote?.addEventListener('input',updateQuote);quote?.addEventListener('change',updateQuote);updateQuote();
quote?.querySelector('[data-combined]')?.addEventListener('click',event=>{
if(!quote.reportValidity()){event.preventDefault();return;}
updateQuote();
});
const analyticsProducts=['ovos-de-galinha','ovos-de-codorna-em-conserva','batata-palha'];
const analyticsCities=['Barra Mansa','Pinheiral','Volta Redonda','Resende','Angra dos Reis'];
const analyticsPositions=['header','hero','body','delivery','final_section','sticky_mobile','footer','cross_sell','information'];
const analyticsPaths=['/','/ovos-de-galinha/','/ovos-de-codorna-em-conserva/','/batata-palha/','/sobre/','/contato/','/privacidade/','/termos/'];
function trackWhatsApp(link,event){
if(event.defaultPrevented)return;
const combined=link.hasAttribute('data-combined');
if(combined&&(!quote||!quote.checkValidity()))return;
const path=location.pathname.replace(/index\.html$/,'');
const pagePath=analyticsPaths.includes(path)?path:'/404.html';
const selected=combined?analyticsProducts.filter(id=>quote.querySelector('input[data-product-id="'+id+'"]')?.checked):[];
const product=combined?(selected.join('|')||'geral'):(analyticsProducts.includes(link.dataset.product)?link.dataset.product:'geral');
const city=link.dataset.selectedCity||'';
const context=window.dataLayer?.find(item=>item&&item.analytics_page_location)||{};
const detail={page_path:pagePath,page_location:context.analytics_page_location||'https://mixalimentos.com'+pagePath,page_referrer:context.analytics_page_referrer||'',product,cta_position:analyticsPositions.includes(link.dataset.position)?link.dataset.position:'body',quote_type:combined?'combined':'direct',selected_city:analyticsCities.includes(city)?city:city?'outra_cidade':'nao_informada'};
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({event:combined?'quote_request':link.dataset.position==='delivery'?'city_whatsapp':'whatsapp_click',...detail});
window.dispatchEvent(new CustomEvent('mix:whatsapp_click',{detail}));
}
document.querySelectorAll('a[data-whatsapp]').forEach(link=>link.addEventListener('click',event=>trackWhatsApp(link,event)));
document.querySelectorAll('footer .instagram-link').forEach(link=>link.addEventListener('click',event=>{
if(event.defaultPrevented)return;
const path=location.pathname.replace(/index\.html$/,'');
const pagePath=analyticsPaths.includes(path)?path:'/404.html';
const context=window.dataLayer?.find(item=>item&&item.analytics_page_location)||{};
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({event:'footer_instagram',page_path:pagePath,page_location:context.analytics_page_location||'https://mixalimentos.com'+pagePath,page_referrer:context.analytics_page_referrer||'',product:'geral',cta_position:'footer',quote_type:'direct',selected_city:'nao_informada'});
}));