
const fs=require('fs'), vm=require('vm');
const code=fs.readFileSync('/mnt/data/tmpcheck/script.js','utf8');
let ctx={
 console: console,
 Date: Date,
 Math: Math,
 setTimeout: ()=>0, clearTimeout:()=>{},
 document: { getElementById:()=>({dataset:{}}), addEventListener:()=>{}, removeEventListener:()=>{} },
 window: { motorBackend: {online:false} },
 React: {
   useState: (init)=>[init, ()=>{}],
   useEffect: ()=>{},
   useRef: (v)=>({current:v}),
   createElement: (type, props, ...children)=>{
      if (typeof type==='function') {
         return type(Object.assign({}, props||{}, {children}));
      }
      return {type, props, children};
   }
 },
 ReactDOM: { createRoot: ()=>({render: (el)=>{ console.log('rendered', typeof el); }}) }
};
ctx.window=ctx.window||{}; 
vm.createContext(ctx);
try { vm.runInContext(code, ctx); console.log('OK'); } catch(e) { console.error('ERR', e.stack); process.exit(1); }
