# -*- coding: utf-8 -*-
"""MombasaFish — Ask the Fishmonger. Server-rendered answers + client-side filter."""
import json, html
e=lambda s: html.escape(str(s),quote=True)
BASE="https://mombasafish.com"
IMG={"changu":"changu.jpg","jodari":"jodari.jpg","nguru":"nguru.jpg","tewa":"tewa.jpg",
 "pono":"pono.jpg","simusimu":"simusimu.jpg","uwono":"uwono.jpg","una":"una.jpg",
 "papa":"papa.jpg","pweza":"pweza.jpg","ngisi":"ngisi.jpg","tafi":"tafi.jpg",
 "red-snapper":"red-snapper.jpg","kolekole":"kolekole.jpg","songoro":"songoro.jpg",
 "sulisuli":"sulisuli.jpg","sulisuli-kipanga":"sulisuli-kipanga.jpg","salmon":"salmon.jpg",
 "mkundaji":"mkundaji.jpg","kaa":"kaa.jpg","lobster":"lobster.jpg","chaza":"chaza.jpg",
 "kome":"kome.jpg","white-clams":"clams.jpg","prawns-tiger":"prawns-tiger.jpg",
 "prawns-cocktail":"prawns-cocktail.jpg","prawns-s2":"prawns-s2.jpg",
 "red-snapper-fillets":"fillets-snapper.jpg","tilapia-fillets":"fillets-tilapia.jpg",
 "mwani-msafi":"mwani-msafi.jpg"}
NAME={"changu":"Emperor Fish · Changu","jodari":"Tuna · Jodari","nguru":"King Fish · Nguru",
 "tewa":"Grouper · Tewa","pono":"Parrot Fish · Pono","simusimu":"Sardines · Simusimu",
 "uwono":"Anchovies · Uwono","una":"Indian Mackerel · Una","papa":"Shark Steak · Papa",
 "pweza":"Octopus · Pweza","ngisi":"Calamari · Ngisi","tafi":"Rabbit Fish · Tafi",
 "red-snapper":"Red Snapper","kolekole":"Trevally · Kolekole","songoro":"Cobia · Songoro",
 "sulisuli":"Sail Fish · Sulisuli","sulisuli-kipanga":"Swordfish","salmon":"Salmon (imported)",
 "mkundaji":"Red Mullet · Mkundaji","kaa":"Crab · Kaa","lobster":"Lobster","chaza":"Oysters · Chaza",
 "kome":"Mussels · Kome","white-clams":"White Clams","prawns-tiger":"Tiger Prawns",
 "prawns-cocktail":"Cocktail Prawns","prawns-s2":"Prawns S2",
 "red-snapper-fillets":"Red Snapper Fillets","tilapia-fillets":"Tilapia Fillets",
 "mwani-msafi":"Sea Moss · Mwani"}

