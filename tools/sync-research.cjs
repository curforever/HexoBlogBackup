'use strict';
// Fetch only public, explicitly versioned research material; ordinary builds stay offline.
const fs=require('fs'),path=require('path'),https=require('https');
require('dns').setDefaultResultOrder('ipv4first');
const root=path.resolve(__dirname,'..'),repository='curforever/curforever';
const args=process.argv.slice(2);
if(args.length&&!(args.length===2&&args[0]==='--ref'))throw Error('Usage: npm run sync:research -- --ref <commit-or-branch>');
const ref=args[1]||'main';
if(!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,120}$/.test(ref)||ref.includes('..'))throw Error('Invalid Git reference');
function download(url,accept){return new Promise((resolve,reject)=>{
 const request=https.get(url,{headers:{'User-Agent':'curforever-research-sync','Accept':accept}},response=>{
  if(response.statusCode!==200){response.resume();reject(Error('HTTP '+response.statusCode+' for '+url));return;}
  const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('end',()=>resolve(Buffer.concat(chunks)));response.on('error',reject);
 });request.on('error',reject);request.setTimeout(30000,()=>request.destroy(Error('Download timeout for '+url)));
});}
async function get(url,accept='application/vnd.github+json'){
 for(let attempt=0;attempt<3;attempt++){
  try{return await download(url,accept);}catch(error){
   if(attempt===2||/^HTTP (?!5)/.test(error.message))throw error;
   await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
  }
 }
}
(async()=>{
 const commit=JSON.parse((await get('https://api.github.com/repos/'+repository+'/commits/'+encodeURIComponent(ref))).toString()).sha;
 if(!/^[0-9a-f]{40}$/.test(commit))throw Error('Invalid resolved commit');
 const base='https://api.github.com/repos/'+repository+'/contents/research/';
 const publicFile=name=>get(base+name+'?ref='+commit,'application/vnd.github.raw+json');
 const manifest=await publicFile('assets/sources.json'),sources=JSON.parse(manifest.toString());
 const names=sources.figures.map(f=>f.file);
 if(names.length!==15||new Set(names).size!==15||names.some(n=>!/^[a-z0-9-]+\.png$/.test(n)))throw Error('Unexpected figure manifest');
 const files=[['content/research/README.md',await publicFile('README.md')],['content/research/README.en.md',await publicFile('README.en.md')],['source/images/research/sources.json',manifest]];
 for(let n=0;n<names.length;n+=4){
  const batch=await Promise.all(names.slice(n,n+4).map(async name=>{
   const data=await publicFile('assets/'+name);if(data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG: '+name);
   return ['source/images/research/'+name,data];
  }));files.push(...batch);
 }
 // Complete all downloads before touching tracked inputs.
 for(const [rel,data] of files){const dest=path.join(root,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);}
 fs.writeFileSync(path.join(root,'content/research/source-version.json'),JSON.stringify({repository,commit,figures:names.length},null,2)+'\n');
 console.log('Synced 15 original figures and bilingual Markdown from '+commit);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
