(() => {
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={page:"overview",tab:"forecast",days:90,mode:"chart",drag:null,offsets:{},events:[
 {id:"ballast",day:12,label:"Ballast Can Co.",kind:"bill",amount:31200,desc:"Nov 12 · 17 days late"},
 {id:"invoice",day:20,label:"Wholesale invoice",kind:"in",amount:42000,desc:"Invoice expected"},
 {id:"payroll",day:29,label:"Payroll",kind:"fixed",amount:28500,desc:"Fixed · payroll"},
 {id:"hops",day:38,label:"Hop supplier",kind:"bill",amount:18400,desc:"Supplier payment"},
 {id:"taproom",day:50,label:"Taproom sales",kind:"in",amount:26500,desc:"Expected deposit"},
 {id:"rent",day:61,label:"Rent",kind:"fixed",amount:12600,desc:"Fixed · rent"},
 {id:"invoice2",day:72,label:"Distributor invoice",kind:"in",amount:38600,desc:"Invoice expected"}
]};
const values=Array.from({length:91},(_,i)=>Math.round(146319 - i*355 + Math.sin(i*.42)*13000 + Math.cos(i*.13)*6500 + (i>13?Math.min(i-13,8)*800:0)));
values[12]=43066;values[26]=64957;values[89]=114504;
const cashPath=(vals,w=720,h=330)=>{const min=0,max=220000;return vals.map((v,i)=>[35+i*(w-55)/(vals.length-1),h-30-(v-min)/(max-min)*(h-55)])};
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),1700)}
function renderMiniChart(){
 const host=$("#overviewChart"),vals=values.slice(0,30),pts=cashPath(vals,520,125);
 const line=pts.map((p,i)=>(i?"L":"M")+p[0]+" "+p[1]).join(" ");
 host.innerHTML=`<svg viewBox="0 0 520 125" preserveAspectRatio="none"><g stroke="#2b372c" stroke-dasharray="2 5">${[25,52,79,106].map(y=>`<path d="M30 ${y}H515"/>`).join("")}</g><path d="${line} L515 112 L30 112Z" fill="#caff35" opacity=".08"/><path d="${line}" fill="none" stroke="#d5e3c8" stroke-width="2"/><path d="M30 80H515" stroke="#f08078" stroke-dasharray="4 4"/><circle cx="${pts[12][0]}" cy="${pts[12][1]}" r="4" fill="#f08078"/></svg>`;
}
function renderWeeks(){
 const data=[[40,30],[52,40],[35,50],[60,42],[44,57],[62,50],[55,42],[72,48]];
 $("#weekBars").innerHTML=data.map((d,i)=>`<div class="week"><div class="week-stack"><i style="height:${d[0]}%"></i><i class="out" style="height:${d[1]}%"></i></div><small>${["8/31","9/7","9/14","9/21","9/28","10/5","10/12","10/19"][i]}</small></div>`).join("");
}
function getX(day){return 35+day*(665/(state.days-1))}
function getY(day){let idx=Math.min(90,Math.max(0,day));let v=values[idx];return 300-(v/220000)*260}
function renderForecast(){
 const svg=$("#cashChart"),grid=$("#gridLines"),area=$("#cashAreaPath"),line=$("#cashLinePath"),buffer=$("#bufferLine"),events=$("#eventLayer"),axis=$("#axisLayer");
 const count=state.days,vals=values.slice(0,count),pts=cashPath(vals);
 const path=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
 line.setAttribute("d",path);area.setAttribute("d",path+` L ${pts.at(-1)[0]} 300 L ${pts[0][0]} 300 Z`);
 let g="";[0,50000,100000,150000,200000].forEach(v=>{let y=300-(v/220000)*260;g+=`<path class="gridline" d="M35 ${y}H700"/><text class="axis-text" x="0" y="${y+3}">$${v===0?"0":v/1000+"k"}</text>`});grid.innerHTML=g;
 const by=300-(60000/220000)*260;buffer.setAttribute("d",`M35 ${by}H700`);
 let ticks= count===30?[0,5,10,15,20,25,29]:count===60?[0,10,20,30,40,50,59]:[0,12,24,36,48,60,72,84,89];
 axis.innerHTML=ticks.map((d,i)=>`<text class="axis-text" x="${35+d*665/(count-1)}" y="320" text-anchor="middle">${d===0?"Today":new Date(2026,9,20+d).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</text>`).join("")+`<text class="buffer-label" x="700" y="${by-6}" text-anchor="end">Buffer $60.0k</text>`;
 events.innerHTML=state.events.filter(e=>e.day<count).map(e=>{
  let d=state.offsets[e.id]??e.day,x=getX(d),y=Math.max(24,getY(d)-15),color=e.kind==="in"?"#d4fa4c":e.kind==="bill"?"#f08078":e.kind==="fixed"?"#a4b6b1":"#79b9d7";
  return `<g class="event-dot" data-id="${e.id}" transform="translate(${x},${y})"><circle r="6.5" fill="${color}"/><circle r="2" fill="#182117"/><text x="0" y="-12" text-anchor="middle">${e.kind==="in"?"+":e.kind==="bill"?"−":"•"} $${(e.amount/1000).toFixed(0)}k</text></g>`;
 }).join("");
 $$("#eventLayer .event-dot").forEach(el=>el.addEventListener("pointerdown",startDrag));
 renderForecastList();
}
function renderForecastList(){
 $("#forecastList").innerHTML=state.events.map(e=>{let day=state.offsets[e.id]??e.day;let dt=new Date(2026,9,20+day).toLocaleDateString("en-US",{month:"short",day:"numeric"});return `<div class="event-row"><div><b>${e.label}</b><br><small>${e.desc}</small></div><small>${dt}</small><b style="color:${e.kind==="in"?"#caff35":e.kind==="bill"?"#f08078":"#d9e1d4"}">${e.kind==="in"?"+":"−"}$${e.amount.toLocaleString("en-US")}</b></div>`}).join("");
}
function startDrag(ev){
 const el=ev.currentTarget,id=el.dataset.id;state.drag={id,startX:ev.clientX,day:state.offsets[id]??state.events.find(x=>x.id===id).day};
 el.classList.add("selected");el.setPointerCapture?.(ev.pointerId);ev.preventDefault();
 const svg=$("#cashChart"),rect=svg.getBoundingClientRect();
 function move(e){
  if(!state.drag)return;const dx=e.clientX-state.drag.startX;const days=Math.round(dx/(rect.width*(665/(state.days-1))/720));let d=Math.max(0,Math.min(state.days-1,state.drag.day+days));
  const event=state.events.find(x=>x.id===id);const x=getX(d),y=Math.max(24,getY(d)-15);el.setAttribute("transform",`translate(${x},${y})`);state.offsets[id]=d;
  const live=state.events.map(v=>({...v,day:state.offsets[v.id]??v.day}));const proj=values.slice(0,state.days);const moved=live.find(v=>v.id===id);if(moved){const delta=moved.day-event.day;for(let i=Math.max(0,moved.day);i<proj.length;i++)proj[i]+=event.kind==="in"?moved.amount*.18:-moved.amount*.18}
 }
 function up(){if(!state.drag)return;let e=state.events.find(x=>x.id===id);let d=state.offsets[id]??e.day;state.drag=null;document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up);renderForecast();toast(`${e.label} moved to day ${d+1} · forecast updated`)}
 document.addEventListener("pointermove",move);document.addEventListener("pointerup",up);
}
function showPage(page){
 state.page=page;$("#overviewPage").classList.toggle("hidden",page!=="overview");$("#cashflowPage").classList.toggle("hidden",page!=="cashflow");$("#crumbPage").textContent=page==="cashflow"?"Cash flow":page[0].toUpperCase()+page.slice(1);
 $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 if(page==="cashflow")renderForecast();
}
function setTab(tab){
 state.tab=tab;$$(".sub-link").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));$$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 const title=tab==="forecast"?"Cash Horizon":tab==="income"?"Income forecast":"Spending forecast";$(".forecast-panel .panel-head>div>b").textContent="◷　"+title;
 if(tab!=="forecast")toast(`${tab[0].toUpperCase()+tab.slice(1)} view · sample data`);
 renderForecast();
}
function modal(title,body){$("#modalBody").innerHTML=`<div class="date-line">TALVO / KETTLEWICK BREWING CO.</div><h2>${title}</h2>${body}`;$("#modal").classList.add("open")}
function closeModal(){$("#modal").classList.remove("open")}
$$(".nav-link").forEach(b=>b.addEventListener("click",()=>{let p=b.dataset.page;if(p==="cashflow"){showPage(p);setTab("forecast")}else{showPage(p);if(p!=="overview")toast(`${b.textContent.trim()} · preview`)}}));
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
$("#openForecast").onclick=()=>{showPage("cashflow");setTab("forecast")};
$("#moveMoney1").onclick=$("#moveMoney2").onclick=()=>modal("Move money",`<p>Move funds between your business accounts.</p><label>From account</label><select><option>Operating · •4417 — $146,319</option><option>Treasury — $141,516</option><option>Tax reserve · •0932 — $64,312</option></select><label>To account</label><select><option>Tax reserve · •0932</option><option>Operating · •4417</option><option>Treasury</option></select><label>Amount</label><input id="moneyAmount" type="number" placeholder="e.g. 5000"><button class="confirm" id="confirmMove">REVIEW TRANSFER</button>`);
$("#addBill").onclick=()=>modal("Add a bill",`<p>Add a bill to your cash forecast.</p><label>Payee</label><input id="billPayee" placeholder="Company or supplier"><label>Amount</label><input id="billAmount" type="number" placeholder="0.00"><label>Due date</label><input id="billDate" type="date" value="2026-11-12"><button class="confirm" id="saveBill">ADD TO FORECAST</button>`);
$("#newBtn").onclick=()=>modal("Create new",`<p>What would you like to create?</p><button class="confirm" id="newBill">＋ New bill</button> <button class="confirm" id="newInvoice">＋ Invoice</button>`);
$("#askBtn").onclick=()=>modal("Ask Talvo",`<p>Ask a question about your cash position.</p><input id="askInput" placeholder="e.g. When is cash lowest?"><button class="confirm" id="askSubmit">ASK</button>`);
$("#notifyBtn").onclick=()=>modal("Notifications",`<p><b>7 payments need you.</b></p><p>Ballast Can Co. · $31,200 · due Nov 12</p><p>2 invoices are overdue. Cash forecast updated today.</p>`);
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");toast("Display contrast toggled")};
$("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.value.trim())toast(`Searching “${e.target.value.trim()}” · demo only`)});
$$(".period").forEach(b=>b.onclick=()=>{$$(".period").forEach(x=>x.classList.toggle("active",x===b));state.days=+b.dataset.days;renderForecast();toast(`${state.days}-day cash forecast`)});
$("#chartMode").onclick=()=>{state.mode="chart";$("#chartMode").classList.add("active");$("#listMode").classList.remove("active");$("#forecastVisual").classList.remove("hidden");$("#forecastList").classList.add("hidden")};
$("#listMode").onclick=()=>{state.mode="list";$("#listMode").classList.add("active");$("#chartMode").classList.remove("active");$("#forecastVisual").classList.add("hidden");$("#forecastList").classList.remove("hidden");renderForecastList()};
$("#expandChart").onclick=()=>modal("Cash Horizon · expanded",`<p>Operating balance starts at <b>$146,319</b>. Expected in: <b>$445,340</b>. Going out: <b>$477,155</b>. Projected balance Jan 17: <b>$114,504</b>.</p><p>Drag an event marker on the chart to change its forecast date.</p>`);
$("#cardStack").onclick=()=>{$(".cards-panel").classList.toggle("flipped");toast("Company card stack moved")};
$("#allCards").onclick=()=>modal("Company cards",`<p>6 active cards across Operations, Taproom, Brewing, Marketing, Travel and Purchasing.</p><p>Operations · 2719 — Hana Sato — $15,000 left</p><p>Taproom · 5521 — Amara Okafor — $35,579 left</p>`);
$("#modalClose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.addEventListener("click",e=>{
 if(e.target.id==="confirmMove"){let amount=+$("#moneyAmount").value;if(!amount||amount<1){toast("Enter a transfer amount");return}closeModal();toast(`Transfer of $${amount.toLocaleString()} queued · demo`)}
 if(e.target.id==="saveBill"){let name=$("#billPayee").value.trim(),amount=+$("#billAmount").value;if(!name||!amount){toast("Add a payee and amount");return}state.events.push({id:"custom"+Date.now(),day:24,label:name,kind:"bill",amount,desc:"New bill · added just now"});closeModal();renderForecast();toast(`${name} added to forecast`)}
 if(e.target.id==="newBill"){closeModal();$("#addBill").click()}
 if(e.target.id==="newInvoice"){closeModal();modal("New invoice",`<p>Create an incoming invoice.</p><label>Customer</label><input placeholder="Customer name"><label>Amount</label><input type="number" placeholder="0.00"><button class="confirm" id="invoiceSave">SAVE INVOICE</button>`)}
 if(e.target.id==="invoiceSave"){closeModal();toast("Invoice saved · demo")}
 if(e.target.id==="askSubmit"){let q=$("#askInput").value.trim();closeModal();toast(q?"Talvo is thinking · demo answer":"Ask a question first")}
});
renderMiniChart();renderWeeks();renderForecast();
})();