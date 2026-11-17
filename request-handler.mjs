import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {brotliCompressSync,gzipSync} from 'node:zlib';
import {prefersMarkdown,discoveryLinks} from './discovery.mjs';
import {handleMcp} from './mcp.mjs';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public_html');
const types={'.html':'text/html; charset=utf-8','.md':'text/markdown; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
const representations=new Map();
export async function handler(req,res){
  try{
    const headers=req.headers||{};
    const mcpPath=new URL(req.url,'http://localhost').pathname;
    if(await handleMcp(req,res,mcpPath))return;
    if(req.method&&!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return}
    const url=new URL(req.url,'http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    let file=path.resolve(root,'.'+pathname);
    if((!file.startsWith(root+path.sep)&&file!==root)||path.relative(root,file).split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);res.end();return}
    let st=await fs.stat(file).catch(()=>null);
    if(st?.isDirectory()){
      if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'+url.search});res.end();return}
      file=path.join(file,'index.html');st=await fs.stat(file).catch(()=>null);
    }
    if(!st?.isFile()){
      res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
      res.end(req.method==='HEAD'?undefined:await fs.readFile(path.join(root,'404.html')));return;
    }
    const negotiated=path.extname(file)==='.html'&&path.basename(file)==='index.html';
    if(negotiated&&prefersMarkdown(headers.accept)){
      file=file.replace(/\.html$/,'.md');st=await fs.stat(file);
    }
    const ext=path.extname(file), type=types[ext]||'application/octet-stream';
    let entry=representations.get(file);
    if(!entry||entry.mtime!==st.mtimeMs||entry.size!==st.size){
      const raw=await fs.readFile(file);
      const compressible=/^(text\/|application\/(javascript|json|xml))/.test(type)||ext==='.svg';
      entry={mtime:st.mtimeMs,size:st.size,raw,etag:'"'+createHash('sha256').update(raw).digest('hex').slice(0,24)+'"'};
      if(compressible&&raw.length>1024){entry.br=brotliCompressSync(raw);entry.gzip=gzipSync(raw)}
      representations.set(file,entry);
    }
    const vary=['Accept-Encoding',...(negotiated?['Accept']:[])];
    const responseHeaders={'Content-Type':type,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=604800':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',Vary:vary.join(', '),ETag:entry.etag,'Last-Modified':st.mtime.toUTCString()};
    if(negotiated||ext==='.md')responseHeaders.Link=discoveryLinks(pathname);
    if(ext==='.md')responseHeaders['X-Robots-Tag']='noindex';
    let bytes=entry.raw;
    const accepts=String(headers['accept-encoding']||'').toLowerCase().split(',').map(v=>v.trim());
    const acceptsEncoding=name=>accepts.some(v=>{const [encoding,...params]=v.split(';');return encoding===name&&!params.some(p=>/^q=0(?:\.0*)?$/.test(p.trim()))});
    if(entry.br&&acceptsEncoding('br')){bytes=entry.br;responseHeaders['Content-Encoding']='br'}
    else if(entry.gzip&&acceptsEncoding('gzip')){bytes=entry.gzip;responseHeaders['Content-Encoding']='gzip'}
    if(responseHeaders['Content-Encoding'])responseHeaders.ETag=entry.etag.slice(0,-1)+'-'+responseHeaders['Content-Encoding']+'"';
    if(headers['if-none-match']===responseHeaders.ETag){res.writeHead(304,responseHeaders);res.end();return}
    responseHeaders['Content-Length']=bytes.length;
    res.writeHead(200,responseHeaders);res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(400);res.end('Requisição inválida')}
}