Q=[
 dict(id="fewest-bones", tag=["family","easy"],
  q="Which fish has the fewest bones?",
  a="<p><b>Shark steak (papa) has no bones at all</b> — sharks have cartilage rather than bone, which is why coastal families give it to children and to older people who have given up on picking through a fish. After that, <b>changu</b> has the simplest bone structure of any reef fish on the slab, and <b>nguru</b> steaks have a single central bone and no fine pin bones.</p><p>If you want to avoid the question entirely, buy fillets. Boneless is boneless.</p>",
  fish=["papa","changu","nguru","red-snapper-fillets"]),
 dict(id="best-for-frying", tag=["cook","easy"],
  q="Which fish is best for frying?",
  a="<p><b>Changu</b> is the answer most Mombasa kitchens would give — score it, season it, fry it whole, and the flesh comes off in clean flakes. <b>Tafi</b> is the everyday choice and cheaper. <b>Mkundaji</b> is the one chefs quietly prefer: small, sweet, almost prawn-like, and it crisps beautifully.</p><p>For a snack rather than a meal, fry <b>simusimu</b> whole until the bones crunch.</p>",
  fish=["changu","tafi","mkundaji","simusimu"]),
 dict(id="best-for-grill", tag=["cook"],
  q="Which fish holds together on the charcoal?",
  a="<p>The grill punishes soft fish. You want dense flesh: <b>nguru</b> and <b>jodari</b> cut into thick steaks, <b>sulisuli kipanga</b> (swordfish), which behaves almost like beef on a grate, and <b>songoro</b>, which is fatty enough not to dry out.</p><p>Avoid pono and tafi over fierce heat — they are delicious, but they break up and fall through.</p>",
  fish=["nguru","jodari","sulisuli-kipanga","songoro"]),
 dict(id="most-omega-3", tag=["health","value"],
  q="Which fish is richest in omega-3?",
  a="<p>Small oily fish win, and they are the cheapest things we sell. <b>Simusimu</b> (sardines) and <b>una</b> (Indian mackerel) carry omega-3 close to salmon at a fraction of the price. <b>Uwono</b> (anchovies) are eaten whole, bones and all, so they deliver calcium as well.</p><p><b>Salmon</b> is higher still, but it is imported and costs roughly ten times as much per kilo. If omega-3 per shilling is what you are after, buy una.</p>",
  fish=["simusimu","una","uwono","salmon"]),
 dict(id="for-children", tag=["family","health"],
  q="What should I give children?",
  a="<p>Mild, boneless and small. <b>Papa</b> (shark steak) is entirely boneless. <b>Pono</b> is the sweetest, gentlest fish on the slab. <b>Tilapia fillets</b> are mild to the point of neutral, which is exactly what a suspicious child wants. <b>Changu</b> has few bones and a taste nobody objects to.</p><p>One caution: avoid large predatory fish for young children — swordfish and shark carry more mercury because they are big and long-lived. Small fish like sardines and una carry the least, and are the better regular choice.</p>",
  fish=["pono","tilapia-fillets","changu","simusimu"]),
 dict(id="best-value", tag=["value","family"],
  q="Which seafood gives the most for the money?",
  a="<p>Weight for weight and nutrient for shilling, <b>simusimu</b>, <b>uwono</b> and <b>una</b> are unbeatable — high protein, high omega-3, high calcium, lowest price on the page. Among larger fish, <b>tewa</b> and <b>pono</b> at KES 600/kg are the cheapest proper dinner fish we carry.</p><p>The Omega-3 Combo bundles all three small fish for less than buying them separately.</p>",
  fish=["una","simusimu","tewa","pono"]),
 dict(id="for-curry", tag=["cook"],
  q="Which fish is best for a coconut curry?",
  a="<p><b>Tewa</b> is the mchuzi wa samaki classic — it flakes into large clean pieces that soak up sauce instead of dissolving into it. <b>Changu</b> works the same way. For something richer, <b>kolekole</b> stands up to heavy spice better than any white fish.</p><p><b>Pweza</b> in coconut curry is the coastal delicacy, but it needs an hour of patient simmering first.</p>",
  fish=["tewa","changu","kolekole","pweza"]),
 dict(id="eat-raw", tag=["cook","health"],
  q="Which fish can I eat raw?",
  a="<p>Only <b>jodari</b> (tuna) landed and iced the same morning, and only if you tell us when you order so we handle it accordingly. <b>Salmon</b> is the other option, since it arrives cold-chained for that purpose.</p><p>Raw seafood always carries some risk. If you are pregnant, immunocompromised, elderly or feeding young children, cook it through instead — no fish is worth the gamble.</p>",
  fish=["jodari","salmon"]),
 dict(id="pregnancy", tag=["health","family"],
  q="Which seafood is safest during pregnancy?",
  a="<p>Small, short-lived, well-cooked fish. <b>Simusimu</b>, <b>uwono</b> and <b>una</b> carry the least mercury of anything we sell and are rich in the omega-3 that matters during pregnancy. <b>Changu</b> and <b>tewa</b> are safe, lean and mild.</p><p>What to avoid: <b>swordfish</b> and <b>shark</b>, which accumulate mercury as large predators, and anything raw — including tuna sashimi and raw oysters. This is general information and not medical advice; your own midwife or doctor knows your situation.</p>",
  fish=["simusimu","una","changu","tewa"]),
 dict(id="octopus-rubbery", tag=["cook"],
  q="How do I stop octopus going rubbery?",
  a="<p>Fast or slow, never in between. Either char it for 3–4 minutes over fierce heat, or simmer it for 45–60 minutes until a knife slides into the thickest part with no resistance. Anything between those two is where rubber lives.</p><p>Freezing genuinely helps — ice crystals break down the muscle fibres, so a frozen-then-thawed octopus cooks more tender than a fresh one. The same rule governs <b>ngisi</b> (calamari): two minutes hot, or thirty minutes slow.</p>",
  fish=["pweza","ngisi"]),
 dict(id="first-time", tag=["easy","family"],
  q="I have never cooked fish. Where do I start?",
  a="<p>Buy <b>changu</b>, ask for it cleaned and gutted, score it three times on each side, rub it with salt and lime, and fry it. It is forgiving, it has few bones, and it is very hard to ruin.</p><p>If frying a whole fish still feels like a lot, start with <b>tilapia fillets</b> — no bones, no scaling, no skin to worry about, and about four minutes in a pan.</p>",
  fish=["changu","tilapia-fillets","prawns-cocktail"]),
 dict(id="celebration", tag=["value"],
  q="What should I serve at a wedding or big celebration?",
  a="<p>Variety is what people remember. A whole <b>nguru</b> as the centrepiece, <b>lobster</b> and <b>kaa</b> for the eyes, <b>tiger prawns</b> and <b>ngisi</b> for the hands.</p><p>That is exactly what the Bwanaharusi Special contains — six kilos, one delivery, priced below the sum of its parts.</p>",
  fish=["nguru","lobster","kaa","prawns-tiger"]),
]
TAGS=[("all","Everything"),("family","For the family"),("health","Health"),
      ("cook","Cooking"),("value","Best value"),("easy","Easy to cook")]

