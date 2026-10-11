const tools=[
["RCC Material","rcc","Concrete volume + cement/sand/aggregate for nominal M5–M20 mixes."],
["Brick Work","brick","Bricks, mortar, cement and sand."],["Plastering","plaster","Mortar quantity from area, thickness and ratio."],
["Construction Cost","cost","House construction cost by area and rate."],["PCC Material","pcc","PCC cement, sand and aggregate."],
["Footing Material","footing","Isolated footing concrete estimate."],["Column Material","column","RCC column concrete estimate."],
["Beam Material","beam","RCC beam concrete estimate."],["Slab Material","slab","RCC slab concrete estimate."],
["Flooring","flooring","Tiles, adhesive and grout."],["Paint","paint","Paint, primer and putty planning quantity."],
["Block Work","block","Blocks and mortar estimate."],["Excavation","excavation","Excavation and loose-soil volume."],
["Steel Weight","steel","Rebar weight using d²/162."],["Concrete Volume","concrete","Wet and dry concrete volume."],
["Area & Volume","area","Quick area and volume."],["Staircase","stair","Riser, tread, steps and run."],
["Slope & Gradient","slope","Slope %, ratio and angle."],["Unit Weight","unit","Weight from density and volume."],
["Mortar","mortar","Cement and sand for mortar."],["BOQ Estimator","boq","Quick quantity × rate cost summary."]
];
const cards=document.getElementById("cards");
cards.innerHTML=tools.map(t=>`<article class="card"><h3>🔧 ${t[0]}</h3><p>${t[2]}</p><button onclick="openCalc('${t[1]}')">Calculate →</button></article>`).join("");

const rates=[
["OPC 53 Grade Cement","₹395–420","per 50 kg bag"],["PPC Cement","₹355–380","per 50 kg bag"],
["TMT 8mm Fe500D","₹60–66","per kg"],["TMT 12mm Fe500D","₹58–64","per kg"],
["TMT 16mm Fe500D","₹57–63","per kg"],["River Sand","₹1,500–2,000","per tonne"],
["M-Sand","₹1,100–1,400","per tonne"],["20mm Aggregate","₹909–1,473","per tonne"],
["Red Clay Brick","₹9–12","per piece"],["Fly Ash Brick","₹5–7","per piece"],["AAC Block 600×200×200","₹59–95","per piece"]
];
document.getElementById("ratesBox").innerHTML=`<div class="rates">${rates.map(r=>`<div class="rate"><div><b>${r[0]}</b><small>Hyderabad</small></div><strong>${r[1]}<small>${r[2]}</small></strong></div>`).join("")}</div>`;

