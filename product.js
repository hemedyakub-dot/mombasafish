/* MOMBASAFISH — product page cart control.
   Writes into the same localStorage cart the catalogue page reads,
   so adding here and checking out there is one continuous basket. */
(function(){
  var STORE='mf_cart_v1';
  var box=document.querySelector('.padd');
  if(!box) return;

  var name=box.dataset.name, unit=box.dataset.unit, price=+box.dataset.price||0;
  var addBtn=box.querySelector('.add'), qtyBox=box.querySelector('.qty'),
      nEl=box.querySelector('.n'), plus=box.querySelector('.pl'), minus=box.querySelector('.mn'),
      toCart=box.querySelector('.tocart');

  var live=document.createElement('p');
  live.className='paddlive'; live.setAttribute('aria-live','polite');
  box.appendChild(live);

  function read(){ try{ return JSON.parse(localStorage.getItem(STORE)||'{}'); }catch(e){ return {}; } }
  function write(d){ try{ localStorage.setItem(STORE,JSON.stringify(d)); }catch(e){} }
  function get(){ var d=read(); return (d.q&&d.q[name])||0; }
  function set(v){
    var d=read(); d.q=d.q||{};
    if(v>0) d.q[name]=v; else delete d.q[name];
    write(d); paint();
  }
  function totalItems(){
    var d=read(), t=0, k;
    if(d.q) for(k in d.q) t+=d.q[k];
    return t;
  }
  function money(n){ return n.toLocaleString('en-KE'); }

  function paint(){
    var q=get();
    box.classList.toggle('on', q>0);
    nEl.textContent = unit==='kg' ? q+' kg' : String(q);
    if(q>0){
      live.textContent = q+(unit==='kg'?' kg':' × ')+' — KES '+money(q*price)+' in your cart';
      toCart.textContent = 'Go to cart ('+totalItems()+') →';
    }else{
      live.textContent='';
      toCart.textContent = totalItems()>0 ? 'Go to cart ('+totalItems()+') →' : 'Go to cart →';
    }
  }

  addBtn.addEventListener('click',function(){ set(get()||1); });
  plus.addEventListener('click',function(){ set(get()+1); });
  minus.addEventListener('click',function(){ set(Math.max(0,get()-1)); });

  paint();
  window.addEventListener('pageshow',paint);
})();
