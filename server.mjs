import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public_html');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
export async function handler(req,res){try{const url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}let st=await fs.stat(file).catch(()=>null);if(st?.isDirectory()){if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'+url.search});res.end();return}file=path.join(file,'index.html');st=await fs.stat(file).catch(()=>null)}if(!st?.isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await fs.readFile(path.join(root,'404.html')));return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file))}catch{res.writeHead(400);res.end('Requisição inválida')}}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=http.createServer(handler);server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Mix Alimentos: http://127.0.0.1:'+server.address().port));}
