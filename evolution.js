'use strict';
(function(){
  const defs=[
    {key:'flex',name:'Flexões',goal:55,ref:42,stretch:60,unit:'reps',color:'#67c7f2'},
    {key:'abdClass',name:'Abdominais ACADEPOL',goal:50,ref:40,stretch:55,unit:'reps',color:'#9e95ff'},
    {key:'squat',name:'Agachamentos',goal:70,ref:42,stretch:75,unit:'reps',color:'#61d8ae'},
    {key:'cooper',name:'Cooper · 12 minutos',goal:2700,ref:2200,stretch:2800,unit:'m',color:'#ffc477'}
  ];
  const $=id=>document.getElementById(id);
  const escapeHtml=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asNumber=v=>(v===null||v===undefined||String(v).trim()==='')?null:(Number.isFinite(Number(v))?Number(v):null);
  const rounded=x=>Math.round(x).toLocaleString('pt-BR');
  const dateLabel=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)?s.slice(8,10)+'/'+s.slice(5,7)+'/'+s.slice(0,4):String(s||'');
  const isoLocal=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const addDays=(d,days)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);x.setDate(x.getDate()+days);return x;};
  const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''));
  const logs=()=>{try{return(window.TAF_BRIDGE?.getLogs()||[]).filter(x=>x&&validDate(x.date))}catch(e){return[]}};
  const readings=(rows,key)=>rows.map((r,index)=>({date:r.date,value:asNumber(r[key]),index,kind:r.type})).filter(x=>x.value!==null&&x.value>=0).sort((a,b)=>a.date.localeCompare(b.date)||a.index-b.index);
  const pretty=(x,d)=>rounded(x)+' '+d.unit;
  function progressCard(d,measurements){
    const last=measurements.length?measurements[measurements.length-1]:null;
    const best=measurements.length?measurements.reduce((a,b)=>b.value>a.value?b:a):null;
    const ratio=last?Math.max(0,Math.min(100,100*last.value/d.goal)):0;
    const gap=last?Math.max(0,d.goal-last.value):null;
    const margin=last?last.value-d.ref:null;
    const flag=last?(margin>=0?'Acima da referência +'+rounded(margin):'Abaixo da referência por '+rounded(-margin)):'Referência sem medição';
    return '<article class="evo-goal-card">'+
      '<div class="evo-card-top"><h3>'+escapeHtml(d.name)+'</h3><span class="evo-target">Meta '+pretty(d.goal,d)+'</span></div>'+
      '<div class="evo-big">'+(last?pretty(last.value,d):'—')+'</div>'+
      '<div class="evo-small">'+(last?'Último registro: '+dateLabel(last.date):'Sem medição registrada')+'</div>'+
      '<div class="evo-bar" role="progressbar" aria-label="Progresso para meta de '+escapeHtml(d.name)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(ratio)+'"><span style="width:'+ratio.toFixed(1)+'%;background:'+d.color+'"></span></div>'+
      '<div class="evo-stats"><span>'+(last?rounded(Math.round(1000*last.value/d.goal)/10)+'% da meta':'Meta pendente')+'</span><span>'+(gap===null?'Sem distância calculável':gap===0?'Meta alcançada':'Faltam '+pretty(gap,d))+'</span></div>'+
      '<div class="evo-ref">'+escapeHtml(flag)+' · Melhor registro: <strong>'+(best?pretty(best.value,d)+' ('+dateLabel(best.date)+')':'—')+'</strong></div>'+
      '</article>';
  }
  function chart(d,measurements){
    const recent=measurements.slice(-30);
    if(recent.length===0)return '<div class="evo-empty">Nenhuma medição registrada para esta prova. Use a aba <strong>Registrar</strong> e preencha o campo do teste.</div>';
    const width=660,height=244,left=55,right=23,top=20,bottom=47,plotWidth=width-left-right,plotHeight=height-top-bottom;
    const all=[...recent.map(x=>x.value),d.goal,d.ref,d.stretch];
    const min=Math.min(...all),max=Math.max(...all);
    const spread=Math.max(8,max-min);
    const low=Math.max(0,Math.floor((min-spread*0.13)/5)*5);
    const high=Math.ceil((max+spread*0.13)/5)*5;
    const scaleY=v=>top+(high-v)/(high-low)*plotHeight;
    const scaleX=i=>left+(recent.length===1?plotWidth/2:(i/(recent.length-1))*plotWidth);
    let parts=['<svg class="evo-svg" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Histórico de '+escapeHtml(d.name)+', '+recent.length+' medições">'];
    for(let i=0;i<5;i++){
      const y=top+(i/4)*plotHeight,v=high-(i/4)*(high-low);
      parts.push('<line x1="'+left+'" x2="'+(width-right)+'" y1="'+y+'" y2="'+y+'" stroke="#324960" stroke-dasharray="3 5"/>');
      parts.push('<text x="'+(left-9)+'" y="'+(y+4)+'" text-anchor="end" fill="#afc1d7" font-size="12">'+rounded(v)+'</text>');
    }
    const referenceY=scaleY(d.ref),goalY=scaleY(d.goal);
    parts.push('<line x1="'+left+'" x2="'+(width-right)+'" y1="'+referenceY+'" y2="'+referenceY+'" stroke="#829cba" stroke-width="1.3" stroke-dasharray="5 4"/>');
    parts.push('<line x1="'+left+'" x2="'+(width-right)+'" y1="'+goalY+'" y2="'+goalY+'" stroke="'+d.color+'" stroke-width="1.4" stroke-dasharray="6 5"/>');
    parts.push('<text x="'+(width-right-5)+'" y="'+(goalY-5)+'" text-anchor="end" fill="'+d.color+'" font-size="11">Meta '+rounded(d.goal)+'</text>');
    parts.push('<polyline fill="none" stroke="'+d.color+'" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" points="'+recent.map((x,i)=>scaleX(i)+','+scaleY(x.value)).join(' ')+'"/>');
    for(let i=0;i<recent.length;i++){
      const x=recent[i],last=i===recent.length-1,r=last?5.5:3.5;
      parts.push('<circle cx="'+scaleX(i)+'" cy="'+scaleY(x.value)+'" r="'+r+'" fill="'+d.color+'" stroke="#0e1e31" stroke-width="2"><title>'+dateLabel(x.date)+': '+pretty(x.value,d)+'</title></circle>');
    }
    parts.push('<text x="'+left+'" y="'+(height-13)+'" fill="#b2c5d8" font-size="12">'+dateLabel(recent[0].date)+'</text>');
    parts.push('<text x="'+(width-right)+'" y="'+(height-13)+'" text-anchor="end" fill="#b2c5d8" font-size="12">'+dateLabel(recent[recent.length-1].date)+'</text>');
    parts.push('</svg>');
    return parts.join('')+'<p class="evo-small">'+recent.length+' mediç'+(recent.length===1?'ão':'ões')+(measurements.length>30?' (últimas 30 exibidas)':'')+' · linha pontilhada: meta principal · os protocolos devem ser comparáveis.</p>';
  }
  function recordRow(d,m){
    if(!m.length)return'<tr><td>'+escapeHtml(d.name)+'</td><td>—</td><td>—</td><td>—</td><td>Sem medição</td></tr>';
    const best=m.reduce((a,b)=>b.value>a.value?b:a);
    const latest=m[m.length-1];
    const delta=latest.value-best.value;
    return '<tr><td><strong>'+escapeHtml(d.name)+'</strong></td><td>'+pretty(best.value,d)+'</td><td>'+dateLabel(best.date)+'</td><td>'+pretty(latest.value,d)+'</td><td>'+(best.value>=d.goal?'Meta atingida em algum registro':'Faltam '+pretty(d.goal-best.value,d)+' para a meta')+'</td></tr>';
  }
  function sumKm(rows){return rows.reduce((total,l)=>total+Math.max(0,asNumber(l.km)||0)+Math.max(0,asNumber(l.courseKm)||0),0);}
  function loadDashboard(rows){
    const today=new Date(),since=isoLocal(addDays(today,-6)),before=isoLocal(addDays(today,-13)),pastUntil=isoLocal(addDays(today,-7)),until=isoLocal(today);
    const current=rows.filter(l=>l.date>=since&&l.date<=until),prior=rows.filter(l=>l.date>=before&&l.date<=pastUntil);
    const nowKm=sumKm(current),priorKm=sumKm(prior);
    const ratio=priorKm>0?Math.round((nowKm/priorKm-1)*100):null;
    const painLogs=current.filter(x=>['knee','shoulder','back'].some(k=>(asNumber(x[k])||0)>=4)||String(x.pain24||'').trim().toLowerCase()==='sim');
    const sensitive=current.filter(x=>['knee','shoulder','back'].some(k=>(asNumber(x[k])||0)===3));
    const intense=current.filter(x=>x.type!=='descanso'&&(asNumber(x.rpe)||0)>=8);
    const suggestions=[];
    if(!current.length)suggestions.push({kind:'neutral',title:'Sem registros recentes',body:'Não é possível avaliar a carga da última semana. Ausência de registros não significa descanso.'});
    if(painLogs.length)suggestions.push({kind:'high',title:'Sintomas merecem atenção',body:painLogs.length+' registro(s) nos últimos 7 dias com dor ≥4/10 ou piora em 24 h. Reduza/suspenda o estímulo que provoca sintomas e procure avaliação profissional se persistirem ou houver sinais de alerta.'});
    else if(sensitive.length)suggestions.push({kind:'medium',title:'Monitore o desconforto',body:sensitive.length+' registro(s) com dor 3/10. Ajuste o estímulo provocativo e acompanhe a resposta nas 24 h seguintes.'});
    if(priorKm>0&&current.length&&prior.length&&ratio!==null&&ratio>30)suggestions.push({kind:'medium',title:'Aumento de quilômetros registrados',body:'A quilometragem dos últimos 7 dias está '+ratio+'% acima dos 7 anteriores. Comparação descritiva, não um limiar clínico; confirme também treinos não registrados e evite aumentar carga sem recuperação.'});
    if(intense.length>=2)suggestions.push({kind:'medium',title:'Várias sessões intensas',body:intense.length+' registros com RPE ≥8/10 nesta semana. Considere a intensidade da ACADEPOL antes de adicionar outro estímulo forte.'});
    if(current.length>0&&current.length<3)suggestions.push({kind:'neutral',title:'Histórico semanal incompleto',body:'Há apenas '+current.length+' registro(s) nesta semana. Não use esses números isolados para decidir quanto aumentar o treino.'});
    if(!suggestions.length)suggestions.push({kind:'neutral',title:'Nenhum gatilho nos registros recentes',body:'Isso não significa ausência de risco; mantenha o acompanhamento de sono, sintomas e treinos oficiais não registrados.'});
    const cards=suggestions.map(s=>'<div class="evo-alert '+s.kind+'"><strong>'+escapeHtml(s.title)+'</strong><p>'+escapeHtml(s.body)+'</p></div>').join('');
    $('evoAlerts').innerHTML=cards;
    $('evoLoadStats').innerHTML=
      '<div class="evo-stat"><span>Corrida últimos 7 dias</span><strong>'+nowKm.toLocaleString('pt-BR',{maximumFractionDigits:1})+' km</strong></div>'+
      '<div class="evo-stat"><span>7 dias anteriores</span><strong>'+(prior.length?priorKm.toLocaleString('pt-BR',{maximumFractionDigits:1})+' km':'Sem base suficiente')+'</strong></div>'+
      '<div class="evo-stat"><span>Registros / última semana</span><strong>'+current.length+'</strong></div>'+
      '<div class="evo-stat"><span>RPE ≥8/10 / última semana</span><strong>'+intense.length+'</strong></div>';
    const start=addDays(today,-today.getDay()+1-7*7+(today.getDay()===0?-7:0));
    const buckets=[];
    for(let i=0;i<8;i++){
      const begin=isoLocal(addDays(start,i*7)),end=isoLocal(addDays(start,i*7+6));
      const batch=rows.filter(l=>l.date>=begin&&l.date<=end);
      buckets.push({start:begin,km:sumKm(batch),count:batch.length});
    }
    const maximum=Math.max(1,...buckets.map(b=>b.km));
    $('evoLoadBars').innerHTML=buckets.map(b=>{
      const h=b.count?Math.max(4,b.km/maximum*100):2;
      return '<div class="evo-week"><div class="evo-week-value">'+(b.count?b.km.toLocaleString('pt-BR',{maximumFractionDigits:1}):'—')+'</div>'+
       '<div class="evo-column-track"><div class="evo-column '+(b.count?'':'missing')+'" style="height:'+h.toFixed(1)+'%"></div></div>'+
       '<div class="evo-week-label">'+dateLabel(b.start).slice(0,5)+'</div></div>';
    }).join('');
  }
  function dateWindow(){
    const p=window.TAF_BRIDGE?.getPrefs()||{};
    const target=p.testConfirmed&&validDate(p.examDate)?p.examDate:null;
    const today=new Date();const nowDate=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
    const diff=s=>Math.ceil((Date.parse(s+'T12:00:00Z')-12*3600000-nowDate)/86400000);
    if(target){
      const n=diff(target);
      $('evoCountdown').textContent=n>0?n+' dias até '+dateLabel(target):n===0?'TAF confirmado para hoje':'TAF confirmado em '+dateLabel(target)+' (data passada)';
      return;
    }
    const first=diff('2027-02-01'),last=diff('2027-02-28');
    $('evoCountdown').textContent=last<0?'A janela prevista de fevereiro/2027 terminou; atualize a data':first>0?'Janela prevista: em '+first+'–'+last+' dias': 'Janela prevista: fevereiro/2027 · data exata não confirmada';
  }
  function render(){
    if(!$('evoGoalGrid')||!window.TAF_BRIDGE)return;
    const source=logs();
    const metrics=defs.map(d=>({def:d,data:readings(source,d.key)}));
    $('evoGoalGrid').innerHTML=metrics.map(x=>progressCard(x.def,x.data)).join('');
    $('evoCharts').innerHTML=metrics.map(x=>'<article class="evo-chart-card"><div class="evo-chart-heading"><h3>'+escapeHtml(x.def.name)+'</h3><span>'+escapeHtml(x.def.unit)+'</span></div>'+chart(x.def,x.data)+'</article>').join('');
    $('evoRecords').innerHTML=metrics.map(x=>recordRow(x.def,x.data)).join('');
    const pull=readings(source,'pull');
    $('evoBarra').textContent=pull.length?'Barra pronada · melhor registro: '+pretty(Math.max(...pull.map(x=>x.value)),{unit:'reps'})+'; último: '+rounded(pull[pull.length-1].value)+' reps.':'Barra pronada · sem registro atual; avalie separadamente quando estiver recuperado.';
    $('evoCoverage').textContent=source.length?source.length+' registros locais ou sincronizados considerados; medições apenas quando os respectivos campos foram preenchidos.':'Nenhum registro ainda. Importe seu CSV particular ou registre testes na aba Registrar.';
    dateWindow();loadDashboard(source);
  }
  window.tafRefreshEvolution=render;
  document.querySelectorAll('[data-tab="evolucao"]').forEach(n=>n.addEventListener('click',render));
  document.getElementById('examDate')?.addEventListener('change',render);
  document.getElementById('testConfirmed')?.addEventListener('change',render);
  render();
})();
