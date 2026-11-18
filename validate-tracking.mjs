import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import config from './site.config.mjs';
import {renderTracking} from './tracking.mjs';

let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++};
const pages=['index.html','ovos-de-galinha/index.html','ovos-de-codorna-em-conserva/index.html','batata-palha/index.html','sobre/index.html','contato/index.html','termos/index.html','privacidade/index.html','404.html'];
const report={executedAt:new Date().toISOString(),gtmId:config.gtmId,ga4Destination:config.analyticsId,pages:[],remoteContainerConfiguration:'unverified',ga4EventsReceipt:'unverified',measurementComplete:false};
for(const page of pages){
  const html=await fs.readFile(new URL('./public_html/'+page,import.meta.url),'utf8');
  const loaders=[...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]).filter(url=>url.includes('googletagmanager.com/'));
  check(loaders.length===1&&loaders[0]==='https://www.googletagmanager.com/gtm.js?id='+config.gtmId,page+' single confirmed GTM loader');
  check(!html.includes('GTM-KGT5SVQC')&&!html.includes('/gtag/js')&&!/gtag\(['"]config['"]/.test(html),page+' no alternate container or standalone GA4');
  check(!/gtag\(['"]event['"],\s*['"]page_view/.test(html)&&!html.includes("event:'page_view'"),page+' no manual page_view');
  report.pages.push({page,gtmLoaders:loaders.length,standaloneGa4Loaders:0,manualPageViews:0});
}
const code=renderTracking(config,'https://mixalimentos.com/ovos-de-galinha/?email=private%40example.invalid#customer').match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox={document:{referrer:'https://example.invalid/customer?email=private%40example.invalid#secret'},URL,console};
sandbox.window=sandbox;sandbox.dataLayer=[{preserved:true}];
vm.runInNewContext(code,sandbox);
check(sandbox.dataLayer[0].preserved,'Existing dataLayer preserved');
check(sandbox.dataLayer.filter(item=>item[0]==='js').length===1,'One initialization command');
const context=sandbox.dataLayer.find(item=>item.analytics_page_location);
check(context.analytics_page_location==='https://mixalimentos.com/ovos-de-galinha/','Analytics URL excludes query and hash');
check(context.analytics_page_referrer==='https://example.invalid','Referrer contains origin only');
check(!JSON.stringify(sandbox.dataLayer).includes('private'),'No personal input in initialization payload');
check(context.ga4_measurement_id==='G-0F0M7XHYGC','Correct GA4 destination metadata without firing a tag');
check(renderTracking({...config,domain:''},config.domain)==='','Unconfigured previews do not load tracking');
assert.throws(()=>renderTracking({...config,gtmId:'invalid'},config.domain));checks++;
await fs.mkdir(new URL('./validation/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('./validation/tracking-audit.json',import.meta.url),JSON.stringify({...report,checks,localCodeValidated:true},null,2));
console.log(`Tracking code audit: ${checks} checks passed. GA4 receipt remains UNVERIFIED.`);
