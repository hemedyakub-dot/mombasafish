# -*- coding: utf-8 -*-
import json, html, os, importlib.util
spec=importlib.util.spec_from_file_location("d","oe_data.py"); d=importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
FISH,CREATURES,LESSONS=d.FISH,d.CREATURES,d.LESSONS
e=lambda s: html.escape(str(s),quote=True)
BASE="https://mombasafish.com"
NAV=[("index.html","Home"),("catalogue.html","Shop"),("fishguide.html","Fish Guide"),
     ("ask.html","Ask"),("recipes.html","Recipes"),("shimoni.html","Why Shimoni"),
     ("ocean.html","Ocean Explorers"),("wholesale.html","Wholesale"),("track.html","Track Order"),
     ("blog.html","Blog"),("about.html","About"),("ecosystem.html","Ecosystem")]

def head(title,desc,url,img,extra_ld=None,up="",on=""):
    h=['<!DOCTYPE html>','<html lang="en">','<head>','<meta charset="UTF-8">',
     '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
     '<title>%s</title>'%e(title),'<meta name="description" content="%s">'%e(desc),
     '<link rel="canonical" href="%s">'%url,
     '<meta property="og:type" content="website"><meta property="og:locale" content="en_KE">',
     '<meta property="og:site_name" content="MombasaFish">',
     '<meta property="og:title" content="%s">'%e(title),
     '<meta property="og:description" content="%s">'%e(desc),
     '<meta property="og:url" content="%s">'%url,
     '<meta property="og:image" content="%s/images/%s">'%(BASE,img),
     '<meta name="twitter:card" content="summary_large_image">',
     '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
     '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
     '<link rel="icon" href="%simages/logo.jpg">'%up,'<link rel="stylesheet" href="%sstyle.css">'%up]
    for ld in (extra_ld or []): h.append('<script type="application/ld+json">%s</script>'%json.dumps(ld,ensure_ascii=False))
    h+=['</head>','<body class="oe">',
     '<div class="annc">Fresh catch daily · Order on WhatsApp <a href="https://wa.me/254787668888">0787 668 888</a> · Pay with M-Pesa</div>',
     '<header class="hdr">',
     '  <a class="logo" href="%sindex.html"><img src="%simages/logo.jpg" alt="MombasaFish logo" width="34" height="34" style="width:34px;height:34px;border-radius:8px;object-fit:cover"><span class="wm">Mombasa<em>Fish</em></span></a>'%(up,up),
     '  <nav class="nav">']+['    <a href="%s%s"%s>%s</a>'%(up,u,' class="on"' if u==on else '',t) for u,t in NAV]+['  </nav>','</header>','']
    return h

def foot(up=""):
    return ['<footer>','  <div class="cols">',
     '    <div><h2>Ocean Explorers</h2><a href="%socean.html">Start here</a><a href="%socean/creatures.html">Marine creatures</a><a href="%socean/classroom.html">Ocean classroom</a><a href="%socean/quiz.html">Quiz &amp; certificate</a><a href="%socean/teachers.html">Parents &amp; teachers</a></div>'%(up,up,up,up,up),
     '    <div><h2>MombasaFish</h2><a href="%sindex.html">Home</a><a href="%scatalogue.html">Shop</a><a href="%sshimoni.html">Why Shimoni</a><a href="%spolicies.html">Policies &amp; privacy</a></div>'%(up,up,up,up),
     '    <div><h2>Contact</h2><a href="https://wa.me/254787668888">WhatsApp: 0787 668 888</a><a href="mailto:mombasafish@gmail.com">mombasafish@gmail.com</a></div>',
     '  </div>',
     '  <p class="fine"><span class="wmf">Mombasa<em>Fish</em></span> — Market · Media · Academy · Ocean · Exports<br>Ocean Explorers is free to use, in class or at home.<br>© 2026 MombasaFish</p>',
     '</footer>','','<script src="%sui.js" defer></script>'%up,
     '<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "a0dfbad9d92441fe9afdaf972bb97acd"}\'></script><!-- End Cloudflare Web Analytics -->',
     '</body>','</html>']

HONEST = ('<div class="oenote">'
 '<h2>We sell fish. Here is how we think about that.</h2>'
 '<p>MombasaFish is a business that buys and sells seafood, so it is fair to ask why we would teach you to love the ocean.</p>'
 '<p>Here is the honest answer. People have fished this coast for thousands of years, and done carefully it can go on for thousands more. Done badly it cannot. The difference is in <em>how much</em> is taken, <em>what gear</em> is used, and whether animals are allowed to grow up and breed first.</p>'
 '<p><b>We never buy or sell</b> dolphins, turtles, protected sharks and rays, seahorses, or anything below the legal size. Those are not products. Some of them are protected by Kenyan law, and all of them are worth more alive.</p>'
 '<p><b>We do sell</b> fish caught by small boats using handlines, traps and small nets — the gear that takes what it aims at and leaves the reef standing.</p>'
 '<p>If you finish this section believing the ocean is worth looking after, we think that is good for everyone, including us.</p>'
 '</div>')

