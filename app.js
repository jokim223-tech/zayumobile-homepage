'use strict';
const plans=window.ZAYUMOBILE_PLANS;
const cfg=window.ZAYUMOBILE_CONFIG;
let network='all';
const chosen=new Set();
const $=s=>document.querySelector(s);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>v.toLocaleString('ko-KR')+'원';
const networkName=p=>p.network+'망 · '+p.generation;
function filtered(){const term=$('#search').value.trim().toLowerCase();const generation=$('#generation').value;const budget=Number($('#budget').value);const sort=$('#sort').value;let result=plans.filter(p=>(network==='all'||p.network===network)&&(generation==='all'||p.generation===generation)&&p.price<=budget&&[p.name,p.data,p.network,p.generation].join(' ').toLowerCase().includes(term));if(sort!=='default')result=result.slice().sort((a,b)=>sort==='asc'?a.price-b.price:b.price-a.price);return result;}
function render(){const result=filtered();$('#count').textContent=`전체 ${plans.length}개 중 ${result.length}개 요금제 · 비교 ${chosen.size}/3`;
$('#cards').innerHTML=result.length?result.map(p=>`<article class="card" data-plan-network="${esc(p.network)}"><span class="tag">${networkName(p)}</span><h3>${esc(p.name)}</h3><div class="price">${money(p.price)} <small>/ 월 · 부가세 포함</small></div><dl><dt>데이터</dt><dd>${esc(p.data)}</dd><dt>통화·문자</dt><dd>${esc(p.voice)}</dd>${p.additionalVoice?`<dt>영상·부가통화</dt><dd>자료상 ${esc(p.additionalVoice)}</dd>`:''}</dl><details><summary>상세 안내 및 원본</summary><p>${esc(p.benefit)}${p.dataPromotionNote?'<br>'+esc(p.dataPromotionNote):''}${p.voiceNote?'<br>'+esc(p.voiceNote):''}</p><a href="assets/${esc(p.source)}" target="_blank" rel="noopener">원본 요금표 ↗</a></details><p class="fine">${esc(p.status)}</p><label class="compare-label"><input type="checkbox" data-compare="${p.id}" ${chosen.has(p.id)?'checked':''}>비교에 담기</label><a class="button" href="#join" data-select-plan="${p.id}" aria-label="${esc(p.network)}망 ${esc(p.name)} 요금제 선택 후 가입 방법 확인">이 요금제 선택 · 가입 방법 보기 →</a></article>`).join(''):'<p class="empty">조건에 맞는 요금제가 없습니다. 검색어나 월요금 상한을 바꿔주세요.</p>';
renderComparison();}
function renderComparison(){const selected=plans.filter(p=>chosen.has(p.id));$('#comparison').hidden=!selected.length;const jump=$('#compare-jump');if(jump){jump.hidden=!selected.length;jump.textContent=`선택한 ${selected.length}개 요금제 비교표 보기 ↓`;}const fields=[['통신망',networkName],['월요금(부가세 포함)',p=>money(p.price)],['데이터',p=>p.data],['추가 데이터 안내',p=>p.dataPromotionNote||'추가 제공 확인 정보 없음'],['통화·문자',p=>p.voice],['영상·부가통화',p=>p.additionalVoice||'제공량 표기 확인 필요'],['통화 추가 안내',p=>p.voiceNote||'별도 확인 안내 없음'],['제휴 혜택',p=>p.benefit]];$('#compare-content').innerHTML=selected.length?`<table><caption>선택한 후불요금제 비교 · 최종 가입 조건 확인 필요</caption><thead><tr><th scope="col">항목</th>${selected.map(p=>`<th scope="col" data-plan-network="${esc(p.network)}"><span class="tag">${networkName(p)}</span><br>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${fields.map(([title,get])=>`<tr><th scope="row">${title}</th>${selected.map(p=>`<td data-plan-network="${esc(p.network)}">${esc(get(p))}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'';}
document.querySelectorAll('[data-network]').forEach(b=>b.addEventListener('click',()=>{network=b.dataset.network;document.querySelectorAll('[data-network]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
for(const id of ['search','generation','budget','sort'])$('#'+id).addEventListener(id==='search'?'input':'change',render);
$('#cards').addEventListener('change',e=>{if(!e.target.matches('[data-compare]'))return;const id=e.target.dataset.compare;if(e.target.checked&&chosen.size>=3){e.target.checked=false;$('#status').textContent='비교는 최대 3개까지 선택할 수 있습니다.';return;}$('#status').textContent='';if(e.target.checked)chosen.add(id);else chosen.delete(id);render();});
$('#clear-compare').addEventListener('click',()=>{chosen.clear();render();});
$('#reset').addEventListener('click',()=>{network='all';$('#search').value='';$('#generation').value='all';$('#budget').value='999999';$('#sort').value='default';document.querySelectorAll('[data-network]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.network==='all')));render();});
function attachLink(id,url,label){if(!url)return;let parsed;try{parsed=new URL(url);}catch{return;}if(parsed.protocol!=='https:'&&!(parsed.protocol==='http:'&&parsed.hostname==='pf.kakao.com'))return;const old=$(id),a=document.createElement('a');a.id=old.id;a.className=old.className;a.href=parsed.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;old.replaceWith(a);}
attachLink('#self-link',cfg.selfActivationUrl,'공식 셀프개통 페이지 열기 ↗');attachLink('#kakao-link',cfg.kakaoUrl,'자유모바일 카카오 상담 ↗');render();
if(typeof module!=='undefined')module.exports={filtered,esc};

// Keep the selected plan on this page; never append it to external URLs.
let selectedPlanId=null;
function selectedPlanText(p){return [
'자유모바일 상담 요청',`${networkName(p)} / ${p.name}`,`월 ${money(p.price)} (부가세 포함)`,
`데이터: ${p.data}`,`통화·문자: ${p.voice}`,
p.additionalVoice?`영상·부가통화: ${p.additionalVoice}`:null,
p.dataPromotionNote?`추가 데이터 안내: ${p.dataPromotionNote}`:null,
p.voiceNote?`통화 추가 안내: ${p.voiceNote}`:null,
`제휴 혜택: ${p.benefit}`,'현재 판매 조건과 제휴 혜택을 확인하고 싶습니다.'
].filter(Boolean).join('\n');}
function updateSelectedPlan(id){const p=plans.find(p=>p.id===id);selectedPlanId=p?p.id:null;$('#selected-plan-text').textContent=p?selectedPlanText(p):'요금제 목록에서 ‘이 요금제로 가입 안내’를 누르면 선택 정보가 여기에 표시됩니다.';$('#copy-plan').disabled=!p;$('#clear-plan').hidden=!p;$('#selected-plan').dataset.planNetwork=p?p.network:'';}
$('#cards').addEventListener('click',e=>{const link=e.target.closest('[data-select-plan]');if(link){updateSelectedPlan(link.dataset.selectPlan);$('#status').textContent='선택한 요금제를 확인했습니다. 상담용 정보 복사 또는 공식 셀프개통을 선택하세요.';}});
$('#clear-plan').addEventListener('click',()=>updateSelectedPlan(null));
$('#copy-plan').addEventListener('click',async()=>{const p=plans.find(p=>p.id===selectedPlanId);if(!p)return;try{await navigator.clipboard.writeText(selectedPlanText(p));$('#status').textContent='요금제 정보를 복사했습니다. 카카오 상담창에 붙여넣어 주세요.';}catch{$('#status').textContent='자동 복사가 안 됩니다. 위 선택 요금제 정보를 길게 눌러 직접 복사해 주세요.';}});

const kakaoSelected=$('#selected-kakao-link');
if(kakaoSelected)kakaoSelected.addEventListener('click',async e=>{
 const p=plans.find(x=>x.id===selectedPlanId);
 if(!p){e.preventDefault();$('#status').textContent='먼저 요금제 목록에서 원하는 요금제를 선택해 주세요.';return;}
 try{
  await navigator.clipboard.writeText(selectedPlanText(p));
  $('#status').textContent='선택한 요금제 정보가 복사됐습니다. 카카오 상담창에 붙여넣어 전송해 주세요.';
 }catch{
  $('#status').textContent='자동 복사에 실패했습니다. 상담용 요금제 정보 복사 버튼을 이용하거나 선택 내용을 직접 복사해 주세요.';
 }
});
