# -*- coding: utf-8 -*-
"""Generate /fish/<slug>.html product pages from catalogue + fish guide + content file."""
import json, re, os, html, importlib.util, datetime

spec=importlib.util.spec_from_file_location("c","build-fish-content.py")
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
DEF, C = m.DEF, m.C
P=json.load(open("/tmp/products.json")); F=json.load(open("/tmp/fish.json"))
G={f['n']:f for f in F}
SLUG_FIX={"fillets-snapper":"red-snapper-fillets","fillets-white-snapper":"white-snapper-fillets",
 "fillets-tilapia":"tilapia-fillets","fillets":"filleting-service","asali-mikoko":"asali-ya-mikoko",
 "kamba-wakavu":"dried-prawns-500g","kamba-wakavu-2":"dried-prawns-1kg","unga-mwani":"unga-wa-mwani",
 "clams":"white-clams","papa-steak":"papa","salmon":"salmon"}
def slug(p):
    s=os.path.splitext(p['img'])[0]
    return SLUG_FIX.get(s,s)
for p in P: p['slug']=slug(p)
assert len({p['slug'] for p in P})==len(P), "duplicate slugs"
BASE="https://mombasafish.com"
TODAY=datetime.date.today().isoformat()
e=html.escape
def esc(s): return e(s,quote=True)

NAV=[("../index.html","Home"),("../catalogue.html","Shop"),("../fishguide.html","Fish Guide"),
     ("../track.html","Track Order"),("../blog.html","Blog"),("../about.html","About"),("../ecosystem.html","Ecosystem")]
COOK_LABEL={"grill":"Grilling","fry":"Frying","curry":"Curry","raw":"Raw / sashimi","boil":"Boiling","dry":"Dried"}

def meters(g):
    if not g: return ""
    rows=[("Flavour",g['fl'],"mild","strong"),("Firmness",g['fi'],"soft","firm"),("Oiliness",g['oi'],"lean","oily")]
    out='<div class="meters">'
    for lab,v,lo,hi in rows:
        out+=('<div class="mtr"><span class="ml">%s</span><span class="bar">'%lab
              + "".join('<i class="%s"></i>'%("on" if k<v else "") for k in range(5))
              + '</span><span class="me">%s → %s</span></div>'%(lo,hi))
    return out+'</div>'

def related(p):
    sib=[x for x in P if x['cat']==p['cat'] and x['slug']!=p['slug']][:4]
    if len(sib)<4:
        sib+= [x for x in P if x['cat']!=p['cat'] and x['slug']!=p['slug']][:4-len(sib)]
    o='<div class="rel">'
    for s in sib:
        o+=('<a class="rcard" href="%s.html"><img src="../images/%s" alt="%s" loading="lazy" width="400" height="400">'
            '<span class="rn">%s</span><span class="rp">KES %s / %s</span></a>'
            %(s['slug'],s['img'],esc(s['title']),esc(s['title']),format(s['price'],","),s['unit']))
    return o+'</div>'

