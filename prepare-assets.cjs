const fs=require('node:fs/promises');
const path=require('node:path');
const {resolveTool,browserOptions}=require('./dev-tools.cjs');
const {chromium}=require(resolveTool('playwright'));
(async()=>{
const browser=await chromium.launch(browserOptions());
const page=await browser.newPage();
const assets=path.join(__dirname,'assets');await fs.mkdir(assets,{recursive:true});
const source=path.resolve(__dirname,'../Identidade Visual');
for(const [name,file] of [['ovos','Seis bandejas de ovos verde-floresta.png'],['codorna','Sachê Yamatsu de ovos de codorna.png'],['batata','Pacote Mussa de batata palha.png'],['composicao','Composição de Ovos, Batata Palha e Conservas.png']]){
 const bytes=await fs.readFile(path.join(source,'Produtos',file));
 for(const size of [480,900]){const data=await page.evaluate(async({src,size})=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=size;c.height=size;const ctx=c.getContext('2d');ctx.drawImage(im,0,0,size,size);return c.toDataURL('image/webp',.80).split(',')[1]},{src:'data:image/png;base64,'+bytes.toString('base64'),size});await fs.writeFile(path.join(assets,`${name}-${size}.webp`),Buffer.from(data,'base64'))}
}
const logo=await fs.readFile(path.join(source,'Logo','Logo Mix Alimentos verde transparente.png'));
const result=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const pix=ctx.getImageData(0,0,c.width,c.height).data;let minX=c.width,minY=c.height,maxX=0,maxY=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){let i=(y*c.width+x)*4;if(pix[i+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}}const out=document.createElement('canvas');out.width=700;out.height=Math.round(700*(maxY-minY+1)/(maxX-minX+1));out.getContext('2d').drawImage(im,minX,minY,maxX-minX+1,maxY-minY+1,0,0,out.width,out.height);return {data:out.toDataURL().split(',')[1],w:out.width,h:out.height,bounds:[minX,minY,maxX,maxY]}},'data:image/png;base64,'+logo.toString('base64'));
await fs.writeFile(path.join(assets,'logo.png'),Buffer.from(result.data,'base64'));console.log('Logo bounds',result.bounds,'size',result.w,result.h);
const compactLogo=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=400;c.height=208;c.getContext('2d').drawImage(im,0,0,400,208);return c.toDataURL('image/webp',.92).split(',')[1]},'data:image/png;base64,'+result.data);
await fs.writeFile(path.join(assets,'logo.webp'),Buffer.from(compactLogo,'base64'));
const composition=await fs.readFile(path.join(source,'Produtos','Composição de Ovos, Batata Palha e Conservas.png'));
const shareImage=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=1200;c.height=630;const ctx=c.getContext('2d');ctx.fillStyle='#f5f0e6';ctx.fillRect(0,0,1200,630);ctx.drawImage(im,305,15,590,590);return c.toDataURL('image/jpeg',.85).split(',')[1]},'data:image/png;base64,'+composition.toString('base64'));
await fs.writeFile(path.join(assets,'compartilhamento.jpg'),Buffer.from(shareImage,'base64'));
// Favicon: reduced original logo, without redrawing the brand.
const fav=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#f5f0e6';ctx.fillRect(0,0,64,64);ctx.drawImage(im,3,16,58,32);return c.toDataURL().split(',')[1]},'data:image/png;base64,'+result.data);await fs.writeFile(path.join(assets,'favicon.png'),Buffer.from(fav,'base64'));
await browser.close();console.log('Imagens responsivas otimizadas.');
})().catch(e=>{console.error(e);process.exit(1)});