faq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
  {"@type":"Question","name":q['q'],"acceptedAnswer":{"@type":"Answer","text":q['a']}} for q in Q]}
crumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":BASE+"/"},
  {"@type":"ListItem","position":2,"name":"Ask the Fishmonger","item":BASE+"/ask"}]}
NAV=[("index.html","Home"),("catalogue.html","Shop"),("fishguide.html","Fish Guide"),
     ("ask.html","Ask"),("recipes.html","Recipes"),("wholesale.html","Wholesale"),
     ("track.html","Track Order"),("blog.html","Blog"),("about.html","About"),("ecosystem.html","Ecosystem")]

p=['<!DOCTYPE html>','<html lang="en">','<head>','<meta charset="UTF-8">',
 '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
 '<title>Ask the Fishmonger — which fish should I buy? | MombasaFish</title>',
 '<meta name="description" content="Which fish has fewest bones? Which is best for frying? What should children eat? Straight answers from the counter, with the fish to buy for each.">',
 '<link rel="canonical" href="https://mombasafish.com/ask">',
 '<meta property="og:type" content="website"><meta property="og:locale" content="en_KE">',
 '<meta property="og:site_name" content="MombasaFish">',
 '<meta property="og:title" content="Ask the Fishmonger · MombasaFish">',
 '<meta property="og:description" content="Twelve questions people actually ask at the counter, answered properly — with the fish to buy for each one.">',
 '<meta property="og:url" content="https://mombasafish.com/ask">',
 '<meta property="og:image" content="https://mombasafish.com/images/catch-of-day.jpg">',
 '<meta name="twitter:card" content="summary_large_image">',
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
 '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
 '<link rel="icon" href="images/logo.jpg">',
 '<link rel="stylesheet" href="style.css">',
 '<script type="application/ld+json">%s</script>'%json.dumps(faq,ensure_ascii=False),
 '<script type="application/ld+json">%s</script>'%json.dumps(crumb,ensure_ascii=False),
 '</head>','<body>',
 '<div class="annc">Fresh catch daily · Order on WhatsApp <a href="https://wa.me/254787668888">0787 668 888</a> · Pay with M-Pesa</div>',
 '<header class="hdr">',
 '  <a class="logo" href="index.html"><img src="images/logo.jpg" alt="MombasaFish logo" width="34" height="34" style="width:34px;height:34px;border-radius:8px;object-fit:cover"><span class="wm">Mombasa<em>Fish</em></span></a>',
 '  <nav class="nav">']+['    <a href="%s"%s>%s</a>'%(u,' class="on"' if u=="ask.html" else '',t) for u,t in NAV]+[
 '  </nav>','</header>','',
 '<div class="wrap">',
 '<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">Home</a> › <span>Ask the Fishmonger</span></nav>',
 '<section>',
 '  <span class="kick">Ask the fishmonger</span>',
 '  <h1 class="sec">What should I <span>actually buy?</span></h1>',
 '  <p class="sec-sub">Twelve questions people ask us at the counter every week, answered the way we would answer them standing in front of the ice — and with the fish to buy for each one. No chatbot, no guessing. Just what we would tell you.</p>',
 '  <div class="filters" id="askfilters">']+[
 '    <button%s data-f="%s">%s</button>'%(' class="on"' if k=="all" else '',k,l) for k,l in TAGS]+[
 '  </div>','']
