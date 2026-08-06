# -*- coding: utf-8 -*-
"""MombasaFish Recipe Box — content + generator. Edit R below, then re-run."""
import json, os, html, re
e=lambda s: html.escape(str(s),quote=True)
BASE="https://mombasafish.com"

R=[
 dict(slug="samaki-wa-kupaka", sw="Samaki wa Kupaka", en="Coconut-Grilled Fish",
  img="changu.jpg", cat="Main course", cuisine="Swahili", yield_="Serves 4",
  prep=20, cook=30, fish=[("changu","Emperor Fish · Changu"),("pono","Parrot Fish · Pono")],
  lede="The dish the Swahili coast is known for. Fish is grilled once, painted with a thick coconut sauce, then grilled again so the sauce catches and darkens at the edges. <em>Kupaka</em> means to smear — and that is the whole technique.",
  ing=["1 whole fish, about 1–1.5 kg, cleaned and scored on both sides",
       "400 ml thick coconut milk (tui la kwanza)","4 cloves garlic, crushed",
       "1 thumb ginger, grated","2 tbsp tamarind paste (ukwaju)","1 tsp turmeric",
       "1 tsp ground cumin","2 red chillies (pilipili), chopped","Juice of 2 limes",
       "Salt to taste","Oil for the grill"],
  steps=["Score the fish three or four times on each side, cutting to the bone. Rub with lime juice, salt and half the turmeric. Leave 20 minutes.",
   "Grill over medium charcoal for 6–8 minutes a side, until just cooked and lightly coloured. Do not cook it through — it goes back on the fire later.",
   "While it grills, make the sauce. Fry the garlic, ginger and chilli in a little oil for two minutes until fragrant.",
   "Add the remaining turmeric and the cumin, stir for thirty seconds, then pour in the coconut milk and the tamarind. Simmer gently, uncovered, 10–15 minutes until it thickens enough to coat a spoon.",
   "Taste. It should be sour, sweet, salty and hot all at once. Adjust with lime, salt or chilli.",
   "Paint the fish generously with the sauce on both sides. Return to the fire for 3–4 minutes a side, painting again each time you turn it, until the edges darken.",
   "Serve with the remaining sauce poured over, alongside coconut rice and kachumbari."],
  tips=["Use the first pressing of the coconut — <em>tui la kwanza</em> — for the sauce. The second pressing is too thin and will not cling to the fish.",
        "If the sauce splits, take it off the heat and whisk in a spoonful of cold coconut milk.",
        "No charcoal? A very hot oven grill works, but you lose the smoke, which is half the dish."]),

 dict(slug="mchuzi-wa-pweza", sw="Mchuzi wa Pweza", en="Octopus in Coconut Curry",
  img="pweza.jpg", cat="Main course", cuisine="Swahili", yield_="Serves 4",
  prep=15, cook=75, fish=[("pweza","Octopus · Pweza")],
  lede="Octopus rewards patience and punishes impatience. Simmer it slowly until a knife slides in without resistance, then let it finish in coconut milk. Rushed octopus is rubber; this is not.",
  ing=["1 kg octopus, cleaned","400 ml coconut milk","2 onions, sliced thin",
       "3 tomatoes, chopped","4 cloves garlic, crushed","1 thumb ginger, grated",
       "1 tbsp curry powder","1 tsp ground coriander","2 green chillies, split",
       "Juice of 1 lime","A handful of fresh coriander","Salt to taste","Oil"],
  steps=["Put the octopus in a heavy pot with no water — it releases plenty of its own. Cover and cook on a low heat for 45–60 minutes, until a knife pushes into the thickest part with no resistance.",
   "Lift it out, keep the liquid, and cut into bite-sized pieces.",
   "In another pan, fry the onions slowly in oil until soft and golden — eight minutes at least. This is where the sweetness comes from.",
   "Add garlic, ginger and chilli. Fry two minutes. Add the curry powder and coriander and stir for thirty seconds.",
   "Add the tomatoes and cook down until the oil separates out at the edges.",
   "Return the octopus with a little of its cooking liquid. Pour in the coconut milk. Simmer gently 15 minutes — do not boil hard, or the coconut splits.",
   "Finish with lime juice and fresh coriander. Serve with rice or chapati."],
  tips=["Freezing octopus before cooking genuinely tenderises it — ice crystals break down the muscle fibres. A frozen-then-thawed octopus cooks softer than a fresh one.",
        "The rule is fast or slow. Under 10 minutes or over 45. Anything in between is where rubber lives.",
        "Some coastal cooks drop a copper coin or a cork in the pot. It does nothing, but the tradition is charming."]),

 dict(slug="nguru-biryani", sw="Biryani ya Nguru", en="Kingfish Biryani",
  img="nguru-steaks.jpg", cat="Main course", cuisine="Swahili", yield_="Serves 6",
  prep=40, cook=60, fish=[("nguru","King Fish · Nguru")],
  lede="Biryani is the dish of celebration on this coast, and nguru is the fish for it — dense enough to hold its shape through the spicing, the layering and the steam. A softer fish would vanish into the rice.",
  ing=["1 kg nguru, cut into thick steaks or large chunks","500 g basmati rice",
       "3 large onions, sliced very thin","4 tomatoes, chopped","200 g plain yoghurt",
       "6 cloves garlic and 1 thumb ginger, made into a paste","2 tbsp biryani masala",
       "1 tsp turmeric","4 cardamom pods, 1 cinnamon stick, 4 cloves",
       "A pinch of saffron in 3 tbsp warm milk","Fresh coriander and mint","Juice of 1 lime","Salt","Oil"],
  steps=["Marinate the fish in yoghurt, garlic-ginger paste, turmeric, half the masala, lime and salt. Leave 30 minutes — no longer, or the lime starts to cook it.",
   "Fry the onions in plenty of oil until deep brown and crisp. Take out two-thirds and set aside; this is the flavour of the dish and it cannot be hurried.",
   "To the remaining onions add the whole spices, then the tomatoes and the rest of the masala. Cook until thick and the oil separates.",
   "Add the fish and its marinade. Cook gently 8–10 minutes — it will finish in the steam. Handle it as little as possible.",
   "Meanwhile boil the rice in well-salted water with a cardamom pod until 70% done — still firm at the centre. Drain.",
   "Layer: half the rice, all the fish and sauce, the fried onions, herbs, then the rest of the rice. Spoon the saffron milk over the top.",
   "Cover tightly, put on the lowest possible heat, and steam 20–25 minutes. Do not lift the lid.",
   "Bring it to the table in the pot and fold it open in front of everyone. That is part of it."],
  tips=["Undercook the rice. It absorbs more moisture in the steam, and mushy biryani cannot be rescued.",
        "The brown onions are not a garnish — they are the backbone of the flavour. Fry more than you think you need.",
        "Serve with kachumbari and a bowl of plain yoghurt to cut the richness."]),

 dict(slug="kamba-wa-nazi", sw="Kamba wa Nazi", en="Coconut Prawns",
  img="prawns-tiger.jpg", cat="Main course", cuisine="Swahili", yield_="Serves 4",
  prep=15, cook=20, fish=[("prawns-tiger","Tiger Prawns"),("prawns-s1","Prawns S1")],
  lede="Fifteen minutes from pan to table, and the most reliable way to make people think you can cook. The only way to ruin it is to leave the prawns in too long.",
  ing=["800 g prawns, shell on or peeled","400 ml coconut milk","2 onions, finely chopped",
       "3 tomatoes, grated","4 cloves garlic, crushed","1 thumb ginger, grated",
       "2 green chillies, split","1 tsp turmeric","1 tsp ground cumin",
       "Juice of 1 lime","Fresh coriander","Salt","Oil"],
  steps=["If using shell-on prawns, leave the shells — they carry flavour into the sauce and protect the meat.",
   "Fry the onions in oil until soft and translucent, about six minutes.",
   "Add garlic, ginger and chilli. Two minutes. Then the turmeric and cumin, thirty seconds more.",
   "Add the grated tomato and cook until it darkens and the oil comes to the surface.",
   "Pour in the coconut milk and simmer five minutes to thicken slightly.",
   "Add the prawns. They need 3–4 minutes only — the moment they curl and turn opaque, they are done. Take the pan off the heat.",
   "Lime juice, coriander, and straight to the table with rice or chapati."],
  tips=["Prawns keep cooking in a hot sauce after the heat is off. Pull them a shade early.",
        "Shell-on gives a better sauce; peeled is easier to eat. Ask for peeled and deveined at checkout if you want both hands free.",
        "Frozen prawns should be thawed in the fridge, then patted dry, or they water the sauce down."]),

 dict(slug="simusimu-wa-kukaanga", sw="Simusimu wa Kukaanga", en="Crispy Fried Sardines",
  img="simusimu.jpg", cat="Snack", cuisine="Swahili", yield_="Serves 4",
  prep=10, cook=15, fish=[("simusimu","Sardines · Simusimu"),("uwono","Anchovies · Uwono")],
  lede="The cheapest, most nutritious thing on the whole slab, and arguably the best. Fried until the bones go crisp, sardines are eaten whole — which is where the calcium is.",
  ing=["1 kg sardines, gutted, heads on or off as you prefer","1 cup maize flour or plain flour",
       "1 tsp turmeric","1 tsp chilli powder","1 tsp garlic powder or 3 crushed cloves",
       "Juice of 2 limes","Salt","Oil for shallow frying","Lime wedges and kachumbari to serve"],
  steps=["Rinse the sardines and pat them properly dry. Wet fish will not crisp.",
   "Toss with lime juice, salt, garlic and half the chilli. Leave 10 minutes.",
   "Mix the flour with the turmeric and remaining chilli. Coat each fish, shaking off the excess.",
   "Heat 1 cm of oil until a pinch of flour sizzles immediately. Too cool and they soak up oil; too hot and they burn before the bones soften.",
   "Fry in batches, not crowded, 3–4 minutes a side until deep golden and crisp.",
   "Drain on paper. Salt while still hot. Eat with lime and kachumbari, bones and all."],
  tips=["The bones should crunch. If they do not, the oil was not hot enough or they came out too soon.",
        "Do not crowd the pan — the temperature drops and you get soft, oily fish.",
        "Sardines are among the lowest-mercury fish in the sea because they are small and short-lived. Eat them often."]),

 dict(slug="mchuzi-wa-samaki", sw="Mchuzi wa Samaki", en="Swahili Fish Curry",
  img="tewa.jpg", cat="Main course", cuisine="Swahili", yield_="Serves 4",
  prep=15, cook=30, fish=[("tewa","Grouper · Tewa"),("changu","Emperor Fish · Changu")],
  lede="The everyday coastal curry — the one that gets made on a Tuesday without anyone thinking about it. Tewa is the classic choice because it flakes into large clean pieces that soak up sauce instead of dissolving into it.",
  ing=["800 g tewa or changu, cut into thick pieces","400 ml coconut milk",
       "2 onions, sliced","4 tomatoes, chopped","4 cloves garlic, crushed",
       "1 thumb ginger, grated","1 tbsp curry powder","1 tsp cumin","1 tsp coriander",
       "2 green chillies","1 tbsp tamarind paste","Fresh coriander","Salt","Oil"],
  steps=["Season the fish with salt and a little turmeric. Set aside.",
   "Fry the onions until golden — do not rush this, it is where the depth comes from.",
   "Add garlic, ginger, chilli, then the dry spices. Fry until they smell toasted, about a minute.",
   "Add the tomatoes. Cook down 8–10 minutes until thick and the oil separates.",
   "Pour in the coconut milk and the tamarind. Simmer five minutes.",
   "Slide the fish in. Do not stir — shake the pan instead, or it will break up. Simmer gently 8–10 minutes until the fish flakes at the touch of a fork.",
   "Coriander over the top. Serve with rice, ugali or chapati."],
  tips=["Never boil coconut milk hard — it splits. A lazy simmer is all it wants.",
        "Add the fish last and move it as little as possible.",
        "Leftover curry is better the next day, but reheat it gently."]),

 dict(slug="ngisi-wa-kuchoma", sw="Ngisi wa Kuchoma", en="Grilled Calamari",
  img="ngisi.jpg", cat="Starter", cuisine="Swahili", yield_="Serves 4",
  prep=15, cook=8, fish=[("ngisi","Calamari · Ngisi")],
  lede="Two minutes on fierce heat and it is perfect. Three and it is ruined. Calamari follows the same law as octopus — very fast or very slow, never the middle.",
  ing=["800 g calamari, cleaned, tubes scored and cut into wide strips",
       "4 cloves garlic, crushed","2 red chillies, chopped","Juice of 2 limes",
       "3 tbsp oil","1 tsp smoked or plain paprika","Fresh coriander","Salt and black pepper"],
  steps=["Score the inside of the tubes in a criss-cross pattern, cutting halfway through. This helps it curl and holds the marinade.",
   "Toss with garlic, chilli, paprika, oil and half the lime. Fifteen minutes only — lime any longer starts to cook it.",
   "Get the grill or a heavy pan as hot as it will go. This is not a dish for medium heat.",
   "Cook in a single layer, 1 minute a side. It should char in places and curl. That is done.",
   "Off the heat immediately. Remaining lime, coriander, salt, pepper. Eat straight away."],
  tips=["If it went rubbery, the answer is not less heat — it is less time.",
        "Dry the calamari well before it hits the pan or it steams instead of charring.",
        "Rings are easier; scored tubes look better and hold sauce."]),

 dict(slug="supu-ya-kome", sw="Supu ya Kome", en="Coconut Mussel Soup",
  img="kome.jpg", cat="Soup", cuisine="Swahili", yield_="Serves 4",
  prep=20, cook=15, fish=[("kome","Mussels · Kome"),("white-clams","White Clams")],
  lede="Ten minutes of cooking and a broth worth mopping up with bread. Mussels make their own stock as they open, which does most of the work for you.",
  ing=["1.5 kg mussels, scrubbed and bearded","400 ml coconut milk","1 onion, finely chopped",
       "4 cloves garlic, crushed","1 thumb ginger, grated","2 green chillies, split",
       "1 tsp turmeric","Juice of 1 lime","Fresh coriander","Salt","Oil","Bread to serve"],
  steps=["Scrub the mussels and pull off the beards. Throw away any that are open and will not close when you tap them.",
   "Fry the onion, garlic, ginger and chilli gently until soft — five minutes, no colour.",
   "Add turmeric, stir, then pour in the coconut milk and bring to a bare simmer.",
   "Tip in the mussels and put the lid on. Five to six minutes, shaking the pot once.",
   "They are ready when the shells have opened. Discard any that stayed shut.",
   "Lime, coriander, and bread for the broth — which is the best part."],
  tips=["An unopened mussel after cooking should be thrown away, not forced.",
        "Clams work the same way but need purging first: an hour in cold salted water and they spit out their sand.",
        "Do not add salt until the end. Mussels bring their own seawater."]),
]

