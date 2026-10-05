let scenes=[],current=0,imgs=[];
const $=id=>document.getElementById(id);
function splitScript(t){
  let paras=t.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  if(paras.length<2) paras=t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[];
  let out=[];
  for(const p of paras){let s=p.trim(); while(s.length>220){let cut=s.lastIndexOf(" ",220);if(cut<80)cut=220;out.push(s.slice(0,cut).trim());s=s.slice(cut).trim()} if(s)out.push(s)}
  return out;
}
function show(i){
 current=i; $('stageText').textContent=scenes[i]||"Sem cena";
 document.querySelectorAll('.scene').forEach((x,n)=>x.classList.toggle('active',n===i));
 if(imgs[i]){
   $('stage').style.background=`linear-gradient(#0007,#0009),url("${imgs[i]}") center/cover`;
 }else $('stage').style.background='radial-gradient(circle at 70% 20%,#12375a,#050b13 65%)';
}
$('images').onchange=e=>{imgs=[...e.target.files].map(URL.createObjectURL);if(scenes.length)show(current)}
$('analyze').onclick=()=>{
 scenes=splitScript($('script').value); $('count').textContent=`${scenes.length} cenas`;
 $('scenes').innerHTML=scenes.map((s,i)=>`<div class="scene" data-i="${i}"><b>Cena ${i+1}</b><br>${s.slice(0,110)}${s.length>110?'…':''}</div>`).join('');
 document.querySelectorAll('.scene').forEach(x=>x.onclick=()=>show(+x.dataset.i));
 show(0); $('status').textContent='Roteiro analisado';
}
$('voice').onclick=()=>{
 if(!scenes.length) $('analyze').click();
 speechSynthesis.cancel(); let u=new SpeechSynthesisUtterance(scenes[current]||$('script').value);
 u.lang='pt-BR';u.rate=.96;u.pitch=1; speechSynthesis.speak(u); $('status').textContent='Reproduzindo voz do navegador';
}
$('format').onchange=()=>{$('stage').style.aspectRatio=$('format').value==='9:16'?'9/16':'16/9'}
$('save').onclick=()=>{
 const data={app:"IA na Prática Studio Web",version:1,title:$('title').value,format:$('format').value,style:$('style').value,script:$('script').value,scenes};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='projeto-ia-studio.json';a.click();URL.revokeObjectURL(a.href);
 $('status').textContent='Projeto salvo';
}