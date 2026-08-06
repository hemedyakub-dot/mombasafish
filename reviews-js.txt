/* ============================================================
   MOMBASAFISH — CUSTOMER VOICES
   ------------------------------------------------------------
   Paste real customer words below. Nothing appears on the site
   until you add at least one — an empty list renders nothing.

   Each entry:
     q     the quote, in their words. Leave the phrasing alone.
           Slightly awkward English reads as real; polished
           marketing English reads as invented.
     who   first name and last initial is enough  ->  "Amina H."
     where county or town                          ->  "Nairobi"
     what  what they ordered (optional)            ->  "Nguru, 3 kg"

   Only publish words a customer actually sent you. Inventing
   testimonials is dishonest, it breaches the Kenya Consumer
   Protection Act, and one person recognising a fake quote
   costs more trust than twenty real ones earn.
   ============================================================ */
var REVIEWS = [

  { q:"Loved the customer service, everything is so seamless. From the sea to my door step in Kiambu. Will be ordering again.",
    who:"Joy N.", where:"Kiambu" },

  { q:"Shukran jazakallah, nimereceive plus they are fresh mashallah. Zikiisha will order more, inshaAllah.",
    who:"Dalia", where:"Kisumu" },

  { q:"Amazing. We shall support you hadi uwe state supplier. Shukran!",
    who:"Prize M.", where:"South C, Nairobi" },

];

var REVIEWS_TITLE = "What our customers say";
var REVIEWS_LEDE  = "Real messages from real orders — not one of them written by us.";

/* ===================== END OF EDITING ====================== */

(function(){
  var host = document.getElementById('reviews');
  if(!host || !REVIEWS || !REVIEWS.length) return;   // nothing to show, show nothing

  function esc(s){
    return String(s||'').replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }

  var css='.rvs{border-top:1px solid var(--line);padding-top:2rem;margin:2.6rem 0}'
   +'.rvs .kick{display:block;font-family:var(--font-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--coral);margin-bottom:.5rem}'
   +'.rvs h2{font-family:var(--font-display);font-size:clamp(1.3rem,4vw,1.9rem);color:var(--abyss);margin-bottom:.4rem}'
   +'.rvs .lede{color:var(--muted);font-size:.92rem;margin-bottom:1.4rem;max-width:40rem}'
   +'.rvgrid{display:grid;gap:.9rem;grid-template-columns:1fr}'
   +'@media(min-width:640px){.rvgrid{grid-template-columns:1fr 1fr}}'
   +'@media(min-width:980px){.rvgrid{grid-template-columns:repeat(3,1fr)}}'
   +'.rv{background:var(--white);border:1px solid var(--line);border-radius:16px;padding:1.15rem 1.25rem;box-shadow:0 2px 12px rgba(3,42,46,.05);display:flex;flex-direction:column}'
   +'.rv blockquote{font-size:.95rem;line-height:1.65;color:var(--ink);margin:0 0 .9rem;position:relative}'
   +'.rv blockquote::before{content:"\\201C";font-family:var(--font-display);font-size:2.4rem;color:var(--foam);line-height:0;position:absolute;left:-.15rem;top:.7rem}'
   +'.rv blockquote span{display:block;padding-left:1.1rem}'
   +'.rv .who{margin-top:auto;font-family:var(--font-mono);font-size:.76rem;color:var(--muted);letter-spacing:.02em}'
   +'.rv .who b{color:var(--abyss);font-family:var(--font-body);font-size:.86rem;display:block;letter-spacing:0}'
   +'.rv .what{display:inline-block;margin-top:.45rem;background:var(--sand);color:var(--deep);font-family:var(--font-mono);font-size:.68rem;padding:.2rem .55rem;border-radius:999px}'
   +'.rvguar{margin-top:1.2rem;background:var(--abyss);color:var(--sand);border-radius:16px;padding:1.1rem 1.3rem;font-size:.9rem;line-height:1.65}'
   +'.rvguar b{color:var(--catch);display:block;font-family:var(--font-body);margin-bottom:.25rem}'
   +'.rvguar a{color:var(--foam)}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var cards = REVIEWS.map(function(r){
    return '<figure class="rv">'
      + '<blockquote><span>'+esc(r.q)+'</span></blockquote>'
      + '<figcaption class="who"><b>'+esc(r.who)+'</b>'+esc(r.where||'')
      + (r.what ? '<span class="what">'+esc(r.what)+'</span>' : '')
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
