import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {handler} from './request-handler.mjs';
import config from './site.config.mjs';
const require=createRequire(import.meta.url);
const {resolveTool,browserOptions}=require('./dev-tools.cjs');
const {chromium}=require(resolveTool('playwright'));
const axe=resolveTool('axe-core/axe.min.js');
const root=path.dirname(fileURLToPath(import.meta.url));
const evidence=path.join(root,'validation');await fs.mkdir(evidence,{recursive:true});
const browser=await chromium.launch(browserOptions());
// This managed environment blocks loopback traffic. Render exact output with
// intercepted requests; exercise the HTTP handler in-process, without a socket.
async function request(url){let status=200,headers={};let body;await handler({url:new URL(url).pathname+new URL(url).search},{writeHead(s,h={}){status=s;headers=h},end(b){body=b}});return {status,headers,body,ok:status>=200&&status<300};}
async function intercept(context){await context.route('https://www.googletagmanager.com/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));await context.route('http://127.0.0.1:4173/**',async route=>{const url=new URL(route.request().url());let file=path.join(root,'public_html',decodeURIComponent(url.pathname));let stat=await fs.stat(file).catch(()=>null);if(stat?.isDirectory())file=path.join(file,'index.html');const bytes=await fs.readFile(file).catch(()=>null);if(!bytes)return route.fulfill({status:404,contentType:'text/html',body:await fs.readFile(path.join(root,'public_html/404.html'))});const type={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream';await route.fulfill({status:200,contentType:type,body:bytes})})}
const context=await browser.newContext();await intercept(context);const page=await context.newPage();
const failures=[],checks=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
const routes=['/','/ovos-de-galinha/','/ovos-de-codorna-em-conserva/','/batata-palha/','/sobre/','/contato/','/privacidade/','/termos/'];
function check(label,passed,detail=''){checks.push({label,passed,detail});if(!passed)failures.push(label)}
try{
for(const route of routes){
const response=await page.goto('http://127.0.0.1:4173'+route);check('HTTP '+route,response.status()===200);
await page.evaluate(async()=>{await Promise.all([...document.images].map(async im=>{im.loading='eager';await im.decode().catch(()=>{})}))});
check('Only product pages in primary menu '+route,await page.locator('#navigation a').allTextContents().then(labels=>JSON.stringify(labels)===JSON.stringify(['Ovos de galinha','Ovos de codorna','Batata palha'])));
check('Correct current primary menu link '+route,await page.locator('#navigation a[aria-current="page"]').count()===(['/ovos-de-galinha/','/ovos-de-codorna-em-conserva/','/batata-palha/'].includes(route)?1:0));
check('Single GTM container and initialized queue '+route,await page.locator('script[src="https://www.googletagmanager.com/gtm.js?id='+config.gtmId+'"]').count()===1&&await page.evaluate(()=>typeof window.gtag==='function'&&window.dataLayer.filter(item=>item[0]==='js').length===1));
check('One H1 '+route,await page.locator('h1').count()===1);
check('Images loaded '+route,await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)));
check('No displayed prices '+route,!/R\$\s*\d/.test(await page.locator('body').innerText()));
const hrefs=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.href));
for(const link of new Set(hrefs.filter(h=>h.startsWith('http://127.0.0.1:4173/')))){const r=await request(link);check('Internal link handler '+new URL(link).pathname,r.ok)}
const wa=hrefs.filter(h=>h.startsWith('https://wa.me/'));check('Official WhatsApp '+route,wa.length>0&&wa.every(h=>new URL(h).pathname==='/5524999619682'&&new URL(h).searchParams.get('text')?.length>15));
for(const width of [320,360,375,390,768,900,1000,1024,1100,1440]){await page.setViewportSize({width,height:900});check(`Reflow ${route} ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
for(const width of [390,1440]){await page.setViewportSize({width,height:width===390?844:1000});await page.addScriptTag({path:axe});const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));check(`Accessibility ${route} ${width}`,result.violations.length===0,result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})));await fs.writeFile(path.join(evidence,`axe-${route.split('/').filter(Boolean)[0]||'home'}-${width}.json`),JSON.stringify(result,null,2));}
await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(evidence,`${route.split('/').filter(Boolean)[0]||'home'}-desktop.png`),fullPage:true});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(evidence,`${route.split('/').filter(Boolean)[0]||'home'}-mobile.png`),fullPage:true});
const ld=await page.locator('script[type="application/ld+json"]').textContent();check('JSON-LD parse '+route,!!JSON.parse(ld)['@context']);
}
for(const [label,route] of [['Sobre a Mix Alimentos','sobre'],['Contato','contato'],['Termos de uso','termos']]){
 await page.goto('http://127.0.0.1:4173/');await page.setViewportSize({width:390,height:844});await page.locator('.footer-info a').filter({hasText:label}).click();check('Mobile information footer navigation '+route,page.url().includes('/'+route+'/'));
}
await page.goto('http://127.0.0.1:4173/');await page.setViewportSize({width:390,height:844});
const hero=await page.locator('.hero-actions .btn').boundingBox();check('Hero CTA in first viewport 390',hero.y+hero.height<844);
await page.locator('.menu-toggle').click();check('Mobile menu expanded',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true');await page.keyboard.press('Escape');check('Escape closes menu',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false');
await page.locator('.menu-toggle').click();await page.locator('#navigation a').nth(0).click();check('Menu product navigation',page.url().includes('/ovos-de-galinha/'));
check('Unselected quail quantity hidden',!(await page.locator('#quantity-ovos-de-codorna-em-conserva').isVisible()));
await page.locator('input[value="Ovos de codorna em conserva"]').check();await page.locator('input[value="Batata palha"]').check();await page.locator('#city').selectOption('Resende');
check('Selecting products reveals quantities',await page.locator('#quantity-ovos-de-codorna-em-conserva').isVisible()&&await page.locator('#quantity-batata-palha').isVisible());
await page.locator('#quantity-ovos-de-galinha').fill('0.5');await page.locator('#quantity-ovos-de-codorna-em-conserva').fill('3');await page.locator('#quantity-batata-palha').fill('2');
const readMessage=async()=>new URL(await page.locator('[data-combined]').getAttribute('href')).searchParams.get('text');
const message=await readMessage();
check('Order list includes half box packages units and city',['- Ovos de galinha: meia caixa (6 cartelas, 180 ovos)','- Ovos de codorna em conserva: 3 pacotes','- Batata palha: 2 unidades','Cidade: Resende'].every(t=>message.includes(t)));
await page.locator('#unit-batata-palha').selectOption('fardo');check('Potato bale unit in message',(await readMessage()).includes('Batata palha: 2 fardos'));await page.locator('#unit-batata-palha').selectOption('unidade');
await page.locator('input[value="Ovos de codorna em conserva"]').uncheck();check('Deselected product hidden disabled and omitted',!(await page.locator('#quantity-ovos-de-codorna-em-conserva').isVisible())&&await page.locator('#quantity-ovos-de-codorna-em-conserva').isDisabled()&&!(await readMessage()).includes('Ovos de codorna em conserva'));
await page.locator('input[value="Ovos de codorna em conserva"]').check();check('Quantity preserved when reselected',(await readMessage()).includes('3 pacotes'));
await page.locator('#quantity-ovos-de-galinha').fill('1.5');check('One and half boxes supported',(await readMessage()).includes('1,5 caixas'));
await page.locator('#quantity-ovos-de-galinha').fill('0.25');check('Quarter box rejected',!(await page.locator('.quote-form').evaluate(f=>f.checkValidity())));await page.locator('#quantity-ovos-de-galinha').fill('0.5');
await page.locator('#quantity-ovos-de-codorna-em-conserva').fill('1.5');check('Fractional packages rejected',!(await page.locator('.quote-form').evaluate(f=>f.checkValidity())));await page.locator('#quantity-ovos-de-codorna-em-conserva').fill('3');
await page.locator('#quantity-batata-palha').fill('-1');check('Negative quantities rejected',!(await page.locator('.quote-form').evaluate(f=>f.checkValidity())));await page.locator('#quantity-batata-palha').fill('');check('Optional quantities still allow contact',await page.locator('.quote-form').evaluate(f=>f.checkValidity())&&(await readMessage()).includes('Batata palha: quantidade a combinar'));await page.locator('#quantity-batata-palha').fill('2');
await page.evaluate(()=>{window.__events=[];window.addEventListener('mix:whatsapp_click',e=>window.__events.push(e.detail))});
// Prevent external navigation. Validate the local intent event without contacting anyone.
await page.evaluate(()=>document.querySelector('[data-combined]').addEventListener('click',e=>e.preventDefault()));await page.locator('[data-combined]').click();const events=await page.evaluate(()=>window.__events);check('One intention event without personal data',events.length===1&&events[0].selected_city==='Resende'&&!JSON.stringify(events).includes('2 caixas'));

const readTracking=()=>page.evaluate(()=>window.dataLayer.filter(item=>['whatsapp_click','quote_request'].includes(item.event)));
check('One quote request per combined click',(await readTracking()).length===1&&(await readTracking())[0].event==='quote_request');
await page.locator('#quantity-ovos-de-galinha').fill('0.25');await page.locator('[data-combined]').click();check('Invalid quote is not tracked',(await readTracking()).length===1);await page.locator('#quantity-ovos-de-galinha').fill('0.5');
await page.evaluate(()=>{window.__originalTrackingUrl=location.href;history.replaceState(null,'','?email=private%40example.invalid#customer');document.querySelector('.hero-actions a[data-whatsapp]').addEventListener('click',event=>event.preventDefault());});
await page.locator('.hero-actions a[data-whatsapp]').click();
const trackingEvents=await readTracking();
check('Direct click emits one separate WhatsApp event',trackingEvents.length===2&&trackingEvents[1].event==='whatsapp_click');
check('Tracking excludes message quantities phone and query',trackingEvents.every(item=>!['href','link_url','message','quantity','phone','email'].some(key=>key in item))&&!JSON.stringify(trackingEvents).includes('private')&&!JSON.stringify(trackingEvents).includes('wa.me')&&!JSON.stringify(trackingEvents).includes('180 ovos'));
await page.evaluate(()=>history.replaceState(null,'',window.__originalTrackingUrl));
await page.locator('.privacy-link').click();check('Privacy opens as a dedicated page',page.url().includes('/privacidade/')&&await page.locator('h1').count()===1);check('Privacy popup removed',await page.locator('dialog').count()===0);await page.goBack();
await page.locator('summary').first().click();check('FAQ opens',await page.locator('details').first().getAttribute('open')!==null);
check('404 handler status',(await request('http://127.0.0.1:4173/inexistente')).status===404);
check('Friendly route handler redirect',(await request('http://127.0.0.1:4173/batata-palha')).status===301);
const nojs=await browser.newContext({javaScriptEnabled:false});await intercept(nojs);const bare=await nojs.newPage();await bare.goto('http://127.0.0.1:4173/ovos-de-galinha/');check('Content and WhatsApp without JavaScript',await bare.locator('h1').isVisible()&&(await bare.locator('.hero-actions a[data-whatsapp]').getAttribute('href')).startsWith('https://wa.me/5524999619682'));await nojs.close();
const filePage=await browser.newPage();await intercept(filePage.context());await filePage.goto('file:///'+path.join(root,'public_html','index.html').replaceAll('\\','/'));check('Open index.html directly',await filePage.locator('h1').isVisible()&&await filePage.locator('.logo img').evaluate(i=>i.naturalWidth>0));await filePage.locator('.products .card-link').first().click();check('Product navigation via file URL',filePage.url().includes('/ovos-de-galinha/index.html'));
check('No browser script errors',errors.length===0,errors);
}finally{await browser.close();await fs.writeFile(path.join(evidence,'report.json'),JSON.stringify({executedAt:new Date().toISOString(),checks,failures,errors},null,2));}
console.log(JSON.stringify({checks:checks.length,passed:checks.filter(c=>c.passed).length,failures},null,2));if(failures.length)process.exitCode=1;
