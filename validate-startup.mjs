import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Reproduce a host that imports the entry module instead of running its file.
const probe=http.createServer();
await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(0,'127.0.0.1',resolve)});
const port=probe.address().port;
await new Promise(resolve=>probe.close(resolve));
const env={...process.env,PORT:String(port)};
delete env.HOST;
const child=spawn(process.execPath,['--input-type=module','-e',`
  const {server}=await import('./server.mjs');
  function ready(){console.log('STARTUP_READY '+JSON.stringify(server.address()))}
  if(server.listening)ready();else server.once('listening',ready);
`],{cwd:fileURLToPath(new URL('.',import.meta.url)),env,stdio:['ignore','pipe','pipe'],windowsHide:true});
let output='',errors='';
try{
  const address=await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('Startup timed out. '+errors)),8000);
    function cleanup(){clearTimeout(timeout)}
    child.on('error',error=>{cleanup();reject(error)});
    child.on('exit',(code)=>{cleanup();reject(new Error('Process exited before listening: '+code+' '+errors))});
    child.stderr.on('data',chunk=>{errors+=chunk});
    child.stdout.on('data',chunk=>{
      output+=chunk;
      const match=output.match(/STARTUP_READY (\{[^\n]+\})/);
      if(match){cleanup();resolve(JSON.parse(match[1]))}
    });
  });
  assert.equal(address.port,port,'Startup respects PORT');
  assert.equal(address.address,'0.0.0.0','Default bind accepts hosting proxy traffic');
  assert.match(output,/Mix Alimentos: porta/,'Startup callback completed');
  console.log('Startup: 3 checks passed, including import by a hosting wrapper.');
}finally{
  if(child.exitCode===null){await new Promise(resolve=>{child.once('exit',resolve);child.kill()})}
}
