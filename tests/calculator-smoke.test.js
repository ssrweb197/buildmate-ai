const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const app=fs.readFileSync("app.js","utf8");
const elements={cards:{innerHTML:""},ratesBox:{innerHTML:""},modal:{classList:{add(){},remove(){}}},calc:{innerHTML:""},out:{innerHTML:""}};
const document={getElementById(id){return elements[id]||(elements[id]={value:"",innerHTML:"",classList:{add(){},remove(){}}})}};
const context={document,window:{location:{search:""}},URLSearchParams,console,Math,Number,String,Array,Intl};
vm.createContext(context);vm.runInContext(app,context);
const cases=[
["rcc","rcc",{"l":3,"w":3,"d":.15},"Wet concrete"],
["brick","brick",{"l":3,"w":3,"d":.23},"Bricks"],
["plaster","plaster",{"a":100,"t":12},"Wet mortar"],
["cost","cost",{"a":1200,"r":2000},"Estimated construction cost"],
["pcc","simpleConcrete",{"l":2,"w":2,"d":.1},"Concrete"],
["footing","simpleConcrete",{"l":1.8,"w":1.8,"d":.45},"Concrete"],
["column","simpleConcrete",{"l":.3,"w":.45,"d":3},"Concrete"],
["beam","simpleConcrete",{"l":.23,"w":.45,"d":4},"Concrete"],
["slab","simpleConcrete",{"l":5,"w":4,"d":.125},"Concrete"],
["flooring","flooring",{"a":20,"s":.6},"Tiles"],
["paint","paint",{"a":100,"c":10},"Paint"],
["block","block",{"l":4,"w":2.8,"d":.2,"bl":.4,"bh":.2},"Blocks"],
["excavation","excavation",{"l":2,"w":1.5,"d":1},"Excavation"],
["steel","steel",{"d":12,"l":10},"steel weight"],
["concrete","concrete",{"l":3,"w":3,"d":.15},"Wet concrete"],
["area","area",{"l":4,"w":3,"d":2.5},"Area"],
["stair","stair",{"r":3,"rr":175,"t":280},"Risers"],
["slope","slope",{"r":.5,"run":10},"Slope"],
["unit","unit",{"d":2400,"v":.5},"weight"],
["mortar","mortar",{"a":50,"t":10},"Wet mortar"],
["boq","boq",{"q":25,"r":450},"Item amount"]
];
for(const [type,fn,inputs,expected] of cases){
 context.openCalc(type);
 for(const [id,value] of Object.entries(inputs)) document.getElementById(id).value=String(value);
 context[fn]();
 const out=elements.out.innerHTML;
 assert.ok(out.includes(expected),type+" output missing expected label: "+out);
 assert.ok(!out.includes("NaN")&&!out.includes("Infinity"),type+" produced invalid numeric output");
}
context.openCalc("steel");document.getElementById("d").value="0";document.getElementById("l").value="10";context.steel();
assert.match(elements.out.innerHTML,/Please enter a valid number/,"zero input must be rejected");
console.log("PASS: "+cases.length+" calculator output smoke tests and zero-input validation.");
console.log("Note: browser rendering, engineering validation and real-device testing still require separate QA.");
