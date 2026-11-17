import fs from 'node:fs/promises';
import config from './site.config.mjs';
import {createAgentTools} from './agent-tools.mjs';

const protocolVersion='2025-11-25';
const serverInfo={name:'mix-alimentos',title:'Mix Alimentos',version:'1.0.0'};
const capabilities={tools:{}};
const cardPaths=new Set(['/.well-known/mcp/server-card.json','/.well-known/mcp.json','/mcp/server-card']);
let toolsPromise;
const tools=()=>toolsPromise??=fs.readFile(new URL('./public_html/assets/agent-data.json',import.meta.url),'utf8').then(raw=>createAgentTools(JSON.parse(raw)));
const origins=new Set([config.domain,'http://127.0.0.1:4173','http://localhost:4173']);
const quotas=new Map();
function json(res,status,body,headers={}){
  const bytes=JSON.stringify(body);
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(bytes);
}
const rpcError=(res,id,code,message,status=200)=>json(res,status,{jsonrpc:'2.0',id,error:{code,message}});
export async function handleMcp(req,res,pathname){
  if(!cardPaths.has(pathname)&&pathname!=='/mcp')return false;
  if(req.headers?.origin&&!origins.has(req.headers.origin)){json(res,403,{error:'Origem não autorizada.'});return true}
  if(cardPaths.has(pathname)){
    if(!['GET','HEAD'].includes(req.method||'GET')){json(res,405,{error:'Use GET.'},{Allow:'GET, HEAD'});return true}
    const card={name:serverInfo.name,version:'1.0',protocolVersion,serverInfo,description:'Consulta pública de produtos, área de entrega e preparação de cotações da Mix Alimentos. Sem pedidos ou mensagens automáticas.',transport:{type:'streamable-http',endpoint:config.domain+'/mcp'},capabilities,authentication:{required:false},documentationUrl:config.domain+'/contato/',tools:(await tools()).map(({execute,...definition})=>definition)};
    if(req.method==='HEAD'){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-cache'});res.end()}else json(res,200,card);
    return true;
  }
  if(req.method!=='POST'){json(res,405,{error:'Use POST para JSON-RPC. Este servidor não oferece um fluxo SSE.'},{Allow:'POST'});return true}
  const ip=req.socket?.remoteAddress||'unknown';const now=Date.now();
  if(quotas.size>1000)for(const [key,value] of quotas)if(value.expires<=now)quotas.delete(key);
  const quota=quotas.get(ip);
  if(quota&&quota.expires>now){if(++quota.count>60){json(res,429,{error:'Muitas solicitações. Tente em um minuto.'},{'Retry-After':'60'});return true}}
  else {if(quotas.size>=1000){json(res,503,{error:'Tente novamente em instantes.'});return true}quotas.set(ip,{count:1,expires:now+60000})}
  if(!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type']||'')){json(res,415,{error:'Use Content-Type: application/json.'});return true}
  const accept=String(req.headers?.accept||'');
  if(!accept.includes('application/json')||!accept.includes('text/event-stream')){json(res,406,{error:'Accept deve incluir application/json e text/event-stream.'});return true}
  let message;
  try{
    let length=0;const chunks=[];
    for await(const chunk of req){const bytes=Buffer.from(chunk);length+=bytes.length;if(length>65536){json(res,413,{error:'Solicitação muito grande.'});return true}chunks.push(bytes)}
    message=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }catch{rpcError(res,null,-32700,'JSON inválido.',400);return true}
  if(!message||Array.isArray(message)||message.jsonrpc!=='2.0'||typeof message.method!=='string'||('id'in message&&typeof message.id!=='string'&&typeof message.id!=='number')){rpcError(res,null,-32600,'Requisição JSON-RPC inválida.',400);return true}
  if(message.params!==undefined&&(!message.params||typeof message.params!=='object'||Array.isArray(message.params))){rpcError(res,message.id??null,-32602,'Parâmetros inválidos.',400);return true}
  const {method,id,params={}}=message;
  if(method!=='initialize'&&req.headers?.['mcp-protocol-version']!==protocolVersion){rpcError(res,id??null,-32600,'Versão suportada: '+protocolVersion,400);return true}
  if(id===undefined){res.writeHead(202,{'Cache-Control':'no-store'});res.end();return true}
  let result;
  if(method==='initialize'){
    if(typeof params.protocolVersion!=='string'||!params.clientInfo||typeof params.clientInfo.name!=='string'||!params.capabilities){rpcError(res,id,-32602,'Informe protocolVersion, capabilities e clientInfo.');return true}
    result={protocolVersion,serverInfo,capabilities,instructions:'Ferramentas públicas de consulta. Prepare a cotação para revisão humana. Nenhuma chamada envia mensagens, reserva produtos ou confirma compras.'};
  }else if(method==='ping')result={};
  else if(method==='tools/list')result={tools:(await tools()).map(({execute,...definition})=>definition)};
  else if(method==='tools/call'){
    const tool=(await tools()).find(t=>t.name===params.name);
    if(!tool){rpcError(res,id,-32602,'Ferramenta desconhecida.');return true}
    try{const data=tool.execute(params.arguments??{});result={content:[{type:'text',text:JSON.stringify(data)}],structuredContent:data,isError:false}}
    catch(error){result={content:[{type:'text',text:error.message}],isError:true}}
  }else {rpcError(res,id,-32601,'Método não encontrado.');return true}
  json(res,200,{jsonrpc:'2.0',id,result});return true;
}
