const path=require('node:path');
const fs=require('node:fs');
function resolveTool(name){
  try{return require.resolve(name)}
  catch{return require.resolve(name,{paths:[path.resolve(__dirname,'../Skills Diretor de Marketing/kit-sites-profissionais')]})}
}
function browserOptions(){
  const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
  return process.platform==='win32'&&fs.existsSync(chrome)?{executablePath:chrome,headless:true}:{headless:true};
}
module.exports={resolveTool,browserOptions};
