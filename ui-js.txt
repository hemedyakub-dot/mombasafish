/* MOMBASAFISH — logo-as-menu navigation + accessibility
   The wordmark is the only control in the bar. Tap it and the navigation
   opens full-screen; tap again, press Escape, or pick a link to close. */
(function(){
  var hdr=document.querySelector('.hdr'), logo=document.querySelector('.logo'), nav=document.querySelector('.nav');
  if(!hdr||!logo||!nav) return;

  /* 1. Skip to content */
  var skip=document.createElement('a');
  skip.className='skip'; skip.href='#main'; skip.textContent='Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);
  var main=document.querySelector('.wrap')||document.querySelector('.hero')||document.querySelector('section');
  if(main && !document.getElementById('main')){
    main.id='main';
    if(!main.hasAttribute('tabindex')) main.setAttribute('tabindex','-1');
  }

  /* 2. Move the navigation out of the bar into a full-screen panel */
  var wrap=document.createElement('div');
  wrap.className='navwrap';
  wrap.id='mainnav';
  wrap.setAttribute('role','dialog');
  wrap.setAttribute('aria-modal','true');
  wrap.setAttribute('aria-label','Site navigation');
  wrap.innerHTML='<button class="navclose" aria-label="Close menu">&times;</button>';
  nav.setAttribute('aria-label','Main');
  wrap.appendChild(nav);

  var foot=document.createElement('p');
  foot.className='navfoot';
  foot.innerHTML='<a href="https://wa.me/254787668888">WhatsApp 0787 668 888</a> · <a href="policies.html">Policies</a><br>Quality · Delivery · Freshness · Traceable to the Source';
  wrap.appendChild(foot);
  document.body.appendChild(wrap);

  /* 3. The wordmark becomes the toggle */
  logo.setAttribute('role','button');
  logo.setAttribute('aria-expanded','false');
  logo.setAttribute('aria-controls','mainnav');
  logo.setAttribute('aria-label','Open menu');
  logo.setAttribute('tabindex','0');
  var caret=document.createElement('span');
  caret.className='caret';
  caret.innerHTML='<span class="mword">Menu</span><span class="mchev">▾</span>';
  caret.setAttribute('aria-hidden','true');
  logo.appendChild(caret);

  var lastFocus=null;
  function setOpen(open){
    wrap.classList.toggle('open',open);
    logo.setAttribute('aria-expanded',String(open));
    logo.setAttribute('aria-label',open?'Close menu':'Open menu');
    var w=logo.querySelector('.mword'); if(w) w.textContent=open?'Close':'Menu';
    document.body.style.overflow=open?'hidden':'';
    if(open){
      lastFocus=document.activeElement;
      var first=wrap.querySelector('.nav a');
      if(first) setTimeout(function(){first.focus();},60);
    }else if(lastFocus){ lastFocus.focus(); }
  }
  logo.addEventListener('click',function(e){ e.preventDefault(); setOpen(!wrap.classList.contains('open')); });
  logo.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setOpen(!wrap.classList.contains('open')); }
  });
  wrap.querySelector('.navclose').addEventListener('click',function(){setOpen(false);});
  nav.addEventListener('click',function(e){ if(e.target.tagName==='A') setOpen(false); });
  wrap.addEventListener('click',function(e){ if(e.target===wrap) setOpen(false); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&wrap.classList.contains('open')) setOpen(false);
  });

  /* 4. Bar fades away while reading, returns on the way up */
  var lastY=window.pageYOffset, ticking=false;
  function onScroll(){
    var y=window.pageYOffset;
    var searchOpen=document.querySelector('.srch-wrap.open');
    var show = y<12 || y < lastY-2 || searchOpen || wrap.classList.contains('open');
    hdr.classList.toggle('hide', !show);
    lastY=y; ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;window.requestAnimationFrame(onScroll);}
  },{passive:true});

  /* 5. Search lives inside the menu, as a proper icon */
  var s=document.querySelector('.srch-btn');
  if(s){
    s.setAttribute('aria-label','Search products');
    s.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" style="width:22px;height:22px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;display:block"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    wrap.insertBefore(s, foot);
    s.addEventListener('click',function(){ setOpen(false); });
  }

  /* 6. Announce cart changes to screen readers */
  var live=document.createElement('div');
  live.className='sr-only'; live.setAttribute('aria-live','polite');
  document.body.appendChild(live);
  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.classList&&(t.classList.contains('pl')||t.classList.contains('mn')||t.classList.contains('add'))){
      var card=t.closest('.card[data-name]'); if(!card)return;
      var n=card.querySelector('.n');
      setTimeout(function(){ live.textContent=(card.dataset.name||'Item')+': '+(n?n.textContent:'updated')+' in cart'; },30);
    }
  });

  /* 7. Label any icon-only control that slipped through */
  document.querySelectorAll('button').forEach(function(b){
    if(b.getAttribute('aria-label')||b.textContent.trim().length>1) return;
    var t=b.textContent.trim();
    if(t==='+') b.setAttribute('aria-label','Increase quantity');
    if(t==='−'||t==='-') b.setAttribute('aria-label','Decrease quantity');
    if(t==='×') b.setAttribute('aria-label','Close');
  });
})();


