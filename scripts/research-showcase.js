'use strict';
// Offline generation from versioned Markdown, figures and templates.
const fs=require('fs'), path=require('path');
const root=hexo.base_dir;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const escape=text=>String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
hexo.extend.generator.register('research-showcase',function(locals){
 const template=read('templates/research.html'),pages=[];
 for(const english of [false,true]){
  const name=english?'README.en.md':'README.md';
  let body=hexo.render.renderSync({text:read('content/research/'+name).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'),engine:'md'});
  body=body.replace(/(src|href)="\/?assets\//g,'$1="/images/research/').replace(/href="#user-content-/g,'href="#')
   .replace(/href="README.en.md"/g,'href="/research/en/"').replace(/href="README.md"/g,'href="/research/"')
   .replace(/href="\.\.\/README(?:\.en)?\.md"/g,'href="/"').replace('Back to profile','Back to notebook').replace('返回主页','返回博客');
  let figures=0;
  body=body.replace(/<p>(<img\b[^>]*>)<\/p>/g,function(_,img){
   const src=img.match(/src="([^"]+)"/)[1];
   if(!src.startsWith('/images/research/'))throw Error('Unexpected research image: '+src);
   const png=fs.readFileSync(path.join(root,'source',src.slice(1)));
   const width=png.readUInt32BE(16),height=png.readUInt32BE(20),caption=(img.match(/alt="([^"]*)"/)||['',''])[1];
   const loading=figures++===0?'eager':'lazy';
   img=img.replace('<img ','<img width="'+width+'" height="'+height+'" loading="'+loading+'" decoding="async" ');
   return '<figure><a href="'+src+'" target="_blank" rel="noopener" aria-label="'+caption+'">'+img+'</a><figcaption>'+caption+'</figcaption></figure>';
  });
  if(figures!==15)throw Error('Expected 15 figures in '+name+', found '+figures);
  const data=english?{
   LANG:'en',TITLE:'VR Research · curforever',DESCRIPTION:'Task-aware rendering, shared cache reuse and a client–edge system: original figures, results and evaluation scope.',
   CANONICAL:'https://curforever.github.io/research/en/',SKIP:'Skip to content',NAV_LABEL:'Main navigation',ARCHIVES:'Archives',TOPICS:'Topics',RESEARCH:'Research',RESEARCH_URL:'/research/en/',ABOUT:'About',ORIGINALS:'Original figures on GitHub',DISCUSS:'Discuss'
  }:{
   LANG:'zh-CN',TITLE:'VR 研究图解 · curforever',DESCRIPTION:'从眼动任务识别、渲染参数控制到多人共享缓存与端边系统：用原图看懂问题、方法、结果与边界。',
   CANONICAL:'https://curforever.github.io/research/',SKIP:'跳到正文',NAV_LABEL:'主导航',ARCHIVES:'全部归档',TOPICS:'主题分类',RESEARCH:'研究图解',RESEARCH_URL:'/research/',ABOUT:'关于',ORIGINALS:'GitHub 原图与材料',DISCUSS:'交流与反馈'
  };
  const html=template.replace(/\{\{([A-Z_]+)\}\}/g,function(_,key){if(key==='BODY')return body;if(!(key in data))throw Error('Missing template value: '+key);return escape(data[key]);});
  pages.push({path:english?'research/en/index.html':'research/index.html',data:html});
 }
 pages.push({path:'404.html',data:read('templates/404.html')});
 // Preserve old root pagination entry points after moving the list to /notes/.
 const size=Number(hexo.config.index_generator.per_page)||locals.posts.length,total=Math.ceil(locals.posts.length/size);
 for(let page=2;page<=total;page++){
  const target='/notes/page/'+page+'/';
  pages.push({path:'page/'+page+'/index.html',data:'<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url='+target+'"><link rel="canonical" href="https://curforever.github.io'+target+'"><title>文章列表 · curforever</title></head><body><p>文章列表已移至 <a href="'+target+'">新的归档入口</a>。</p></body></html>'});
 }
 return pages;
});
