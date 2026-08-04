/* ============================================================
   MOMBASAFISH — PROMO CONTROL
   Edit ONLY this block to change your promotion.
   Set  on: false  to switch the popup off completely.
   ============================================================ */
var PROMO = {
  on:        true,                                  // true = show popup, false = off
  id:        "omega3-combo-aug2026",                // CHANGE THIS every new promo (resets who has seen it)
  image:     "images/katashingo.jpg",               // picture in the popup (leave "" for no picture)
  kicker:    "Offer of the week",                   // small line above the headline
  title:     "The Omega-3 Combo — save KES 300",    // the headline
  text:      "Sardines, anchovies and Indian mackerel — the giants of omega-3. 1 kg of each for KES 1,500 instead of 1,800. While the catch lasts.",
  button:    "Get the combo",                       // button text
  link:      "catalogue.html#omega-combo",
  delay:     6000,                                  // wait 6 seconds before showing (gives people time to look around)
  showAgainAfterDays: 3,                            // if dismissed, don't show again for 3 days

  /* PINNED STRIP — always-visible bar under the header */
  strip:     true,                                  // true = show pinned strip
  stripText: "🐟 Offer of the week: Omega-3 Combo — 3 kg for KES 1,500 (save 300)",
  stripLink: "catalogue.html#omega-combo"
};
/* ===================== END OF EDITING ====================== */

(function(){
  var css = '.pmo-ov{position:fixed;inset:0;background:rgba(3,42,46,.72);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.2rem;opacity:0;transition:opacity .3s}'
  +'.pmo-ov.in{opacity:1}'
  +'.pmo{background:#FAF6EE;border-radius:20px;max-width:24rem;width:100%;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45);transform:translateY(14px) scale(.98);transition:transform .35s cubic-bezier(.2,.8,.3,1)}'
  +'.pmo-ov.in .pmo{transform:none}'
  +'.pmo img{width:100%;aspect-ratio:16/10;object-fit:cover}'
  +'.pmo-b{padding:1.3rem 1.4rem 1.5rem;position:relative}'
  +'.pmo-k{font-family:IBM Plex Mono,monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#FF6B5A}'
  +'.pmo-b h3{font-family:Archivo Black,sans-serif;font-size:1.3rem;color:#032A2E;margin:.35rem 0 .5rem;line-height:1.2}'
  +'.pmo-b p{font-size:.92rem;color:#4A6467;line-height:1.6;margin-bottom:1.1rem}'
  +'.pmo-b a.pmo-cta{display:block;text-align:center;background:#1FAF54;color:#fff;font-weight:700;text-decoration:none;border-radius:999px;padding:.85rem 1.4rem}'
  +'.pmo-x{position:absolute;top:-2.6rem;right:.1rem;background:rgba(250,246,238,.9);border:0;width:34px;height:34px;border-radius:50%;font-size:1.3rem;line-height:1;cursor:pointer;color:#032A2E}'
  +'.pmo-no{display:block;width:100%;background:none;border:0;color:#4A6467;font-size:.8rem;margin-top:.7rem;cursor:pointer;text-decoration:underline}'
  +'.pmo-strip{background:#FFB84D;color:#032A2E;text-align:center;font-size:.82rem;font-weight:700;padding:.5rem 1rem;position:relative;z-index:1}'
  +'.pmo-strip a{color:#032A2E}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  if(PROMO.strip){
    var s=document.createElement('div'); s.className='pmo-strip';
    s.innerHTML='<a href="'+PROMO.stripLink+'" style="text-decoration:none">'+PROMO.stripText+'</a>';
    var hdr=document.querySelector('.hdr');
    if(hdr&&hdr.parentNode) hdr.parentNode.insertBefore(s,hdr.nextSibling);
  }

  var skip=/track/.test(location.pathname);
  if(!PROMO.on||skip) return;
  var key='pmo_'+PROMO.id;
  try{
    var seen=localStorage.getItem(key);
    if(seen && (Date.now()-parseInt(seen,10)) < PROMO.showAgainAfterDays*86400000) return;
  }catch(e){}

  setTimeout(function(){
    var ov=document.createElement('div'); ov.className='pmo-ov';
    ov.innerHTML='<div class="pmo">'
      +(PROMO.image?'<img src="'+PROMO.image+'" alt="">':'')
      +'<div class="pmo-b"><button class="pmo-x" aria-label="close">×</button>'
      +'<span class="pmo-k">'+PROMO.kicker+'</span>'
      +'<h3>'+PROMO.title+'</h3><p>'+PROMO.text+'</p>'
      +'<a class="pmo-cta" href="'+PROMO.link+'">'+PROMO.button+'</a>'
      +'<button class="pmo-no">No thanks, keep browsing</button></div></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ov.classList.add('in');});
    function close(){
      try{localStorage.setItem(key,String(Date.now()));}catch(e){}
      ov.classList.remove('in');
      setTimeout(function(){ov.remove();},300);
    }
    ov.querySelector('.pmo-x').onclick=close;
    ov.querySelector('.pmo-no').onclick=close;
    ov.querySelector('.pmo-cta').onclick=function(){try{localStorage.setItem(key,String(Date.now()));}catch(e){}};
    ov.onclick=function(e){if(e.target===ov)close();};
    document.addEventListener('keydown',function h(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',h);}});
  }, PROMO.delay);
})();
