import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {brotliDecompressSync,gunzipSync} from 'node:zlib';
import {handler} from './request-handler.mjs';
import config from './site.config.mjs';

const out=new URL('./public_html/',import.meta.url);
const routes=['','ovos-de-galinha','ovos-de-codorna-em-conserva','batata-palha','sobre','contato','privacidade','termos'];
let checks=0;
function check(test,label){assert.ok(test,label);checks++}
async function request(url,headers={},method='GET'){
  const response={};
  await handler({url,headers,method},{writeHead(status,headers={}){Object.assign(response,{status,headers})},end(body){response.body=body}});
  return response;
}
const sitemap=await fs.readFile(new URL('sitemap.xml',out),'utf8');
const llms=await fs.readFile(new URL('llms.txt',out),'utf8');
check((sitemap.match(/<lastmod>/g)||[]).length===routes.length,'All canonical URLs have lastmod');
for(const route of routes){
  const url='/'+(route?route+'/':'');
  const html=await request(url);
  check(html.status===200&&html.headers['Content-Type'].startsWith('text/html'),url+' HTML');
  const text=html.body.toString();
  check(!text.includes('<dialog')&&!text.includes('privacy-button'),url+' no privacy popup');
  check(text.includes('rel="privacy-policy"')&&text.includes('rel="terms-of-service"'),url+' legal page links');
  if(!route){
    check(text.includes('<nav class="footer-info" aria-label="Informações institucionais">'),'Homepage has semantic company navigation before JavaScript');
    for(const target of ['sobre','contato','termos'])check(new RegExp('<a[^>]*href="/'+target+'/"[^>]*>').test(text),'Homepage has real canonical '+target+' anchor before JavaScript');
  }
  const graph=JSON.parse(text.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const organization=graph.find(n=>n['@type']==='Organization');
  check(Object.entries(config.address).every(([key,value])=>organization.address[key]===value),url+' confirmed complete address');
  check(JSON.stringify(organization.sameAs||[])===JSON.stringify(config.sameAs),url+' confirmed official profiles');
  const faq=graph.find(n=>n['@type']==='FAQPage');
  if(faq)check(faq.mainEntity.every(q=>text.includes(q.name)&&text.includes(q.acceptedAnswer.text)),url+' schema matches visible FAQ');
  const md=await request(url,{accept:'text/markdown'});
  check(md.status===200&&md.headers['Content-Type'].startsWith('text/markdown'),url+' negotiates Markdown');
  check(md.body.toString().includes(config.phoneDisplay)&&!md.body.toString().includes('<form'),url+' Markdown public content');
  check(md.headers.Vary.includes('Accept')&&html.headers.Vary.includes('Accept'),url+' varies both representations');
  check(md.headers.Link.includes(url+'index.md')&&html.headers.Link.includes('/llms.txt'),url+' resource headers');
  check(text.includes('rel="alternate" type="text/markdown" href="index.md"'),url+' discoverable alternate');
  check(llms.includes(config.domain+url+'index.md')&&sitemap.includes('<loc>'+config.domain+url+'</loc>'),url+' resource manifests');
  check(sitemap.includes('<lastmod>'+config.lastModified[route]+'</lastmod>'),url+' configured content modification date');
}
const home=(await request('/')).body;
for(const encoding of ['br','gzip']){
  const result=await request('/',{'accept-encoding':encoding});
  check(result.headers['Content-Encoding']===encoding,encoding+' supported');
  const decoded=encoding==='br'?brotliDecompressSync(result.body):gunzipSync(result.body);
  check(decoded.equals(home)&&result.body.length<home.length/2,encoding+' lossless and smaller');
}
check(!(await request('/',{'accept-encoding':'br;q=0, gzip;q=0'})).headers['Content-Encoding'],'Disabled compression honored');
for(const accept of ['*/*','text/html','text/markdown;q=0','text/html;q=1, text/markdown;q=0.2']){
  check((await request('/',{accept})).headers['Content-Type'].startsWith('text/html'),'HTML preference: '+accept);
}
const css=await request('/assets/site.css?v=test');
check(css.headers['Cache-Control']==='public, max-age=604800','Asset cache enabled');
check((await request('/assets/site.css?v=test',{'if-none-match':css.headers.ETag})).status===304,'Conditional requests return 304');
check((await request('/')).headers['Cache-Control']==='no-cache','HTML revalidates');
const head=await request('/',{},'HEAD');
check(head.status===200&&!head.body&&head.headers['Content-Length']===home.length,'HEAD returns headers only');
check((await request('/inexistente/')).status===404,'Missing route is 404');
check((await request('/.htaccess')).status===403,'Server rules not exposed');
check((await request('/',{},'POST')).status===405,'Unsupported methods rejected');
check((await request('/llms.txt')).headers['Content-Type'].startsWith('text/plain'),'llms served as text');
check((await request('/sobre/index.md')).headers['X-Robots-Tag']==='noindex','Markdown duplicates excluded from search');
const robots=await fs.readFile(new URL('robots.txt',out),'utf8');
check(robots.includes('Content-Signal: search=yes, ai-input=yes, ai-train=no')&&robots.includes('Allow: /'),'Search and AI input allowed');
console.log(`Discovery and HTTP: ${checks} checks passed. Output: ${fileURLToPath(out)}`);
