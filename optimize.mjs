import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Conservative whitespace compaction: preserve JS newlines and ASI semantics.
export const compactJs=code=>code.split(/\r?\n/).map(line=>line.trim()).filter(line=>line&&!line.startsWith('//')).join('\n');
export const compactCss=code=>code.replace(/\/\*[\s\S]*?\*\//g,'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean).join('');
export async function assetVersion(root){const content=await Promise.all(['site.css','site.js','agent-tools.js'].map(f=>fs.readFile(path.join(root,'assets',f),'utf8')));return createHash('sha256').update(content.join('\n')).digest('hex').slice(0,12)}
export async function optimizePublic(out){
  const files=['site.css','site.js','agent-tools.js'];
  const report=[];
  for(const name of files){const file=path.join(out,'assets',name);const original=await fs.readFile(file,'utf8');const compact=name.endsWith('.css')?compactCss(original):compactJs(original);await fs.writeFile(file,compact);report.push({file:name,before:Buffer.byteLength(original),after:Buffer.byteLength(compact)});}
  // Original PNG remains in the working files. Public pages use the lighter WebP.
  await fs.unlink(path.join(out,'assets','logo.png')).catch(e=>{if(e.code!=='ENOENT')throw e});
  return report;
}