def build(p):
    c=C[p['title']]; g=G.get(p['title'])
    d=dict(DEF.get(p['cat'],{})); d.update({k:v for k,v in c.items() if k in ("meth","loc","store","shelf")})
    sw = p['sub'] if p['sub'] and p['sub'].lower() not in ("boneless","service") else ""
    full = p['title'] + (" (%s)"%sw if sw else "")
    title = "%s%s — KES %s per %s | MombasaFish" % (p['title'], " · "+sw if sw else "", format(p['price'],","), p['unit'])
    desc = re.sub(r'\s+',' ',p['desc'])[:150]
    url  = "%s/fish/%s"%(BASE,p['slug'])
    img  = "%s/images/%s"%(BASE,p['img'])

    faqs=c.get('faq',[])
    prod_ld={"@context":"https://schema.org","@type":"Product","name":full,
      "image":[img],"description":p['desc'],"category":p['cat'].replace('&amp;','&'),
      "brand":{"@type":"Brand","name":"MombasaFish"},
      "offers":{"@type":"Offer","url":url,"priceCurrency":"KES","price":str(p['price']),
        "priceValidUntil":"2027-12-31","availability":"https://schema.org/InStock",
        "itemCondition":"https://schema.org/NewCondition",
        "seller":{"@type":"Organization","name":"MombasaFish","@id":BASE+"/#business"},
        "eligibleQuantity":{"@type":"QuantitativeValue","unitText":"kg" if p['unit']=="kg" else "piece"}}}
    if c.get('sci'): prod_ld["additionalProperty"]=[{"@type":"PropertyValue","name":"Scientific name","value":c['sci']}]
    crumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":BASE+"/"},
      {"@type":"ListItem","position":2,"name":"Shop Seafood","item":BASE+"/catalogue"},
      {"@type":"ListItem","position":3,"name":p['title'],"item":url}]}
    lds=[prod_ld,crumb]
    if faqs:
        lds.append({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
          {"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faqs]})

    h=['<!DOCTYPE html>','<html lang="en">','<head>','<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<title>%s</title>'%esc(title),
      '<meta name="description" content="%s">'%esc(desc),
      '<link rel="canonical" href="%s">'%url,
      '<meta property="og:type" content="product">','<meta property="og:locale" content="en_KE">',
      '<meta property="og:site_name" content="MombasaFish">',
      '<meta property="og:title" content="%s">'%esc(full+" — KES %s / %s"%(format(p['price'],","),p['unit'])),
      '<meta property="og:description" content="%s">'%esc(desc),
      '<meta property="og:url" content="%s">'%url,
      '<meta property="og:image" content="%s">'%img,
      '<meta name="twitter:card" content="summary_large_image">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">',
      '<link rel="icon" href="../images/logo.jpg">',
      '<link rel="preload" as="image" href="../images/%s" fetchpriority="high">'%p['img'],
      '<link rel="stylesheet" href="../style.css">']
    for l in lds: h.append('<script type="application/ld+json">%s</script>'%json.dumps(l,ensure_ascii=False))
    h+=['</head>','<body>',
      '<div class="annc">Fresh catch daily · Order on WhatsApp <a href="https://wa.me/254787668888">0787 668 888</a> · Pay with M-Pesa</div>',
      '<header class="hdr">',
      '  <a class="logo" href="../index.html"><img src="../images/logo.jpg" alt="MombasaFish logo" width="34" height="34" fetchpriority="high" style="width:34px;height:34px;border-radius:8px;object-fit:cover"><span class="wm">Mombasa<em>Fish</em></span></a>',
      '  <nav class="nav">'] + ['    <a href="%s">%s</a>'%(u,t) for u,t in NAV] + ['  </nav>','</header>','',
      '<div class="wrap">',
      '<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="../catalogue.html">Shop</a> › <span>%s</span></nav>'%esc(p['title']),
      '','<article class="pdp">',
      '  <div class="pmedia"><img src="../images/%s" alt="%s — fresh from Shimoni" width="900" height="900" fetchpriority="high"></div>'%(p['img'],esc(full)),
      '  <div class="pinfo">',
      '    <span class="pcat">%s</span>'%p['cat'].replace('&amp;','&'),
      '    <h1>%s</h1>'%esc(p['title']),
      ('    <p class="psw">%s</p>'%esc(sw)) if sw else '',
      '    <p class="plede">%s</p>'%p['desc'],
      '    <p class="pprice"><b>KES %s</b> <span>per %s</span></p>'%(format(p['price'],","),p['unit']),
      '    <div class="padd" data-name="%s" data-unit="%s" data-price="%d">'%(esc(p['name']),p['unit'],p['price']),
      '      <button class="add" type="button">Add to cart</button>',
      '      <div class="qty"><button class="mn" type="button" aria-label="Decrease">−</button><span class="n">0</span><button class="pl" type="button" aria-label="Increase">+</button></div>',
      '      <a class="tocart" href="../catalogue.html#cart">Go to cart →</a>',
      '    </div>',
      '    <ul class="ptrust"><li>Landed by small boats at Shimoni</li><li>Cleaned to your preference</li><li>Cold chain to your door</li><li>Not satisfied? We make it right</li></ul>',
      '  </div>','</article>','']
    # spec table
    rows=[("English name",p['title']),("Swahili name",sw or "—"),("Scientific name",c.get('sci') or "—"),
          ("Family",c.get('fam') or "—"),("Caught",d.get('loc','')),("Method",d.get('meth','')),
          ("Sold by","Per kilogram" if p['unit']=='kg' else "Per piece"),("Price","KES %s / %s"%(format(p['price'],","),p['unit']))]
    h+=['<section class="psec"><h2>At a glance</h2><table class="spec"><tbody>']
    for k,v in rows:
        if v and v!="—": h.append('<tr><th scope="row">%s</th><td>%s</td></tr>'%(k,esc(v)))
    h+=['</tbody></table>']
    if g: h.append(meters(g))
    h.append('</section>')
    if c.get('nut') or c.get('health'):
        h+=['<section class="psec"><h2>Nutrition &amp; health</h2>']
        if c.get('nut'): h.append('<p class="nutline">%s</p>'%esc(c['nut']))
        if c.get('health'): h.append('<p>%s</p>'%c['health'])
        h.append('<p class="fine2">Nutritional values are approximate, per 100 g raw edible portion, and vary with size and season. This is general information, not medical or dietary advice.</p></section>')
    if c.get('cook'):
        h+=['<section class="psec"><h2>How to cook it</h2><p>%s</p>'%c['cook']]
        if g and g.get('c'):
            h.append('<p class="tags">'+ " ".join('<i>%s</i>'%COOK_LABEL.get(x,x.title()) for x in g['c']) +'</p>')
        if c.get('pair'): h.append('<p class="pairs"><b>Goes well with:</b> %s</p>'%esc(c['pair']))
        h.append('<p class="fine2">Every order is cleaned to your preference — scaled, gutted, filleted, cut into steaks or left whole. Choose at checkout.</p></section>')
    h+=['<section class="psec"><h2>Storage &amp; shelf life</h2><p>%s</p><p class="shelf"><b>Keeps:</b> %s</p></section>'%(d.get('store',''),esc(d.get('shelf','')))]
    # traceability
    h+=['<section class="psec"><h2>Traceable to the source</h2><ol class="trace">',
        '<li><b>04:30</b> The small boats leave Shimoni</li>',
        '<li><b>11:00</b> The catch lands and we buy it the same day, direct from the fisherman</li>',
        '<li><b>13:00</b> Cleaned to your preference and packed on ice</li>',
        '<li><b>→</b> Mombasa same-day by rider; other counties by express transport, cooler sealed</li>',
        '</ol><p class="fine2"><a href="../about.html">How we source</a> · <a href="../track.html">Track an order</a> · <a href="../ecosystem.html">Our ecosystem</a></p></section>']
    if faqs:
        h.append('<section class="psec"><h2>Questions</h2>')
        for q,a in faqs:
            h.append('<details class="pfaq"><summary>%s</summary><div class="a"><p>%s</p></div></details>'%(esc(q),esc(a)))
        h.append('</section>')
    h+=['<section class="psec"><h2>You might also like</h2>%s</section>'%related(p),
        '<p class="backlink"><a class="btn btn-coral" href="../catalogue.html">← See the whole catalogue</a></p>',
        '</div>','',
        '<footer>','  <div class="cols">',
        '    <div><h4>Pages</h4><a href="../index.html">Home</a><a href="../catalogue.html">Shop</a><a href="../fishguide.html">Fish Guide</a><a href="../track.html">Track Order</a><a href="../blog.html">Blog</a></div>',
        '    <div><h4>Contact</h4><a href="https://wa.me/254787668888">WhatsApp: 0787 668 888</a><a href="https://maps.app.goo.gl/NTLTpW95RUBnPDsh9">📍 Mombasa Fish Shop — Google Maps</a><a href="../policies.html">Policies &amp; privacy</a><p style="font-size:.82rem;margin-top:.4rem">Payment: M-Pesa</p></div>',
        '    <div><h4>Follow us</h4><div class="social"><a href="https://web.facebook.com/mombasafishmarket">Facebook</a><a href="https://instagram.com/mombasafishmarket">Instagram</a><a href="https://youtube.com/mombasafish">YouTube</a><a href="https://tiktok.com/@mombasafish">TikTok</a><a href="https://x.com/mombasa_fish">X</a></div></div>',
        '  </div>',
        '  <p class="fine"><span class="wmf">Mombasa<em>Fish</em></span> — Market · Media · Academy · Ocean · Exports<br>Quality · Delivery · Freshness · Traceable to the Source<br>© 2026 MombasaFish</p>',
        '</footer>','',
        '<script src="../ui.js" defer></script>','<script src="../product.js" defer></script>',
        '<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "a0dfbad9d92441fe9afdaf972bb97acd"}\'></script><!-- End Cloudflare Web Analytics -->',
        '</body>','</html>']
    return "\n".join(x for x in h if x is not None)

os.makedirs("fish",exist_ok=True)
for p in P:
    open("fish/%s.html"%p['slug'],"w",encoding="utf-8").write(build(p))
json.dump([{k:p[k] for k in ("slug","title","sub","price","unit","img","cat","name","desc")} for p in P],
          open("fish-index.json","w"),ensure_ascii=False,indent=1)
print("generated %d pages"%len(P))
print("slugs:", ", ".join(sorted(p['slug'] for p in P)))
