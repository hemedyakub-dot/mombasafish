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
