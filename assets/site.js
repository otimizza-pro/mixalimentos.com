const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const opened=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(opened));nav.classList.toggle('is-open',opened)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
const dialog=document.querySelector('#privacy');
document.querySelector('.privacy-button')?.addEventListener('click',()=>dialog.showModal());
dialog?.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
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
document.querySelectorAll('a[data-whatsapp]').forEach(link=>link.addEventListener('click',event=>{if(event.defaultPrevented)return;const detail={page_path:location.pathname,product:link.dataset.product||'geral',cta_position:link.dataset.position||'body',quote_type:link.hasAttribute('data-combined')?'combined':'direct',selected_city:link.dataset.selectedCity||''};window.dispatchEvent(new CustomEvent('mix:whatsapp_click',{detail}));}));
