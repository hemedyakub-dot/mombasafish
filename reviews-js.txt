/* ============================================================
   MOMBASAFISH — CUSTOMER VOICES
   ------------------------------------------------------------
   Real WhatsApp messages, shown as what they are.

   Each entry:
     q     the message, in their words. Leave the phrasing alone.
     who   first name and last initial  ->  "Amina H."
     where county or town               ->  "Nairobi"
     t     the time it was sent         ->  "13:02"   (optional)
     what  what they ordered            ->  "Nguru, 3 kg"  (optional)

   Only publish words a customer actually sent you, and never add
   a star rating nobody gave. If you want stars, ask these same
   customers for a Google review — those are real, they carry
   weight, and they help you rank locally.
   ============================================================ */
var REVIEWS = [

  { q:"Loved the customer service, everything is so seamless. From the sea to my door step in Kiambu. Will be ordering again.",
    who:"Joy N.", where:"Kiambu", t:"13:02" },

  { q:"Shukran jazakallah, nimereceive plus they are fresh mashallah. Zikiisha will order more, inshaAllah.",
    who:"Dalia", where:"Kisumu", t:"12:58" },

  { q:"Amazing. We shall support you hadi uwe state supplier. Shukran!",
    who:"Prize M.", where:"Nairobi", t:"15:33" },

];

var REVIEWS_TITLE = "What our customers say";
var REVIEWS_LEDE  = "Straight from WhatsApp, exactly as they were sent. We have not tidied the spelling or the Swahili.";

/* ===================== END OF EDITING ====================== */

(function(){
  var host = document.getElementById('reviews');
  if(!host || !REVIEWS || !REVIEWS.length) return;

  function esc(s){
    return String(s||'').replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }
  function initials(n){
    var p = String(n||'?').trim().split(/\s+/);
    return ((p[0]||'?')[0] + (p[1] ? p[1][0] : '')).toUpperCase();
  }
  var TINT = ['#0A5C63','#8A6238','#5C6733','#7A4E33','#07474C'];

  var css='.rvs{border-top:1px solid var(--line);padding-top:2rem;margin:2.6rem 0}'
   +'.rvs .kick{display:block;font-family:var(--font-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--coral);margin-bottom:.5rem}'
   +'.rvs h2{font-family:var(--font-display);font-size:clamp(1.3rem,4vw,1.9rem);color:var(--abyss);margin-bottom:.4rem}'
   +'.rvs .lede{color:var(--muted);font-size:.92rem;margin-bottom:1.5rem;max-width:42rem}'
   +'.rvgrid{display:grid;gap:1rem;grid-template-columns:1fr}'
   +'@media(min-width:640px){.rvgrid{grid-template-columns:1fr 1fr}}'
   +'@media(min-width:980px){.rvgrid{grid-template-columns:repeat(3,1fr)}}'
   +'.rv{background:#ECE5DD;border:1px solid rgba(3,42,46,.1);border-radius:18px;padding:1rem;display:flex;flex-direction:column;box-shadow:0 2px 12px rgba(3,42,46,.06);position:relative;overflow:hidden}'
   +'.rv::before{content:"";position:absolute;inset:0;opacity:.5;background-image:radial-gradient(rgba(3,42,46,.07) 1px,transparent 1px);background-size:18px 18px;pointer-events:none}'
   +'.rvwa{display:flex;align-items:center;gap:.35rem;font-family:var(--font-mono);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:#128C7E;margin-bottom:.6rem;position:relative}'
   +'.rvwa svg{width:13px;height:13px;flex:0 0 auto}'
   +'.rvbub{background:#FFFEFA;border-radius:2px 14px 14px 14px;padding:.75rem .9rem .5rem;position:relative;box-shadow:0 1px 2px rgba(3,42,46,.14)}'
   +'.rvbub p{font-size:.94rem;line-height:1.62;color:#0B2E31;margin:0}'
   +'.rvbub time{display:block;text-align:right;font-family:var(--font-mono);font-size:.64rem;color:#7C8B8C;margin-top:.35rem}'
   +'.rvfoot{display:flex;align-items:center;gap:.6rem;margin-top:.85rem;position:relative}'
   +'.rvav{flex:0 0 auto;width:34px;height:34px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-body);font-weight:700;font-size:.78rem;letter-spacing:.02em}'
   +'.rvname b{display:block;font-size:.88rem;color:var(--abyss);line-height:1.2}'
   +'.rvname span{font-family:var(--font-mono);font-size:.72rem;color:var(--muted)}'
   +'.rvwhat{margin-left:auto;background:var(--sand);color:var(--deep);font-family:var(--font-mono);font-size:.66rem;padding:.22rem .55rem;border-radius:999px;white-space:nowrap}'
   +'.rvguar{margin-top:1.3rem;background:var(--abyss);color:var(--sand);border-radius:16px;padding:1.1rem 1.3rem;font-size:.9rem;line-height:1.65}'
   +'.rvguar b{color:var(--catch);display:block;font-family:var(--font-body);margin-bottom:.25rem}'
   +'.rvguar a{color:var(--foam)}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var WA_ICON='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 3.5 17.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-3.9c-.3-.5-.7-1.2-.7-2s.4-1.2.6-1.4c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c0 .1.1.3 0 .4l-.3.4-.2.3c-.1.1-.2.2 0 .5.2.3.7 1.1 1.4 1.8.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3v.9z"/></svg>';

  var cards = REVIEWS.map(function(r,i){
    return '<figure class="rv">'
      + '<span class="rvwa">' + WA_ICON + 'Real WhatsApp message</span>'
      + '<div class="rvbub"><p>' + esc(r.q) + '</p>'
      + (r.t ? '<time>' + esc(r.t) + '</time>' : '') + '</div>'
      + '<figcaption class="rvfoot">'
      + '<span class="rvav" style="background:' + TINT[i % TINT.length] + '">' + esc(initials(r.who)) + '</span>'
      + '<span class="rvname"><b>' + esc(r.who || 'A customer') + '</b>'
      + '<span>' + esc(r.where || '') + '</span></span>'
      + (r.what ? '<span class="rvwhat">' + esc(r.what) + '</span>' : '')
      + '</figcaption></figure>';
  }).join('');

  host.className='rvs';
  host.innerHTML='<span class="kick">Customer voices</span>'
    + '<h2>'+esc(REVIEWS_TITLE)+'</h2>'
    + '<p class="lede">'+esc(REVIEWS_LEDE)+'</p>'
    + '<div class="rvgrid">'+cards+'</div>'
    + '<div class="rvguar"><b>And if we get it wrong</b>'
    + 'Send a photo within 24 hours and we replace the item on your next order or refund it. '
    + 'We never ask you to send fish back. <a href="policies.html">Read the guarantee</a>.</div>';
})();
