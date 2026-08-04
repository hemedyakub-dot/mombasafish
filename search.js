/* MOMBASAFISH — site search
   Header icon opens a search bar. On the Shop page it filters products live.
   From any other page it jumps to the Shop page with the search applied. */
(function(){
  var css='.srch-btn{background:none;border:0;cursor:pointer;font-size:1.05rem;line-height:1;padding:.45rem .55rem;border-radius:999px;color:var(--ink)}'
  +'.srch-btn:hover{background:var(--abyss);color:var(--sand)}'
  +'.srch-wrap{display:none;padding:.7rem 1rem;background:var(--sand);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:49}'
  +'.srch-wrap.open{display:block}'
  +'.srch-in{display:flex;gap:.5rem;max-width:68rem;margin:0 auto;align-items:center}'
  +'.srch-in input{flex:1;padding:.7rem .9rem;border-radius:999px;border:2px solid var(--line);background:var(--white);color:var(--ink);font-size:1rem;font-family:var(--font-body)}'
  +'.srch-in input:focus{outline:none;border-color:var(--deep)}'
  +'.srch-in button{background:none;border:0;font-size:1.3rem;cursor:pointer;color:var(--muted);line-height:1;padding:.2rem .4rem}'
  +'.srch-count{max-width:68rem;margin:.45rem auto 0;font-size:.8rem;color:var(--muted);font-family:var(--font-mono)}'
  +'.srch-none{max-width:36rem;margin:2rem auto;text-align:center;font-size:.95rem;color:var(--muted)}'
  +'.srch-none a{font-weight:700}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var nav=document.querySelector('.nav'); if(!nav) return;
  var btn=document.createElement('button');
  btn.className='srch-btn'; btn.setAttribute('aria-label','Search'); btn.innerHTML='&#128269;';
  nav.appendChild(btn);

  var bar=document.createElement('div');
  bar.className='srch-wrap';
  bar.innerHTML='<div class="srch-in"><input type="search" id="srchq" placeholder="Search: jodari, prawns, sea moss, honey…" autocomplete="off"><button id="srchx" aria-label="Close">&times;</button></div><p class="srch-count" id="srchc"></p>';
  var hdr=document.querySelector('.hdr');
  hdr.parentNode.insertBefore(bar,hdr.nextSibling);

  var input=document.getElementById('srchq'), count=document.getElementById('srchc');
  var isShop=/catalogue/.test(location.pathname)||document.querySelector('.card[data-name]');

  function open(){bar.classList.add('open');input.focus();}
  function close(){bar.classList.remove('open');input.value='';if(isShop)run('');}
  btn.addEventListener('click',function(){bar.classList.contains('open')?close():open();});
  document.getElementById('srchx').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bar.classList.contains('open'))close();});

  function textOf(card){
    return (card.dataset.name||'')+' '+(card.textContent||'');
  }
  function run(q){
    q=(q||'').trim().toLowerCase();
    var cards=[].slice.call(document.querySelectorAll('.grid > .card'));
    var shown=0;
    cards.forEach(function(c){
      var hit=!q||textOf(c).toLowerCase().indexOf(q)>=0;
      c.style.display=hit?'':'none';
      if(hit)shown++;
    });
    // hide category headings + intros whose grid has nothing left
    [].slice.call(document.querySelectorAll('.grid')).forEach(function(g){
      var any=[].slice.call(g.children).some(function(c){return c.style.display!=='none';});
      g.style.display=any?'':'none';
      var p=g.previousElementSibling;
      while(p&&(p.classList.contains('catdesc')||p.tagName==='IMG')){p.style.display=any?'':'none';p=p.previousElementSibling;}
      if(p&&p.classList.contains('cat'))p.style.display=any?'':'none';
    });
    var combo=document.getElementById('omega-combo');
    if(combo)combo.style.display=q?'none':'';
    var none=document.getElementById('srchnone');
    if(q&&shown===0){
      if(!none){
        none=document.createElement('p'); none.id='srchnone'; none.className='srch-none';
        none.innerHTML='No products match that search. Try a Swahili name like <b>jodari</b> or <b>pweza</b> — or <a href="https://wa.me/254787668888">ask us on WhatsApp</a>.';
        document.querySelector('.wrap section').appendChild(none);
      }
      none.style.display='block';
    }else if(none){none.style.display='none';}
    count.textContent=q?(shown+' item'+(shown===1?'':'s')+' found'):'';
  }

  input.addEventListener('input',function(){
    if(isShop){run(input.value);}
  });
  input.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;
    var q=input.value.trim();
    if(!isShop&&q){location.href='catalogue.html?q='+encodeURIComponent(q);}
  });

  // apply ?q= on load (arriving from another page)
  var m=location.search.match(/[?&]q=([^&]*)/);
  if(m&&isShop){
    var q=decodeURIComponent(m[1].replace(/\+/g,' '));
    open(); input.value=q; run(q);
  }
})();