/* ============================================================
   Floating WhatsApp button — for people who would rather
   talk to a person than to Babu.
   Desktop: sits above Babu on the right.
   Mobile:  Babu moves to the left, so this takes the right.
   Present on every page, including track / policies / wholesale
   where Babu is not loaded at all.
   ============================================================ */
(function () {
  if (document.querySelector('.mfwa')) return;
  var WA = '254787668888';
  var path = location.pathname;

  var msg = 'Hello MombasaFish, I have a question.';
  if (/track/.test(path))          msg = 'Hello MombasaFish, I need help with my order.';
  else if (/wholesale/.test(path)) msg = 'Hello MombasaFish, I would like to ask about wholesale supply.';
  else if (/\/fish\//.test(path)) {
    var h = document.querySelector('h1');
    if (h) msg = 'Hello MombasaFish, I am asking about ' + h.textContent.trim() + '.';
  } else if (/catalogue/.test(path)) msg = 'Hello MombasaFish, I would like to ask about an order.';
  else if (/recipes/.test(path))     msg = 'Hello MombasaFish, I have a question about cooking.';

  var css =
    '.mfwa{position:fixed;z-index:129;right:18px;bottom:88px;width:56px;height:56px;border-radius:50%;'
    + 'background:#25D366;box-shadow:0 8px 24px rgba(3,42,46,.3);display:flex;align-items:center;'
    + 'justify-content:center;text-decoration:none;transition:transform .18s ease}'
    + '.mfwa:hover,.mfwa:focus{transform:scale(1.07)}'
    + '.mfwa:focus-visible{outline:3px solid #07474C;outline-offset:3px}'
    + '.mfwa svg{width:30px;height:30px;fill:#fff}'
    + '.mfwl{position:fixed;z-index:129;right:82px;bottom:104px;background:#032A2E;color:#F2EDE3;'
    + 'font:500 .78rem/1 Inter,system-ui,sans-serif;padding:.5rem .7rem;border-radius:8px;'
    + 'white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s ease}'
    + '.mfwa:hover + .mfwl,.mfwa:focus + .mfwl{opacity:1}'
    /* Babu is not on these pages, so take his spot */
    + '.mfwa.solo{bottom:18px}.mfwa.solo + .mfwl{bottom:34px}'
    /* mobile: Babu goes left, this stays right and drops down */
    + '@media(max-width:760px){.mfwa{bottom:18px;right:12px}.mfwl{display:none}}'
    + '@media(prefers-reduced-motion:reduce){.mfwa{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var a = document.createElement('a');
  a.className = 'mfwa';
  a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with the MombasaFish team on WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2A10 10 0 0 0 3.5 17.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-3.9c-.3-.5-.7-1.2-.7-2s.4-1.2.6-1.4c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c0 .1.1.3 0 .4l-.3.4-.2.3c-.1.1-.2.2 0 .5.2.3.7 1.1 1.4 1.8.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3v.9z"/></svg>';

  var lab = document.createElement('span');
  lab.className = 'mfwl';
  lab.setAttribute('aria-hidden', 'true');
  lab.textContent = 'Talk to a person';

  function place() {
    /* if Babu rendered, stay above him; if not, take the bottom slot */
    if (!document.querySelector('.bs-fab')) a.classList.add('solo');
  }
  document.body.appendChild(a);
  document.body.appendChild(lab);
  if (document.readyState === 'complete') place();
  else window.addEventListener('load', place);
})();
