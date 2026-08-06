# -*- coding: utf-8 -*-
"""Split blog.html into /blog/<id>.html article pages + rebuild blog.html as an index."""
import re, os, json, html, datetime

SRC=open("blog.html",encoding="utf-8").read()
BASE="https://mombasafish.com"
posts=[]
for m in re.finditer(r'<details class="post" data-p="([a-z]+)" id="([a-z0-9-]+)">\s*<summary>\s*<span class="pill">([^<]*)</span>\s*<h3>(.*?)</h3>\s*<span class="ex">(.*?)</span>\s*</summary>\s*<div class="body">([\s\S]*?)</div>\s*</details>', SRC):
    cat,pid,pill,title,ex,body=m.groups()
    catname,_,date=pill.partition('·')
    posts.append(dict(cat=cat,id=pid,catname=catname.strip(),date=date.strip(),
                      title=title.strip(),ex=ex.strip(),body=body.strip()))
print("parsed posts:",len(posts))
assert len(posts)>=7, "parser missed posts"

MONTHS={'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
def iso(d):
    try:
        p=d.split(); return "%s-%02d-%02d"%(p[2],MONTHS[p[1]],int(p[0]))
    except Exception: return "2026-07-25"

# hero image per post
IMG={"sofia-ghost-fishing":"shimoni-beach.jpg","sofia-launch":"shimoni-beach.jpg",
     "cook-nguru":"nguru-steaks.jpg","cook-jodari":"jodari.jpg","blue-economy":"mwani-farm.jpg",
     "five-recipes":"changu.jpg","boat-to-box":"catch-of-day.jpg"}
# contextual product links appended to each article
LINKS={"cook-nguru":[("nguru","King Fish · Nguru"),("jodari","Tuna · Jodari")],
       "cook-jodari":[("jodari","Tuna · Jodari"),("nguru","King Fish · Nguru")],
       "five-recipes":[("changu","Emperor Fish · Changu"),("pweza","Octopus · Pweza"),("prawns-tiger","Tiger Prawns"),("jodari","Tuna · Jodari")],
       "blue-economy":[("mwani-msafi","Dried Sea Moss"),("tafi","Rabbit Fish · Tafi")],
       "sofia-ghost-fishing":[("changu","Emperor Fish · Changu")],
       "sofia-launch":[("jodari","Tuna · Jodari")],
       "boat-to-box":[("changu","Emperor Fish · Changu"),("prawns-s2","Prawns S2")]}

NAV=[("../index.html","Home"),("../catalogue.html","Shop"),("../fishguide.html","Fish Guide"),
     ("../track.html","Track Order"),("../blog.html","Blog"),("../about.html","About"),("../ecosystem.html","Ecosystem")]
e=lambda s: html.escape(s,quote=True)

def fixpaths(x):
    x=re.sub(r'href="([a-z0-9-]+\.html)','href="../\\1',x)
    x=re.sub(r'src="images/','src="../images/',x)
    return x

def wordcount(x): return len(re.sub(r'<[^>]+>',' ',x).split())

def build(p,others):
    url="%s/blog/%s"%(BASE,p['id'])
    img="%s/images/%s"%(BASE,IMG.get(p['id'],"shimoni-beach.jpg"))
    body=fixpaths(p['body'])
    ld={"@context":"https://schema.org","@type":"BlogPosting","headline":p['title'][:110],
        "description":re.sub(r'<[^>]+>','',p['ex']),"image":[img],
        "datePublished":iso(p['date']),"dateModified":iso(p['date']),
        "articleSection":p['catname'],"wordCount":wordcount(p['body']),
        "inLanguage":"en-KE","mainEntityOfPage":{"@type":"WebPage","@id":url},
        "author":{"@type":"Organization","name":"MombasaFish","url":BASE+"/"},
        "publisher":{"@type":"Organization","name":"MombasaFish","@id":BASE+"/#business",
                     "logo":{"@type":"ImageObject","url":BASE+"/images/logo.jpg"}}}
    crumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":BASE+"/"},
      {"@type":"ListItem","position":2,"name":"Blog","item":BASE+"/blog"},
      {"@type":"ListItem","position":3,"name":p['title'],"item":url}]}
    h=['<!DOCTYPE html>','<html lang="en">','<head>','<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<title>%s | MombasaFish</title>'%e(p['title']),
      '<meta name="description" content="%s">'%e(re.sub(r'<[^>]+>','',p['ex'])[:158]),
      '<link rel="canonical" href="%s">'%url,
      '<meta property="og:type" content="article">','<meta property="og:locale" content="en_KE">',
      '<meta property="og:site_name" content="MombasaFish">',
      '<meta property="og:title" content="%s">'%e(p['title']),
      '<meta property="og:description" content="%s">'%e(re.sub(r'<[^>]+>','',p['ex'])[:158]),
      '<meta property="og:url" content="%s">'%url,
      '<meta property="og:image" content="%s">'%img,
      '<meta property="article:published_time" content="%s">'%iso(p['date']),
      '<meta property="article:section" content="%s">'%e(p['catname']),
      '<meta name="twitter:card" content="summary_large_image">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
      '<link rel="icon" href="../images/logo.jpg">',
      '<link rel="stylesheet" href="../style.css">',
      '<script type="application/ld+json">%s</script>'%json.dumps(ld,ensure_ascii=False),
      '<script type="application/ld+json">%s</script>'%json.dumps(crumb,ensure_ascii=False),
      '</head>','<body>',
      '<div class="annc">Fresh catch daily · Order on WhatsApp <a href="https://wa.me/254787668888">0787 668 888</a> · Pay with M-Pesa</div>',
      '<header class="hdr">',
      '  <a class="logo" href="../index.html"><img src="../images/logo.jpg" alt="MombasaFish logo" width="34" height="34" fetchpriority="high" style="width:34px;height:34px;border-radius:8px;object-fit:cover"><span class="wm">Mombasa<em>Fish</em></span></a>',
      '  <nav class="nav">'] + ['    <a href="%s">%s</a>'%(u,t) for u,t in NAV] + ['  </nav>','</header>','',
      '<div class="wrap">',
      '<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="../blog.html">Blog</a> › <span>%s</span></nav>'%e(p['title'][:48]),
      '<article class="art">',
      '  <p class="artmeta"><span class="pill">%s</span><time datetime="%s">%s</time> · %d min read</p>'%(e(p['catname']),iso(p['date']),e(p['date']),max(1,round(wordcount(p['body'])/200))),
      '  <h1>%s</h1>'%p['title'],
      '  <p class="artlede">%s</p>'%p['ex'],
      '  <img class="arthero" src="../images/%s" alt="" loading="lazy" width="1200" height="675">'%IMG.get(p['id'],"shimoni-beach.jpg"),
      '  <div class="artbody">',body,'  </div>']
    if LINKS.get(p['id']):
        h.append('  <div class="artshop"><h2>Order what you just read about</h2><div class="rel">')
        for slug,label in LINKS[p['id']]:
            h.append('    <a class="rcard" href="../fish/%s.html"><img src="../images/%s" alt="" loading="lazy" width="400" height="400"><span class="rn">%s</span><span class="rp">See this fish →</span></a>'%(slug,slug.replace('prawns-tiger','prawns-tiger')+'.jpg' if False else {'nguru':'nguru.jpg','jodari':'jodari.jpg','changu':'changu.jpg','pweza':'pweza.jpg','prawns-tiger':'prawns-tiger.jpg','prawns-s2':'prawns-s2.jpg','mwani-msafi':'mwani-msafi.jpg','tafi':'tafi.jpg'}[slug],e(label)))
        h.append('  </div></div>')
    h.append('</article>')
    sib=[o for o in others if o['id']!=p['id']][:3]
    h.append('<section class="psec"><h2>Keep reading</h2><ul class="morelist">')
    for o in sib:
        h.append('  <li><a href="%s.html"><b>%s</b><span>%s · %s</span></a></li>'%(o['id'],e(o['title']),e(o['catname']),e(o['date'])))
    h.append('</ul><p style="margin-top:1rem"><a class="btn btn-coral" href="../blog.html">← All stories</a></p></section>')
    h+=['</div>','',
      '<footer>','  <div class="cols">',
      '    <div><h2>Pages</h2><a href="../index.html">Home</a><a href="../catalogue.html">Shop</a><a href="../fishguide.html">Fish Guide</a><a href="../track.html">Track Order</a><a href="../blog.html">Blog</a></div>',
      '    <div><h2>Contact</h2><a href="https://wa.me/254787668888">WhatsApp: 0787 668 888</a><a href="https://maps.app.goo.gl/NTLTpW95RUBnPDsh9">📍 Mombasa Fish Shop — Google Maps</a><a href="../policies.html">Policies &amp; privacy</a></div>',
      '    <div><h2>Follow us</h2><div class="social"><a href="https://web.facebook.com/mombasafishmarket">Facebook</a><a href="https://instagram.com/mombasafishmarket">Instagram</a><a href="https://youtube.com/mombasafish">YouTube</a><a href="https://tiktok.com/@mombasafish">TikTok</a><a href="https://x.com/mombasa_fish">X</a></div></div>',
      '  </div>',
      '  <p class="fine"><span class="wmf">Mombasa<em>Fish</em></span> — Market · Media · Academy · Ocean · Exports<br>Quality · Delivery · Freshness · Traceable to the Source<br>© 2026 MombasaFish</p>',
      '</footer>','','<script src="../ui.js" defer></script>',
      '<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "a0dfbad9d92441fe9afdaf972bb97acd"}\'></script><!-- End Cloudflare Web Analytics -->',
      '</body>','</html>']
    return "\n".join(h)

os.makedirs("blog",exist_ok=True)
for p in posts:
    open("blog/%s.html"%p['id'],"w",encoding="utf-8").write(build(p,posts))
json.dump(posts,open("/tmp/posts.json","w"),ensure_ascii=False)
print("wrote %d article pages"%len(posts))