# ---------------- HUB ----------------
faq_ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name":"What is %s (%s)?"%(f['en'],f['sw']),
  "acceptedAnswer":{"@type":"Answer","text":"%s lives in %s and eats %s. %s"%(f['en'],f['home'].lower(),f['diet'].lower(),f['fun'][0])}} for f in FISH]}
course={"@context":"https://schema.org","@type":"LearningResource",
 "name":"Ocean Explorers — Kenya's coastal marine life for young learners",
 "description":"A free, illustrated introduction to the fish, creatures and habitats of Kenya's coast, for ages 6–15, their parents and their teachers.",
 "educationalLevel":"Primary and lower secondary","learningResourceType":"Interactive resource",
 "inLanguage":"en-KE","isAccessibleForFree":True,
 "provider":{"@type":"Organization","name":"MombasaFish","@id":BASE+"/#business"},
 "audience":{"@type":"EducationalAudience","educationalRole":["student","parent","teacher"]}}
p=head("Ocean Explorers — Kenya's marine life for young learners | MombasaFish",
  "A free illustrated guide to Kenya's fish, sea creatures and ocean habitats for ages 6-15. Fun facts, quizzes and lesson ideas for parents and teachers.",
  BASE+"/ocean","shimoni-beach.jpg",[course,faq_ld],"","ocean.html")
p+=['<div class="oehero">',
 '  <p class="oetag">Free · Ages 6–15 · Made in Kenya</p>',
 '  <h1>Ocean <span>Explorers</span></h1>',
 '  <p class="oesub">The Indian Ocean starts at our doorstep, and it is stranger than anything you have imagined. Octopuses with three hearts. Fish that make sand. Trees that drink salt water. Come and meet them.</p>',
 '  <div class="oebtns">',
 '    <a class="oebtn" href="#fish">Meet the fish</a>',
 '    <a class="oebtn" href="ocean/creatures.html">Sea creatures</a>',
 '    <a class="oebtn" href="ocean/classroom.html">Ocean classroom</a>',
 '    <a class="oebtn hot" href="ocean/quiz.html">Take the quiz</a>',
 '  </div>','</div>','',
 '<div class="wrap">','',
 '<section id="fish">',
 '  <span class="kick">Section one</span>',
 '  <h2 class="sec">Meet the <span>fish</span></h2>',
 '  <p class="sec-sub">Ten fish you will find in Kenyan waters. Every one of them is real, every fact is true, and most of them are stranger than you would guess. Tap a card to open it.</p>',
 '  <div class="oegrid">']
for f in FISH:
    p+=['    <details class="oecard">',
     '      <summary>',
     '        <img src="images/%s" alt="%s" loading="lazy" width="400" height="400">'%(f['img'],e(f['en'])),
     '        <span class="oename">%s</span>'%e(f['en']),
     '        <span class="oesw">%s · <i>say it:</i> %s</span>'%(e(f['sw']),e(f['say'])),
     '        <span class="oemore">Open →</span>',
     '      </summary>',
     '      <div class="oebody">',
     '        <p class="oesci">%s</p>'%e(f['sci']),
     '        <p><b>Where it lives:</b> %s</p>'%e(f['home']),
     '        <p><b>What it eats:</b> %s</p>'%e(f['diet']),
     '        <p class="oefun"><b>Three true things</b></p><ul>']
    for x in f['fun']: p.append('          <li>%s</li>'%e(x))
    p+=['        </ul>',
     '        <p class="oecons"><b>Looking after it:</b> %s</p>'%e(f['cons']),
     '      </div>','    </details>']
p+=['  </div>','</section>','',
 '<section>','  <span class="kick">Explore further</span>',
 '  <h2 class="sec">Where to <span>next?</span></h2>',
 '  <div class="oenav">',
 '    <a href="ocean/creatures.html"><b>Sea creatures</b><span>Dolphins, turtles, corals, crabs, seahorses and more — ten animals and habitats explained.</span></a>',
 '    <a href="ocean/classroom.html"><b>Ocean classroom</b><span>Eight lessons: reefs, mangroves, seagrass, tides, the monsoon winds, plastic and a warming sea.</span></a>',
 '    <a href="ocean/quiz.html"><b>Quiz &amp; certificate</b><span>Twelve questions. Get eight right and print your Ocean Explorer certificate.</span></a>',
 '    <a href="ocean/teachers.html"><b>Parents &amp; teachers</b><span>Lesson ideas, discussion questions and activities you can run with a class or at the kitchen table.</span></a>',
 '  </div>','</section>','',
 '<section>',HONEST,'</section>','',
 '</div>','']+foot()
