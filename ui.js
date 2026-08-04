/* MOMBASAFISH — accessibility & mobile navigation
   Adds: skip link, mobile menu toggle, real labels on icon buttons.
   Runs after search.js so it can include the search button in the menu. */
(function(){
  var hdr=document.querySelector('.hdr'), nav=document.querySelector('.nav');
  if(!hdr||!nav) return;

  /* 1. Skip to content */
  var skip=document.createElement('a');
  skip.className='skip'; skip.href='#main'; skip.textContent='Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);

  var main=document.querySelector('.wrap') || document.querySelector('.hero') || document.querySelector('section');
  if(main && !document.getElementById('main')){
    main.id='main';
    if(!main.hasAttribute('tabindex')) main.setAttribute('tabindex','-1');
  }

  /* 2. Landmarks */
  nav.setAttribute('aria-label','Main');
  if(main && main.tagName!=='MAIN') main.setAttribute('role','region');

  /* 3. Mobile menu button */
  var btn=document.createElement('button');
  btn.className='menu-btn';
  btn.setAttribute('aria-label','Open menu');
  btn.setAttribute('aria-expanded','false');
  btn.setAttribute('aria-controls','mainnav');
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  nav.id='mainnav';
  hdr.appendChild(btn);

  function setOpen(open){
    nav.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',String(open));
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    btn.innerHTML=open
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  }
  btn.addEventListener('click',function(){setOpen(!nav.classList.contains('open'));});
  nav.addEventListener('click',function(e){ if(e.target.tagName==='A') setOpen(false); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open')){setOpen(false);btn.focus();}
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>760) setOpen(false); });

  /* 3b. Free the screen while scrolling:
        close the menu, and slide the header away going down / back on the way up */
  var lastY=window.pageYOffset, ticking=false;
  function onScroll(){
    var y=window.pageYOffset;
    if(nav.classList.contains('open') && Math.abs(y-lastY)>40) setOpen(false);
    var down = y>lastY && y>140;
    var searchOpen=document.querySelector('.srch-wrap.open');
    hdr.classList.toggle('hide', down && !searchOpen);
    lastY=y; ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;window.requestAnimationFrame(onScroll);}
  },{passive:true});

  /* 4. Replace emoji icons with accessible labels */
  var s=document.querySelector('.srch-btn');
  if(s){
    s.setAttribute('aria-label','Search products');
    s.setAttribute('aria-expanded','false');
    s.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;display:block"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  }

  /* 5. Announce quantity changes to screen readers */
  var live=document.createElement('div');
  live.className='sr-only'; live.setAttribute('aria-live','polite'); live.id='cartlive';
  document.body.appendChild(live);
  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.classList&&(t.classList.contains('pl')||t.classList.contains('mn')||t.classList.contains('add'))){
      var card=t.closest('.card[data-name]'); if(!card)return;
      var n=card.querySelector('.n');
      setTimeout(function(){
        live.textContent=(card.dataset.name||'Item')+': '+(n?n.textContent:'updated')+' in cart';
      },30);
    }
  });

  /* 6. Label every icon-only control that slipped through */
  document.querySelectorAll('button').forEach(function(b){
    if(b.getAttribute('aria-label')||b.textContent.trim().length>1) return;
    var t=b.textContent.trim();
    if(t==='+') b.setAttribute('aria-label','Increase quantity');
    if(t==='−'||t==='-') b.setAttribute('aria-label','Decrease quantity');
    if(t==='×') b.setAttribute('aria-label','Close');
  });
})();