const modal=document.getElementById("modal"),calc=document.getElementById("calc");
function f(id,label,unit=""){return `<div class="field"><label>${label}${unit?" ("+unit+")":""}</label><input id="${id}" type="number" min="0" step="any"></div>`}
function n(id){return Number(document.getElementById(id)?.value)||0}
function show(x){document.getElementById("out").innerHTML=`<div class="result">${x}</div>`}
function openCalc(type){
let h="";
if(type==="rcc")h=`<h2>RCC Material Estimator</h2>${f("l","Length","m")}${f("w","Width","m")}${f("d","Depth","m")}<div class="field"><label>Grade</label><select id="mix"><option value="1,5,10">M5 — 1:5:10</option><option value="1,4,8">M7.5 — 1:4:8</option><option value="1,3,6">M10 — 1:3:6</option><option value="1,2,4">M15 — 1:2:4</option><option value="1,1.5,3">M20 — 1:1.5:3</option><option value="design">M25–M40 — Design mix</option></select></div><button class="calc-btn" onclick="rcc()">Calculate</button><div id="out"></div>`;
if(type==="brick")h=`<h2>Brick Work</h2>${f("l","Wall length","m")}${f("w","Wall height","m")}${f("d","Wall thickness","m")}<div class="field"><label>Mortar ratio</label><select id="ratio"><option>4</option><option selected>5</option><option>6</option></select></div><button class="calc-btn" onclick="brick()">Calculate</button><div id="out"></div>`;
if(type==="plaster")h=`<h2>Plastering</h2>${f("a","Area","m²")}${f("t","Thickness","mm")}<div class="field"><label>Ratio</label><select id="ratio"><option>4</option><option selected>5</option><option>6</option></select></div><button class="calc-btn" onclick="plaster()">Calculate</button><div id="out"></div>`;
if(type==="cost")h=`<h2>Construction Cost</h2>${f("a","Built-up area","sq ft")}${f("r","Rate per sq ft","₹")}<button class="calc-btn" onclick="cost()">Estimate</button><div id="out"></div>`;
if(["pcc","footing","column","beam","slab"].includes(type))h=`<h2>${type.toUpperCase()} Material</h2>${f("l","Length","m")}${f("w","Width","m")}${f("d","Depth","m")}<div class="field"><label>Mix</label><select id="mix"><option value="1,2,4">M15 — 1:2:4</option><option value="1,1.5,3" selected>M20 — 1:1.5:3</option><option value="design">M25+ — design mix</option></select></div><button class="calc-btn" onclick="simpleConcrete()">Calculate</button><div id="out"></div>`;
if(type==="flooring")h=`<h2>Flooring</h2>${f("a","Floor area","m²")}${f("s","Tile side","m")}<button class="calc-btn" onclick="flooring()">Calculate</button><div id="out"></div>`;
if(type==="paint")h=`<h2>Paint</h2>${f("a","Paintable area","m²")}${f("c","Coverage per litre","m²/L")}<button class="calc-btn" onclick="paint()">Calculate</button><div id="out"></div>`;
if(type==="block")h=`<h2>Block Work</h2>${f("l","Wall length","m")}${f("w","Wall height","m")}${f("d","Wall thickness","m")}${f("bl","Block length","m")}${f("bh","Block height","m")}<button class="calc-btn" onclick="block()">Calculate</button><div id="out"></div>`;
if(type==="excavation")h=`<h2>Excavation</h2>${f("l","Length","m")}${f("w","Width","m")}${f("d","Depth","m")}<button class="calc-btn" onclick="excavation()">Calculate</button><div id="out"></div>`;
if(type==="steel")h=`<h2>Steel Weight</h2>${f("d","Bar diameter","mm")}${f("l","Total length","m")}<button class="calc-btn" onclick="steel()">Calculate</button><div id="out"></div>`;
if(type==="concrete")h=`<h2>Concrete Volume</h2>${f("l","Length","m")}${f("w","Width","m")}${f("d","Depth","m")}<button class="calc-btn" onclick="concrete()">Calculate</button><div id="out"></div>`;
if(type==="area")h=`<h2>Area & Volume</h2>${f("l","Length","m")}${f("w","Width","m")}${f("d","Height/Depth","m")}<button class="calc-btn" onclick="area()">Calculate</button><div id="out"></div>`;
if(type==="stair")h=`<h2>Staircase</h2>${f("r","Floor-to-floor rise","m")}${f("rr","Preferred riser","mm")}${f("t","Tread","mm")}<button class="calc-btn" onclick="stair()">Calculate</button><div id="out"></div>`;
if(type==="slope")h=`<h2>Slope & Gradient</h2>${f("r","Rise","m")}${f("run","Run","m")}<button class="calc-btn" onclick="slope()">Calculate</button><div id="out"></div>`;
if(type==="unit")h=`<h2>Unit Weight</h2>${f("d","Density","kg/m³")}${f("v","Volume","m³")}<button class="calc-btn" onclick="unit()">Calculate</button><div id="out"></div>`;
if(type==="mortar")h=`<h2>Mortar</h2>${f("a","Area","m²")}${f("t","Thickness","mm")}<div class="field"><label>Ratio</label><select id="ratio"><option>4</option><option selected>5</option><option>6</option></select></div><button class="calc-btn" onclick="mortar()">Calculate</button><div id="out"></div>`;
if(type==="boq")h=`<h2>BOQ Estimator</h2>${f("q","Quantity")}${f("r","Rate","₹")}<button class="calc-btn" onclick="boq()">Calculate Amount</button><div id="out"></div>`;
calc.innerHTML=h;modal.classList.add("show")}
function closeCalc(){modal.classList.remove("show")}
function rcc(){let v=n("l")*n("w")*n("d"),m=document.getElementById("mix").value;if(m==="design"){show(`Wet concrete: <b>${v.toFixed(3)} m³</b><hr>M25–M40 require an approved design mix. Use project-specific quantities.`);return}let p=m.split(",").map(Number),dry=v*1.54,sum=p.reduce((a,b)=>a+b,0),c=dry*p[0]/sum,s=dry*p[1]/sum,a=dry*p[2]/sum;show(`Wet concrete: <b>${v.toFixed(3)} m³</b><br>Cement: <b>${(c/.0347).toFixed(1)} bags</b><br>Sand: <b>${s.toFixed(3)} m³</b><br>Aggregate: <b>${a.toFixed(3)} m³</b>`)}
function brick(){let l=n("l"),h=n("w"),t=n("d"),wall=l*h*t,r=Number(document.getElementById("ratio").value);if(l<=0||h<=0||t<=0){show("Please enter positive wall length, height and thickness values.");return}/* Approximate traditional brick: 230×110×75 mm; nominal module with mortar joints: 240×120×85 mm. */const moduleVolume=.24*.12*.085,brickVolume=.23*.11*.075,baseBricks=wall/moduleVolume,br=Math.ceil(baseBricks*1.05),wet=Math.max(0,wall-baseBricks*brickVolume),dry=wet*1.33,c=dry/(r+1),s=dry*r/(r+1);show(`Wall volume: <b>${wall.toFixed(3)} m³</b><br>Bricks (includes 5% wastage): <b>${br.toLocaleString("en-IN")}</b><br>Estimated wet mortar: <b>${wet.toFixed(3)} m³</b><br>Cement: <b>${(c/.0347).toFixed(1)} bags</b><br>Sand: <b>${s.toFixed(3)} m³</b><br><small>Planning estimate using assumed traditional brick and mortar-joint sizes. Actual quantities vary by brick size, joint thickness and workmanship; verify before purchase.</small>`)}
function plaster(){let wet=n("a")*n("t")/1000,dry=wet*1.33,r=Number(document.getElementById("ratio").value),c=dry/(r+1),s=dry-c;show(`Wet mortar: <b>${wet.toFixed(3)} m³</b><br>Cement: <b>${(c/.0347).toFixed(1)} bags</b><br>Sand: <b>${s.toFixed(3)} m³</b>`)}
function cost(){let a=n("a"),r=n("r");show(`Estimated construction cost: <b>₹${(a*r).toLocaleString("en-IN")}</b><br>Area: ${a.toLocaleString("en-IN")} sq ft × ₹${r.toLocaleString("en-IN")}/sq ft`)}
function simpleConcrete(){let v=n("l")*n("w")*n("d"),m=document.getElementById("mix").value;if(m==="design"){show(`Concrete volume: <b>${v.toFixed(3)} m³</b><br>M25+ requires approved design-mix quantities.`);return}let p=m.split(",").map(Number),dry=v*1.54,sum=p.reduce((a,b)=>a+b,0);show(`Concrete: <b>${v.toFixed(3)} m³</b><br>Cement: <b>${(dry*p[0]/sum/.0347).toFixed(1)} bags</b><br>Sand: <b>${(dry*p[1]/sum).toFixed(3)} m³</b><br>Aggregate: <b>${(dry*p[2]/sum).toFixed(3)} m³</b>`)}
function flooring(){let a=n("a"),s=n("s");show(`Tiles: <b>${Math.ceil(a/(s*s)*1.05).toLocaleString("en-IN")} nos</b><br>Adhesive planning quantity: <b>${(a*4).toFixed(1)} kg</b><br>Grout planning quantity: <b>${(a*.3).toFixed(1)} kg</b>`)}
function paint(){let a=n("a"),c=n("c");show(`Paint: <b>${(a/c*2*1.05).toFixed(1)} litres</b> for 2 coats<br>Primer planning: <b>${(a/10*1.1).toFixed(1)} litres</b>`)}
function block(){let area=n("l")*n("w"),face=n("bl")*n("bh"),blocks=Math.ceil(area/face*1.05),wall=area*n("d"),dry=Math.max(0,wall-blocks*face*n("d"))*1.33,r=5,c=dry/(r+1);show(`Blocks: <b>${blocks.toLocaleString("en-IN")}</b><br>Wall volume: <b>${wall.toFixed(3)} m³</b><br>Cement: <b>${(c/.0347).toFixed(1)} bags</b>`)}
function excavation(){let v=n("l")*n("w")*n("d");show(`Excavation: <b>${v.toFixed(3)} m³</b><br>Loose soil at 20% swell: <b>${(v*1.2).toFixed(3)} m³</b>`)}
function steel(){let kg=n("d")*n("d")/162*n("l");show(`Approximate steel weight: <b>${kg.toFixed(2)} kg</b> (${(kg/1000).toFixed(3)} tonnes)`)}
function concrete(){let v=n("l")*n("w")*n("d");show(`Wet concrete: <b>${v.toFixed(3)} m³</b><br>Dry material allowance: <b>${(v*1.54).toFixed(3)} m³</b>`)}
function area(){let a=n("l")*n("w");show(`Area: <b>${a.toFixed(3)} m²</b><br>Volume: <b>${(a*n("d")).toFixed(3)} m³</b>`)}
function stair(){let r=n("r"),rr=n("rr"),t=n("t"),steps=Math.ceil(r*1000/rr),ar=r*1000/steps,run=(steps-1)*t,p=Math.atan(ar/t)*180/Math.PI;show(`Risers: <b>${steps}</b><br>Actual riser: <b>${ar.toFixed(1)} mm</b><br>Total run: <b>${(run/1000).toFixed(2)} m</b><br>Pitch: <b>${p.toFixed(1)}°</b>`)}
function slope(){let r=n("r"),run=n("run"),pct=r/run*100,ang=Math.atan(r/run)*180/Math.PI;show(`Slope: <b>${pct.toFixed(2)}%</b><br>Angle: <b>${ang.toFixed(2)}°</b><br>Gradient: <b>1:${(run/r).toFixed(2)}</b>`)}
function unit(){let kg=n("d")*n("v");show(`Approximate weight: <b>${kg.toFixed(2)} kg</b> (${(kg/1000).toFixed(3)} tonnes)`)}
function mortar(){let wet=n("a")*n("t")/1000,dry=wet*1.33,r=Number(document.getElementById("ratio").value),c=dry/(r+1),s=dry-c;show(`Wet mortar: <b>${wet.toFixed(3)} m³</b><br>Cement: <b>${(c/.0347).toFixed(1)} bags</b><br>Sand: <b>${s.toFixed(3)} m³</b>`)}
function boq(){show(`Item amount: <b>₹${(n("q")*n("r")).toLocaleString("en-IN")}</b>`)}