NAV=[("index.html","Home"),("catalogue.html","Shop"),("fishguide.html","Fish Guide"),
     ("recipes.html","Recipes"),("track.html","Track Order"),("blog.html","Blog"),
     ("about.html","About"),("ecosystem.html","Ecosystem")]
IMGMAP={"changu":"changu.jpg","pono":"pono.jpg","pweza":"pweza.jpg","nguru":"nguru.jpg",
 "prawns-tiger":"prawns-tiger.jpg","prawns-s1":"prawns-s1.jpg","simusimu":"simusimu.jpg",
 "uwono":"uwono.jpg","tewa":"tewa.jpg","ngisi":"ngisi.jpg","kome":"kome.jpg","white-clams":"clams.jpg"}

def head(r,up=".."):
    url="%s/recipes/%s"%(BASE,r['slug'])
    img="%s/images/%s"%(BASE,r['img'])
    ld={"@context":"https://schema.org","@type":"Recipe","name":"%s (%s)"%(r['sw'],r['en']),
     "image":[img],"description":re.sub(r'<[^>]+>','',r['lede'])[:300],
     "author":{"@type":"Organization","name":"MombasaFish"},
     "datePublished":"2026-08-06","recipeCategory":r['cat'],"recipeCuisine":r['cuisine'],
     "recipeYield":r['yield_'],"prepTime":"PT%dM"%r['prep'],"cookTime":"PT%dM"%r['cook'],
     "totalTime":"PT%dM"%(r['prep']+r['cook']),"inLanguage":"en-KE",
     "keywords":", ".join([r['sw'],r['en'],"Swahili recipe","Kenyan seafood"]),
     "recipeIngredient":r['ing'],
     "recipeInstructions":[{"@type":"HowToStep","position":i+1,"text":s} for i,s in enumerate(r['steps'])]}
    crumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":BASE+"/"},
      {"@type":"ListItem","position":2,"name":"Recipes","item":BASE+"/recipes"},
      {"@type":"ListItem","position":3,"name":r['sw'],"item":url}]}
    h=['<!DOCTYPE html>','<html lang="en">','<head>','<meta charset="UTF-8">',
     '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
     '<title>%s (%s) — Swahili coast recipe | MombasaFish</title>'%(e(r['sw']),e(r['en'])),
     '<meta name="description" content="%s">'%e(re.sub(r'<[^>]+>','',r['lede'])[:155]),
     '<link rel="canonical" href="%s">'%url,
     '<meta property="og:type" content="article">','<meta property="og:locale" content="en_KE">',
     '<meta property="og:site_name" content="MombasaFish">',
     '<meta property="og:title" content="%s — %s">'%(e(r['sw']),e(r['en'])),
     '<meta property="og:description" content="%s">'%e(re.sub(r'<[^>]+>','',r['lede'])[:155]),
     '<meta property="og:url" content="%s">'%url,'<meta property="og:image" content="%s">'%img,
     '<meta name="twitter:card" content="summary_large_image">',
     '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
     '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
     '<link rel="icon" href="%s/images/logo.jpg">'%up,'<link rel="stylesheet" href="%s/style.css">'%up,
     '<script type="application/ld+json">%s</script>'%json.dumps(ld,ensure_ascii=False),
     '<script type="application/ld+json">%s</script>'%json.dumps(crumb,ensure_ascii=False),
     '</head>','<body>',
     '<div class="annc">Fresh catch daily · Order on WhatsApp <a href="https://wa.me/254787668888">0787 668 888</a> · Pay with M-Pesa</div>',
     '<header class="hdr">',
     '  <a class="logo" href="%s/index.html"><img src="%s/images/logo.jpg" alt="MombasaFish logo" width="34" height="34" style="width:34px;height:34px;border-radius:8px;object-fit:cover"><span class="wm">Mombasa<em>Fish</em></span></a>'%(up,up),
     '  <nav class="nav">']+['    <a href="%s/%s">%s</a>'%(up,u,t) for u,t in NAV]+['  </nav>','</header>','']
    return h

