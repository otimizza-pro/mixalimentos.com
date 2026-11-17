import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {handler} from './request-handler.mjs';

let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++};
const headers={'content-type':'application/json',accept:'application/json, text/event-stream','mcp-protocol-version':'2025-11-25'};
async function request(path,body,{method='POST',extraHeaders={},raw=false}={}){
  const req=Readable.from(body===undefined?[]:[raw?body:JSON.stringify(body)]);
  Object.assign(req,{url:path,method,headers:{...headers,...extraHeaders},socket:{remoteAddress:'test'}});
  const response={};
  await handler(req,{writeHead(status,h={}){response.status=status;response.headers=h},end(data){response.raw=data;try{response.data=JSON.parse(String(data))}catch{}}});
  return response;
}
const rpc=(method,params={},id=1)=>({jsonrpc:'2.0',id,method,params});
for(const path of ['/.well-known/mcp/server-card.json','/.well-known/mcp.json','/mcp/server-card']){
  const card=await request(path,undefined,{method:'GET'});
  check(card.status===200&&card.data.transport.endpoint==='https://mixalimentos.com/mcp',path+' live dynamic card');
  check(card.data.capabilities.tools&&card.data.tools.length===3,path+' accurate capabilities');
}
check((await request('/mcp',undefined,{method:'GET'})).status===405,'No fake SSE stream');
const init=await request('/mcp',rpc('initialize',{protocolVersion:'2025-11-25',clientInfo:{name:'test',version:'1'},capabilities:{}}));
check(init.status===200&&init.data.result.protocolVersion==='2025-11-25','Initialize negotiates supported protocol');
check((await request('/mcp',{jsonrpc:'2.0',method:'notifications/initialized'})).status===202,'Notifications acknowledged without body');
const listed=await request('/mcp',rpc('tools/list'));
check(listed.data.result.tools.length===3,'Real tools listed');
check(listed.data.result.tools.every(t=>t.inputSchema&&t.annotations.readOnlyHint),'Tool contracts describe read-only behavior');
const call=(name,args)=>request('/mcp',rpc('tools/call',{name,arguments:args}));
const products=await call('mix_list_products',{});
check(products.data.result.structuredContent.products.length===3,'Catalog returns actual products');
const delivery=await call('mix_delivery_area',{city:'barra mansa'});
check(delivery.data.result.structuredContent.listedCity===true,'Delivery city comparison ignores case');
check((await call('mix_delivery_area',{city:'São Paulo'})).data.result.structuredContent.listedCity===false,'Unlisted city is not promised');
const selection={city:'Resende',items:[{product:'ovos-de-galinha',quantity:0.5},{product:'ovos-de-codorna-em-conserva',quantity:3},{product:'batata-palha',quantity:2,unit:'fardo'}]};
const quote=(await call('mix_prepare_quote',selection)).data.result.structuredContent;
check(['meia caixa (6 cartelas, 180 ovos)','3 pacotes','2 fardos','Cidade: Resende'].every(text=>quote.message.includes(text)),'Quote units, half box and city');
check(quote.requiresUserReview&&!quote.orderConfirmed&&quote.whatsappUrl.startsWith('https://wa.me/5524999619682?'),'Quote requires human review, never confirms a sale');
for(const args of [
  {items:[{product:'ovos-de-galinha',quantity:0.25}]},
  {items:[{product:'ovos-de-codorna-em-conserva',quantity:1.5}]},
  {items:[{product:'batata-palha',quantity:-1}]},
  {items:[{product:'batata-palha',quantity:1,unit:'caixa'}]},
  {items:[{product:'batata-palha'},{product:'batata-palha'}]},
  {items:[{product:'inexistente'}]},
  {items:[]},
  {items:[{product:'batata-palha'}],phone:'not-accepted'},
  {items:[{product:'batata-palha'}],city:'x'.repeat(101)}
])check((await call('mix_prepare_quote',args)).data.result.isError,'Invalid tool arguments rejected');
check((await call('missing_tool',{})).data.error.code===-32602,'Unknown tool JSON-RPC error');
check((await request('/mcp',rpc('missing_method'))).data.error.code===-32601,'Unknown method JSON-RPC error');
check((await request('/mcp','{',{raw:true})).data.error.code===-32700,'Invalid JSON parse error');
check((await request('/mcp',[])).status===400,'Batches rejected for pinned protocol');
check((await request('/mcp',rpc('tools/list'),{extraHeaders:{origin:'https://example.invalid'}})).status===403,'Foreign browser origins rejected');
check((await request('/mcp',rpc('tools/list'),{extraHeaders:{'mcp-protocol-version':'unsupported'}})).status===400,'Unsupported protocol rejected');
check((await request('/mcp',rpc('tools/list'),{extraHeaders:{accept:'text/html'}})).status===406,'Transport Accept contract');
check((await request('/mcp',rpc('tools/list'),{extraHeaders:{'content-type':'text/plain'}})).status===415,'Transport Content-Type contract');
check((await request('/mcp','x'.repeat(65537),{raw:true})).status===413,'Body limit enforced');
check((await request('/mcp',rpc('ping'))).data.result!==undefined,'Ping');

// Exercise generated browser registrations without emulating a native browser API.
const script=await fs.readFile(new URL('./public_html/assets/agent-tools.js',import.meta.url),'utf8');
for(const surface of ['document','navigator']){
  const registered=[];const mock={registerTool:tool=>registered.push(tool)};
  vm.runInNewContext(script,{document:surface==='document'?{modelContext:mock}:{},navigator:surface==='navigator'?{modelContext:mock}:{},console});
  check(registered.length===3,surface+' API adapter registers all tools');
  const browserQuote=await registered.find(t=>t.name==='mix_prepare_quote').execute(selection);
  check(JSON.parse(browserQuote.content[0].text).message===quote.message,surface+' browser/server output parity');
}
vm.runInNewContext(script,{document:{},navigator:{},console});check(true,'Graceful fallback without WebMCP');
console.log(`Agent tools and MCP: ${checks} checks passed.`);