for q in Q:
    p.append('  <div class="askq" id="%s" data-t="%s">'%(q['id']," ".join(q['tag'])))
    p.append('    <h2>%s</h2>'%e(q['q']))
    p.append('    <div class="aska">%s</div>'%q['a'])
    p.append('    <div class="rel">')
    for f in q['fish']:
        p.append('      <a class="rcard" href="fish/%s.html"><img src="images/%s" alt="" loading="lazy" width="400" height="400"><span class="rn">%s</span><span class="rp">See this →</span></a>'%(f,IMG.get(f,"changu.jpg"),e(NAME.get(f,f))))
    p+=['    </div>','  </div>','']
p+=['  <p class="askmore">Not answered here? Message us on <a href="https://wa.me/254787668888">WhatsApp</a> — a person replies, usually within the hour. Or browse the <a href="fishguide.html">Fish Guide</a> for flavour, firmness and oil on every species.</p>',
 '</section>','</div>','',
 '<footer>','  <div class="cols">',
 '    <div><h2>Pages</h2><a href="index.html">Home</a><a href="catalogue.html">Shop</a><a href="ask.html">Ask</a><a href="recipes.html">Recipes</a><a href="wholesale.html">Wholesale</a></div>',
 '    <div><h2>Contact</h2><a href="https://wa.me/254787668888">WhatsApp: 0787 668 888</a><a href="https://maps.app.goo.gl/NTLTpW95RUBnPDsh9">📍 Mombasa Fish Shop — Google Maps</a><a href="policies.html">Policies &amp; privacy</a></div>',
 '    <div><h2>Follow us</h2><div class="social"><a href="https://web.facebook.com/mombasafishmarket">Facebook</a><a href="https://instagram.com/mombasafishmarket">Instagram</a><a href="https://youtube.com/mombasafish">YouTube</a><a href="https://tiktok.com/@mombasafish">TikTok</a><a href="https://x.com/mombasa_fish">X</a></div></div>',
 '  </div>',
 '  <p class="fine"><span class="wmf">Mombasa<em>Fish</em></span> — Market · Media · Academy · Ocean · Exports<br>Quality · Delivery · Freshness · Traceable to the Source<br>© 2026 MombasaFish</p>',
 '</footer>','',
 '<script>',
 '(function(){',
 '  var b=document.querySelectorAll("#askfilters button"), q=document.querySelectorAll(".askq");',
 '  b.forEach(function(x){x.addEventListener("click",function(){',
 '    b.forEach(function(y){y.classList.remove("on");}); x.classList.add("on");',
 '    var f=x.dataset.f;',
 '    q.forEach(function(el){',
 '      el.style.display=(f==="all"||(" "+el.dataset.t+" ").indexOf(" "+f+" ")>-1)?"":"none";',
 '    });',
 '  });});',
 '})();',
 '</script>',
 '<script src="search.js" defer></script>','<script src="ui.js" defer></script>',
 '<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "a0dfbad9d92441fe9afdaf972bb97acd"}\'></script><!-- End Cloudflare Web Analytics -->',
 '</body>','</html>']
open("ask.html","w",encoding="utf-8").write("\n".join(p))
print("ask.html written · questions:",len(Q))