def build(r,others):
    h=head(r)
    h+=['<div class="wrap">',
     '<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="../recipes.html">Recipes</a> › <span>%s</span></nav>'%e(r['sw']),
     '<article class="art rcp">',
     '  <p class="artmeta"><span class="pill">%s · %s</span><span>%s</span> · %d min total</p>'%(e(r['cuisine']),e(r['cat']),e(r['yield_']),r['prep']+r['cook']),
     '  <h1>%s</h1>'%e(r['sw']),
     '  <p class="rcpen">%s</p>'%e(r['en']),
     '  <p class="artlede">%s</p>'%r['lede'],
     '  <img class="arthero" src="../images/%s" alt="%s" loading="lazy" width="1200" height="675">'%(r['img'],e(r['en'])),
     '  <div class="rcpmeta"><div><b>Prep</b><span>%d min</span></div><div><b>Cook</b><span>%d min</span></div><div><b>Serves</b><span>%s</span></div><div><b>Cuisine</b><span>%s</span></div></div>'%(r['prep'],r['cook'],e(r['yield_'].replace('Serves ','')),e(r['cuisine'])),
     '  <div class="rcpgrid">',
     '    <section class="rcping"><h2>Ingredients</h2><ul>']
    for i in r['ing']: h.append('      <li>%s</li>'%e(i))
    h+=['    </ul></section>','    <section class="rcpstep"><h2>Method</h2><ol>']
    for s in r['steps']: h.append('      <li>%s</li>'%e(s))
    h+=['    </ol></section>','  </div>',
     '  <section class="psec"><h2>Tips from the counter</h2><ul class="rcptips">']
    for t in r['tips']: h.append('    <li>%s</li>'%t)
    h+=['  </ul></section>',
     '  <section class="psec"><h2>What you need from us</h2><div class="rel">']
    for slug,label in r['fish']:
        h.append('    <a class="rcard" href="../fish/%s.html"><img src="../images/%s" alt="" loading="lazy" width="400" height="400"><span class="rn">%s</span><span class="rp">Order this →</span></a>'%(slug,IMGMAP.get(slug,"changu.jpg"),e(label)))
    h+=['  </div></section>','</article>',
     '<section class="psec"><h2>More from the Swahili kitchen</h2><ul class="morelist">']
    for o in [x for x in others if x['slug']!=r['slug']][:4]:
        h.append('  <li><a href="%s.html"><b>%s</b><span>%s · %d min</span></a></li>'%(o['slug'],e(o['sw']),e(o['en']),o['prep']+o['cook']))
    h+=['</ul><p style="margin-top:1rem"><a class="btn btn-coral" href="../recipes.html">← All recipes</a></p></section>',
     '</div>','',
     '<footer>','  <div class="cols">',
     '    <div><h2>Pages</h2><a href="../index.html">Home</a><a href="../catalogue.html">Shop</a><a href="../recipes.html">Recipes</a><a href="../fishguide.html">Fish Guide</a><a href="../blog.html">Blog</a></div>',
     '    <div><h2>Contact</h2><a href="https://wa.me/254787668888">WhatsApp: 0787 668 888</a><a href="https://maps.app.goo.gl/NTLTpW95RUBnPDsh9">📍 Mombasa Fish Shop — Google Maps</a><a href="../policies.html">Policies &amp; privacy</a></div>',
     '    <div><h2>Follow us</h2><div class="social"><a href="https://web.facebook.com/mombasafishmarket">Facebook</a><a href="https://instagram.com/mombasafishmarket">Instagram</a><a href="https://youtube.com/mombasafish">YouTube</a><a href="https://tiktok.com/@mombasafish">TikTok</a><a href="https://x.com/mombasa_fish">X</a></div></div>',
     '  </div>',
     '  <p class="fine"><span class="wmf">Mombasa<em>Fish</em></span> — Market · Media · Academy · Ocean · Exports<br>Quality · Delivery · Freshness · Traceable to the Source<br>© 2026 MombasaFish</p>',
     '</footer>','','<script src="../ui.js" defer></script>',
     '<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "a0dfbad9d92441fe9afdaf972bb97acd"}\'></script><!-- End Cloudflare Web Analytics -->',
     '</body>','</html>']
    return "\n".join(h)

os.makedirs("recipes",exist_ok=True)
for r in R: open("recipes/%s.html"%r['slug'],"w",encoding="utf-8").write(build(r,R))
json.dump([{k:r[k] for k in ("slug","sw","en","img","prep","cook","yield_","cat","lede")} for r in R],
          open("recipes-index.json","w"),ensure_ascii=False,indent=1)
print("recipe pages:",len(R))