open("ocean.html","w",encoding="utf-8").write("\n".join(p))

# ---------------- CREATURES ----------------
cfaq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name":"What is a %s?"%c['name'],"acceptedAnswer":{"@type":"Answer","text":c['what']}} for c in CREATURES]}
p=head("Sea Creatures of the Kenyan Coast — Ocean Explorers | MombasaFish",
 "Dolphins, turtles, octopus, crabs, lobsters, seahorses, rays, sea stars, coral reefs and mangroves — explained simply for young readers.",
 BASE+"/ocean/creatures","shimoni-beach.jpg",[cfaq],"../","ocean.html")
p+=['<div class="wrap">',
 '<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="../ocean.html">Ocean Explorers</a> › <span>Sea creatures</span></nav>',
 '<section>','  <span class="kick">Section two</span>',
 '  <h1 class="sec">Sea <span>creatures</span></h1>',
 '  <p class="sec-sub">Ten animals and habitats of the Kenyan coast. Some you can eat, some you must never touch, and the difference matters.</p>',
 '  <div class="oelist">']
for c in CREATURES:
    p+=['    <article class="oecre">',
     '      <h2>%s <span class="oesw2">%s · <i>say it:</i> %s</span></h2>'%(e(c['name']),e(c['sw']),e(c['say'])),
     '      <p class="oesci">%s</p>'%e(c['sci']),
     '      <p class="oewhat">%s</p>'%e(c['what']),
     '      <p class="oefun"><b>Three true things</b></p><ul>']
    for x in c['facts']: p.append('        <li>%s</li>'%e(x))
    p+=['      </ul>',
     '      <p class="oewhere"><b>Where you find it here:</b> %s</p>'%e(c['where']),
     '      <p class="oecons"><b>Looking after it:</b> %s</p>'%e(c['protect']),
     '    </article>']
p+=['  </div>','  <p style="margin-top:1.6rem"><a class="oebtn" href="classroom.html">Next: Ocean classroom →</a> <a class="oebtn hot" href="quiz.html">Take the quiz</a></p>',
 '</section>','</div>','']+foot("../")
open("ocean/creatures.html","w",encoding="utf-8").write("\n".join(p))

# ---------------- CLASSROOM ----------------
lfaq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name":l['q'],"acceptedAnswer":{"@type":"Answer","text":" ".join(l['body'])}} for l in LESSONS]}
p=head("Ocean Classroom — reefs, mangroves, tides and the monsoon | MombasaFish",
 "Eight short lessons about Kenya's ocean: coral reefs, mangroves, seagrass, tides, the Kaskazi and Kusi monsoons, sustainable fishing, plastic and climate change.",
 BASE+"/ocean/classroom","mwani-farm.jpg",[lfaq],"../","ocean.html")
p+=['<div class="wrap">',
 '<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="../ocean.html">Ocean Explorers</a> › <span>Ocean classroom</span></nav>',
 '<section>','  <span class="kick">Section three</span>',
 '  <h1 class="sec">Ocean <span>classroom</span></h1>',
 '  <p class="sec-sub">Eight lessons about how this ocean works. Each one answers a single question, and each one is about the coast outside your window rather than an ocean somewhere else.</p>',
 '  <div class="oelessons">']
for i,l in enumerate(LESSONS):
    p+=['    <article class="oeles" id="%s">'%l['slug'],
     '      <span class="oenum">Lesson %d</span>'%(i+1),
     '      <h2>%s</h2>'%e(l['title']),
     '      <p class="oeq">%s</p>'%e(l['q'])]
    for b in l['body']: p.append('      <p>%s</p>'%e(b))
    p+=['      <p class="oedid"><b>Did you know?</b> %s</p>'%e(l['did']),'    </article>']
p+=['  </div>',
 '  <p style="margin-top:1.6rem"><a class="oebtn hot" href="quiz.html">Test yourself →</a> <a class="oebtn" href="teachers.html">For parents &amp; teachers</a></p>',
 '</section>','</div>','']+foot("../")
open("ocean/classroom.html","w",encoding="utf-8").write("\n".join(p))
print("hub + creatures + classroom written")
