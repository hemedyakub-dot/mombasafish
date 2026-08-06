/* ============================================================
   BABU SAMAKI — MombasaFish assistant
   Rules-based. No API, no key, no cost, no hallucination.
   Reads fish-index.json so prices are always the site's prices.
   ============================================================ */
(function () {
  var WA = '254787668888';
  var path = location.pathname;
  if (/track|policies|wholesale/.test(path)) return;          // he stays away from these
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) var STILL = true;

  var KIDS = /\/ocean/.test(path);
  var depth = path.replace(/\/[^\/]*$/, '').split('/').filter(Boolean).length;
  var BASE = new Array(depth + 1).join('../');
  var CAT = [];

  /* ---------- knowledge ---------- */
  var KB = [
    { k: ['bone', 'bones', 'bony', 'mifupa', 'miiba', 'mwiba', 'hana miiba'], a: 'Papa — shark steak. He has no bones at all, only cartilage, the soft stuff in your ear. That is why grandmothers give it to small children.\n\nAfter him, Changu. Simple bones, easy to eat around.\n\nIf you want none at all and no thinking, take fillets.', f: ['papa', 'changu', 'red-snapper-fillets'] },
    { k: ['fry', 'frying', 'kukaanga', 'kaanga', 'deep fry', 'pan fry'], a: 'Changu. Score him three times each side, salt, lime, hot oil. He comes off the bone in clean flakes.\n\nTafi is the everyday choice and cheaper. Mkundaji is the one chefs quietly prefer — small and sweet, almost like prawn.', f: ['changu', 'tafi', 'mkundaji'] },
    { k: ['grill', 'grilling', 'bbq', 'barbecue', 'charcoal', 'choma', 'kuchoma', 'mkaa'], a: 'The fire punishes a soft fish. You want dense flesh.\n\nNguru and Jodari cut into thick steaks. Sulisuli Kipanga — swordfish — behaves almost like beef on a grate.\n\nDo not put pono or tafi over fierce heat. They break and fall through.', f: ['nguru', 'jodari', 'sulisuli-kipanga'] },
    { k: ['biryani', 'pilau', 'rice'], a: 'Nguru. Kingfish. Nothing else comes close.\n\nBiryani is cooked long and layered, and a soft fish disappears into the rice. Nguru holds his shape.\n\nBuy it cut into thick steaks. One kilo feeds four with rice.', f: ['nguru'] },
    { k: ['curry', 'mchuzi', 'coconut', 'nazi', 'tui', 'stew', 'kupaka'], a: 'Tewa. He flakes into large clean pieces that drink the sauce instead of dissolving into it. That is the mchuzi wa samaki classic.\n\nChangu does the same. If you want something richer, Kolekole stands up to heavy spice.', f: ['tewa', 'changu', 'kolekole'] },
    { k: ['omega', 'healthy', 'healthiest', 'health', 'nutrition', 'protein', 'afya', 'lishe', 'nzuri kwa afya'], a: 'The small oily fish, and they are the cheapest things we sell.\n\nSimusimu and Una carry omega-3 close to salmon for a fraction of the price. Uwono you eat whole, bones and all, so you get the calcium too.\n\nSalmon is higher still, but it is imported and costs ten times as much.', f: ['una', 'simusimu', 'uwono'] },
    { k: ['child', 'children', 'kid', 'kids', 'watoto', 'mtoto', 'baby', 'toddler'], a: 'Mild, boneless, small.\n\nPapa has no bones at all. Pono is the sweetest, gentlest fish on the slab. Tilapia fillets are so mild that even a suspicious child will eat them.\n\nOne caution — keep swordfish and shark for grown-ups. Big old fish carry more mercury. Small fish carry the least.', f: ['pono', 'tilapia-fillets', 'changu'] },
    { k: ['pregnan', 'expecting', 'mimba', 'mjamzito'], a: 'Small fish, cooked through. Simusimu, Uwono and Una carry the least mercury of anything here, and plenty of the omega-3 that matters.\n\nChangu and Tewa are safe, lean and mild.\n\nWhat to leave alone: swordfish, shark, and anything raw. This is general knowledge, not medical advice — your own doctor knows your situation.', f: ['simusimu', 'una', 'changu'] },
    { k: ['raw', 'sashimi', 'sushi', 'ceviche'], a: 'Only Jodari, and only tuna landed the same morning. Tell us when you order so we pick and handle it for that.\n\nSalmon also, since it arrives cold-chained for the purpose.\n\nRaw fish always carries some risk. If you are pregnant, unwell, elderly or feeding small children — cook it through instead.', f: ['jodari', 'salmon'] },
    { k: ['octopus', 'pweza', 'rubber', 'rubbery', 'chewy', 'tough'], a: 'Fast or slow. Never in between.\n\nEither char him three or four minutes over fierce heat, or simmer him forty-five to sixty minutes until a knife slides in with no resistance. Anything between those two is where rubber lives.\n\nAnd freeze him first. The ice breaks the fibres. A frozen octopus cooks softer than a fresh one — this is true, though people do not believe me.', f: ['pweza', 'ngisi'] },
    { k: ['cheap', 'cheapest', 'value', 'budget', 'affordable', 'bei nafuu', 'rahisi'], a: 'Simusimu, Uwono and Una. Most protein, most omega-3, least money.\n\nAmong the bigger fish, Tewa and Pono at 600 the kilo are the cheapest proper dinner on the page.\n\nThe Omega-3 Combo puts all three small fish together for less than buying them apart.', f: ['una', 'tewa', 'pono'] },
    { k: ['first time', 'never cooked', 'beginner', 'easy', 'simple', 'start'], a: 'Buy Changu. Ask for it cleaned and gutted. Score it three times each side, rub salt and lime, fry it.\n\nHe forgives mistakes and he has few bones.\n\nIf a whole fish still feels like a lot, start with tilapia fillets. No bones, no scaling, four minutes in a pan.', f: ['changu', 'tilapia-fillets'] },
    { k: ['wedding', 'harusi', 'celebration', 'party', 'guests', 'crowd', 'function', 'sherehe', 'wageni'], a: 'Variety is what people remember. A whole Nguru in the middle, lobster and kaa for the eyes, prawns and ngisi for the hands.\n\nThat is the Bwanaharusi Special — six kilos, one delivery, priced below the sum of its parts.', f: ['nguru', 'lobster', 'prawns-tiger'] },
    { k: ['how much fish', 'how many kilo', 'per person', 'people', 'feeds', 'portion', 'watu wangapi', 'kilo ngapi', 'watu', 'ninahitaji samaki kwa'], a: 'Count 300 grams of fish for each person.\n\nFor whole fish buy more — maybe 400 grams each — because head and bone go back to the sea, not on the plate.\n\nSo six people, two and a half kilos of fillet, or three and a half of whole fish.', f: [] },
    { k: ['store', 'storage', 'keep', 'fridge', 'freeze', 'freezer', 'how long', 'kuhifadhi', 'friji'], a: 'On ice or in the coldest part of the fridge, and cook it within two days.\n\nTo freeze: dry it, wrap it tight, minus eighteen. Three months. Never freeze again what has already thawed.\n\nShellfish is different. Cook it the day it arrives.', f: [] },
    { k: ['clean', 'gut', 'scale', 'fillet', 'cut', 'prepare', 'kusafisha', 'safisha', 'kukata'], a: 'We clean it however you say — scaled, gutted, filleted, cut into steaks, peeled, or left whole. Choose when you check out.\n\nOne thing to know about prawns: peeling loses about forty in a hundred to shell and head. You pay for the weight you order and receive the cleaned meat.', f: [] },
    { k: ['deliver', 'delivery', 'transport', 'shipping', 'send', 'county', 'nairobi', 'nakuru', 'kisumu', 'kuleta', 'usafiri', 'kufikisha'], a: 'Eight counties. Mombasa the same day by rider. The others by express transport, in a sealed cooler with ice that holds cold for up to seventy-two hours.\n\nThe box price you can see on the shop page. The transport we quote you before you pay a shilling — we pass on what the transporter charges us and add nothing.', f: [] },
    { k: ['pay', 'payment', 'mpesa', 'm-pesa', 'cash', 'card', 'kulipa', 'malipo', 'pesa'], a: 'M-Pesa, after we confirm your total. Never before.\n\nYour cart becomes a message on WhatsApp. We reply with what is available and what it comes to — fish, box, transport, as three separate lines. Then you decide.', f: [] },
    { k: ['fresh', 'freshness', 'how fresh', 'frozen', 'freshi', 'mbichi', 'ya leo'], a: 'The boats leave Shimoni at half past four. They land about eleven, and we buy the same morning, on the sand, from the man who caught it.\n\nCleaned and on ice within hours. Not days.\n\nIf what reaches you is not right, send one photograph within a day and we replace it or refund it. We do not ask you to send fish back.', f: [] },
    { k: ['guarantee', 'refund', 'wrong', 'complain', 'bad', 'problem'], a: 'One photograph within twenty-four hours, and we replace the item on your next order or refund it.\n\nWe do not ask anyone to send fish back. This is a small business on a small coast — our name travels faster than any policy.', f: [] },
    { k: ['box', 'boxes', 'bundle', 'combo', 'familia', 'bwanaharusi', 'boil', 'choma box'], a: 'Five ready-made boxes, each cheaper than buying the same seafood apart.\n\nOmega-3 Combo, 1,500. Familia, 2,900. Choma, 3,600. Seafood Boil, 5,700. And the Bwanaharusi Special at 9,500 — six kilos for a day that matters.', f: [] },
    { k: ['restaurant', 'hotel', 'wholesale', 'bulk', 'trade', 'supply'], a: 'That is a different conversation, and a better one to have with the people at the shop than with me.\n\nThey agree a weekly volume, a price fixed in advance, and cutting to your specification.', f: [], wa: true },
    { k: ['sea moss', 'mwani', 'seamoss'], a: 'Farmed on lines in shallow water down the coast, much of it by women working together at Kibuyuni. Sun-dried.\n\nRinse it, soak it four to eight hours until it swells, then blend it into a gel. It keeps two weeks in the fridge.\n\nIt is a food, not a medicine. Be careful of anyone who tells you otherwise.', f: ['mwani-msafi', 'unga-wa-mwani'] },
    { k: ['honey', 'asali', 'mikoko', 'mangrove'], a: 'The bees forage mangrove blossom, and it gives a dark honey with a faint salt note you will not find inland.\n\nRaw, so it will crystallise. Stand the jar in warm water — never a microwave.\n\nAnd never give honey to a child under one year.', f: ['asali-ya-mikoko'] },
    { k: ['prawn', 'prawns', 'kamba', 'shrimp'], a: 'Six sizes, and the number tells you how many to a kilo. Jumbo is a dozen or so — big enough to be the whole meal. Tiger is the sweet spot for most tables. Cocktail are tiny and go in pilau.\n\nBuy shell-on if you want flavour in the sauce. Ask for peeled if you want both hands free.', f: ['prawns-jumbo', 'prawns-tiger', 'prawns-cocktail'] },
    { k: ['lobster', 'crab', 'kaa', 'shellfish', 'oyster', 'chaza', 'mussel', 'kome', 'clam'], a: 'Lobster here is the spiny kind — no big front claws, all the meat in the tail, sweeter than the cold-water sort. Split it, garlic butter, six minutes shell-side down.\n\nKaa is the mangrove crab. Steam twelve to fifteen minutes the kilo and crack it at the table.\n\nMussels and clams open in five minutes in coconut. Anything that stays shut, throw away.', f: ['lobster', 'kaa', 'kome'] },
    { k: ['salmon'], a: 'Salmon is a cold-water fish. He does not live in our ocean, and I will not pretend otherwise — ours is imported, and we say so on the label.\n\nIf what you want is the omega-3, buy Una instead. Nearly as much, for a sixth of the price.', f: ['salmon', 'una'] },
    { k: ['tafi', 'sustainab', 'environment', 'conservation', 'overfish'], a: 'Tafi. He grazes the seagrass, he grows fast, and there are many of him. A fishery lives on fish like that.\n\nThe small oily fish too — simusimu, uwono, una. Eating small fish presses on the ocean far less than eating the big ones that hunt them.\n\nWhat to eat rarely: the large old fish that took twenty years to grow.', f: ['tafi', 'simusimu'] },
    { k: ['open', 'hours', 'where are you', 'shop', 'location', 'visit', 'duka', 'wapi', 'mko wapi'], a: 'The shop is in Mombasa — there is a pin on the map at the bottom of every page.\n\nFor hours and whether the boats have come in today, ask the people at the shop. They will know; I only know fish.', f: [], wa: true }
  ];

  var GREET = KIDS
    ? 'Karibu, mwanangu. I am Babu Samaki. Ask me about the sea.'
    : 'Karibu. I am Babu Samaki. Ask me about fish — what to buy, how to cook it, how much you need.';

  var CHIPS = KIDS
    ? ['What is a pweza?', 'Which fish is biggest?', 'Do sharks have bones?', 'What is a coral reef?']
    : /fishguide|\/fish\//.test(path) ? ['How do I cook this?', 'Is it bony?', 'What goes with it?', 'Something cheaper?']
    : /recipes/.test(path) ? ['Can I use another fish?', 'How much for six people?', 'Where do I buy this?', 'How do I store it?']
    : ['Which fish has fewest bones?', 'Best for a first-time cook?', 'What is good value?', 'What do I need for biryani?'];

  /* ---------- helpers ---------- */
  function norm(s) { return (' ' + s + ' ').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' '); }
  function money(n) { return Number(n).toLocaleString('en-KE'); }

  /* ---------- Swahili ---------- */
  var SWWORDS = [' samaki ', ' gani ', ' nini ', ' wapi ', ' ngapi ', ' bei ', ' nataka ',
    ' naomba ', ' mimi ', ' unaweza ', ' kuna ', ' hana ', ' miiba ', ' watu ', ' habari ',
    ' shikamoo ', ' asante ', ' tafadhali ', ' pesa ', ' leo ', ' nzuri ', ' kupika ',
    ' mnaleta ', ' naweza ', ' vipi ', ' ninahitaji ', ' mna ', ' kwa ', ' yangu ', ' bei '];
  function isSwahili(q) {
    var n = 0, s = norm(q);
    SWWORDS.forEach(function (w) { if (s.indexOf(w) > -1) n++; });
    return n >= 1;
  }
  var SWOPEN = ['Ndiyo, mwanangu.', 'Sikiliza.', 'Nitakwambia.', 'Haya.'];


  /* Questions he must never answer from the rulebook, however well they match.
     Places we do not serve, and terms that are not his to agree. */
  var HANDOFF = ['kisumu', 'eldoret', 'kisii', 'meru', 'nyeri', 'kakamega', 'garissa', 'lodwar',
    'kericho', 'bungoma', 'uganda', 'tanzania', 'export to', 'pay after', 'pay later', 'credit',
    'invoice', 'discount', 'cheaper price', 'negotiate', 'partnership', 'job', 'employ', 'invest'];

  /* one mistyped or swapped character should not defeat him */
  function edit1(a, c) {
    if (a === c) return true;
    var la = a.length, lc = c.length;
    if (Math.abs(la - lc) > 1) return false;
    var i = 0, j = 0, diff = 0;
    while (i < la && j < lc) {
      if (a[i] === c[j]) { i++; j++; continue; }
      if (++diff > 1) return false;
      if (la === lc) {
        if (a[i + 1] === c[j] && a[i] === c[j + 1]) { i += 2; j += 2; }   // swapped pair
        else { i++; j++; }
      } else if (la > lc) i++;
      else j++;
    }
    if (i < la || j < lc) diff++;
    return diff <= 1;
  }

  function near(hay, kw) {
    var words = hay.split(' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i].length >= 4 && edit1(words[i], kw)) return true;
    }
    return false;
  }

  function match(qRaw) {
    var q = norm(qRaw), best = null, bestScore = 0;
    for (var i = 0; i < HANDOFF.length; i++) {
      if (q.indexOf(' ' + HANDOFF[i]) > -1) return null;
    }
    KB.forEach(function (e) {
      var s = 0;
      e.k.forEach(function (kw) {
        if (q.indexOf(' ' + kw) > -1) { s += kw.length; return; }
        if (kw.length >= 5 && near(q, kw)) s += kw.length - 2;
      });
      if (s > bestScore) { bestScore = s; best = e; }
    });
    if (bestScore >= 3) return best;
    var hit = CAT.filter(function (p) {
      var t = norm(p.title + ' ' + (p.sub || ''));
      return t.split(' ').some(function (w) { return w.length > 3 && q.indexOf(' ' + w + ' ') > -1; });
    });
    if (hit.length) {
      return { a: hit[0].title + (hit[0].sub ? ' — ' + hit[0].sub : '') + '.\n\n' + hit[0].desc, f: hit.slice(0, 3).map(function (p) { return p.slug; }) };
    }
    return null;
  }


  /* ---------- content: learned from the site's own index pages ---------- */
  var DOCS = null, docsPending = null;
  function loadDocs() {
    if (DOCS) return Promise.resolve(DOCS);
    if (docsPending) return docsPending;
    docsPending = Promise.all(
      [BASE + 'blog.html', BASE + 'recipes.html'].map(function (u) {
        return fetch(u).then(function (r) { return r.text(); }).catch(function () { return ''; });
      })
    ).then(function (pages) {
      var out = [];
      pages.forEach(function (html, i) {
        if (!html) return;
        var doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('.pcard').forEach(function (c) {
          var h = c.querySelector('h3'), p = c.querySelector('p');
          if (!h) return;
          out.push({
            title: h.textContent.trim(),
            blurb: p ? p.textContent.trim() : '',
            href: c.getAttribute('href'),
            kind: i === 0 ? 'story' : 'recipe'
          });
        });
      });
      DOCS = out;
      return out;
    });
    return docsPending;
  }

  function matchDocs(qRaw) {
    if (!DOCS || !DOCS.length) return null;
    var q = norm(qRaw), best = null, bestScore = 0;
    DOCS.forEach(function (d) {
      var words = norm(d.title + ' ' + d.blurb).split(' ');
      var seen = {}, s = 0;
      words.forEach(function (w) {
        if (w.length < 4 || seen[w]) return;
        seen[w] = 1;
        if (q.indexOf(' ' + w + ' ') > -1) s += w.length;
      });
      if (s > bestScore) { bestScore = s; best = d; }
    });
    if (bestScore < 8) return null;
    return {
      a: (best.kind === 'recipe' ? 'There is a recipe for that.' : 'We wrote about that.')
        + '\n\n' + best.title + '\n\n' + best.blurb,
      doc: best
    };
  }



  /* ---------- subject: what "it" refers to ---------- */
  var LAST = null;
  function pageSlug() {
    var m = path.match(/\/fish\/([a-z0-9-]+)/);
    return m ? m[1] : null;
  }
  function subject(q) {
    var p = findProduct(q);
    if (p) { LAST = p; return p; }
    if (!/\b(it|this|that|hii|hiyo|huyu|yeye)\b/i.test(q) && !/^(how|what|is|can|does)\b/i.test(q)) return null;
    var s = pageSlug();
    if (s) { var pp = CAT.filter(function (x) { return x.slug === s; })[0]; if (pp) return pp; }
    return LAST;
  }

  /* ---------- deep answers, read from the product's own page ---------- */
  var PAGES = {};
  var SECTIONS = [
    { re: /cook|pika|kupika|prepare|recipe for it|how do i/i, h: 'How to cook it' },
    { re: /store|storage|keep|fridge|freeze|hifadhi|how long/i, h: 'Storage & shelf life' },
    { re: /nutrition|health|calorie|protein|omega|afya|good for/i, h: 'Nutrition & health' }
  ];
  function loadFishPage(slug) {
    if (PAGES[slug]) return Promise.resolve(PAGES[slug]);
    return fetch(BASE + 'fish/' + slug + '.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var out = {};
        doc.querySelectorAll('section.psec').forEach(function (sec) {
          var h = sec.querySelector('h2');
          if (!h) return;
          var ps = [];
          sec.querySelectorAll('p').forEach(function (p) {
            if (p.className.indexOf('fine2') > -1) return;
            var t = p.textContent.trim();
            if (t) ps.push(t);
          });
          if (ps.length) out[h.textContent.trim()] = ps.slice(0, 2).join('\n\n');
        });
        PAGES[slug] = out;
        return out;
      })
      .catch(function () { PAGES[slug] = {}; return {}; });
  }
  function deepIntent(q) {
    var p = subject(q);
    if (!p) return null;
    var want = null;
    for (var i = 0; i < SECTIONS.length; i++) { if (SECTIONS[i].re.test(q)) { want = SECTIONS[i].h; break; } }
    if (!want) return null;
    return { slug: p.slug, product: p, heading: want };
  }

  /* ---------- cart: he can put things in it, and do the arithmetic ---------- */
  var STORE = 'mf_cart_v1';
  var NUMW = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
    a:1, an:1, half:0.5,
    moja:1, mbili:2, tatu:3, nne:4, tano:5, sita:6, saba:7, nane:8, tisa:9, kumi:10 };

  function parseQty(q) {
    var s = norm(q);
    var d = s.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilos|kilogram|kgs)?/);
    if (d) return parseFloat(d[1]);
    for (var w in NUMW) { if (s.indexOf(' ' + w + ' ') > -1) return NUMW[w]; }
    return null;
  }

  /* words too generic to identify a product on their own */
  var GENERIC = { fish:1, samaki:1, steak:1, steaks:1, dried:1,
    premium:1, catch:1, boneless:1, whole:1, sea:1, moss:1, pack:1, jar:1, imported:1,
    per:1, kilo:1, piece:1, pieces:1, cut:1, own:1, your:1, from:1, service:1 };

  function findProduct(q) {
    if (!CAT.length) return null;
    var s = norm(q), best = null, bestScore = 0;
    CAT.forEach(function (p) {
      var terms = norm(p.title + ' ' + (p.sub || '') + ' ' + p.slug.replace(/-/g, ' ')).split(' ');
      var seen = {}, sc = 0;
      terms.forEach(function (t) {
        if (t.length < 3 || seen[t] || GENERIC[t]) return;
        seen[t] = 1;
        if (s.indexOf(' ' + t) > -1) sc += t.length;
      });
      if (sc > bestScore) { bestScore = sc; best = p; }
    });
    return bestScore >= 5 ? best : null;
  }

  function readCart() { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; } }
  function cartTotal() {
    var d = readCart(), t = 0;
    if (d.q) for (var k in d.q) {
      var p = CAT.filter(function (x) { return x.name === k; })[0];
      if (p) t += p.price * d.q[k];
    }
    return t;
  }
  function addToCart(p, qty) {
    var d = readCart(); d.q = d.q || {};
    d.q[p.name] = (d.q[p.name] || 0) + qty;
    try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) { }
    return d.q[p.name];
  }

  var WANTS_ADD = /\b(add|put|i want|i'll take|ill take|give me|order)\b|nataka|niletee|weka|nipe|ninataka/i;
  var WANTS_PRICE = /how much|what.{0,6}cost|price of|bei gani|bei ya|ni pesa ngapi/i;

  function cartIntent(q) {
    var p = findProduct(q);
    if (!p) return null;
    var qty = parseQty(q);
    var unit = p.unit === 'kg' ? ' kg' : '';

    if (WANTS_ADD.test(q)) {
      if (!qty) qty = 1;
      var now = addToCart(p, qty);
      var line = money(p.price * qty);
      var tot = money(cartTotal());
      return {
        a: 'Done. ' + qty + unit + ' of ' + p.title + ' — KES ' + line + '.\n\n'
          + 'You now have ' + now + unit + ' of it. Your cart comes to KES ' + tot
          + ' for the seafood. The box and the transport we work out when you check out.',
        f: [p.slug], cart: true
      };
    }
    if (WANTS_PRICE.test(q) && qty) {
      return {
        a: qty + unit + ' of ' + p.title + ' is KES ' + money(p.price * qty)
          + '.\n\nThat is ' + money(p.price) + ' the ' + (p.unit === 'kg' ? 'kilo' : 'piece')
          + '. Shall I put it in your cart? Say "add ' + qty + unit + ' ' + p.title.toLowerCase() + '".',
        f: [p.slug]
      };
    }
    return null;
  }

  function cardHTML(slug) {
    var p = CAT.filter(function (x) { return x.slug === slug; })[0];
    if (!p) return '';
    return '<a class="bs-card" href="' + BASE + 'fish/' + p.slug + '.html">' +
      '<img src="' + BASE + 'images/' + p.img + '" alt="" loading="lazy" width="80" height="80">' +
      '<span><b>' + p.title + '</b><i>KES ' + money(p.price) + ' / ' + p.unit + '</i></span></a>';
  }

  function waLink(q) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
      'Hello MombasaFish — I asked Babu Samaki: ' + q);
  }

  /* ---------- build ---------- */
  var css = '.bs-fab{position:fixed;bottom:18px;z-index:130;width:60px;height:60px;border-radius:50%;border:0;padding:0;cursor:pointer;background:#07474C;box-shadow:0 8px 24px rgba(3,42,46,.32);overflow:hidden}'
    + '.bs-fab img{width:100%;height:100%;display:block}'
    + '.bs-fab.wave{animation:bswave .6s ease-in-out 1}'
    + '@keyframes bswave{0%,100%{transform:rotate(0)}30%{transform:rotate(-9deg)}60%{transform:rotate(7deg)}}'
    + '.bs-tip{position:fixed;bottom:86px;z-index:130;background:#FFFEFA;border:1px solid rgba(3,42,46,.14);border-radius:14px;padding:.6rem .85rem;font:400 .82rem/1.45 Inter,system-ui,sans-serif;color:#0B2E31;max-width:14rem;box-shadow:0 8px 22px rgba(3,42,46,.16);opacity:0;transition:opacity .3s}'
    + '.bs-tip.in{opacity:1}'
    + '.bs-x{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;border:1px solid rgba(3,42,46,.14);background:#FFFEFA;color:#4A6467;font-size:.8rem;line-height:1;cursor:pointer}'
    + '.bs-panel{position:fixed;bottom:18px;z-index:131;width:min(380px,calc(100vw - 24px));max-height:min(70vh,560px);background:#FAF6EE;border:1px solid rgba(3,42,46,.14);border-radius:20px;box-shadow:0 20px 50px rgba(3,42,46,.3);display:none;flex-direction:column;overflow:hidden}'
    + '.bs-panel.open{display:flex}'
    + '.bs-head{display:flex;align-items:center;gap:.6rem;padding:.75rem .9rem;background:#07474C;color:#F2EDE3;flex:0 0 auto}'
    + '.bs-head img{width:38px;height:38px;border-radius:50%;flex:0 0 auto}'
    + '.bs-head b{font:500 .95rem/1.2 Inter,system-ui,sans-serif;display:block}'
    + '.bs-head span{font:400 .72rem/1.3 "IBM Plex Mono",monospace;color:#7FD4C1}'
    + '.bs-close{margin-left:auto;background:none;border:0;color:#F2EDE3;font-size:1.5rem;line-height:1;cursor:pointer;padding:.1rem .3rem}'
    + '.bs-doc i{color:#FF6B5A}'
    + '.bs-doc{padding:.6rem .75rem}'
    + '.bs-scene{width:100%;border-radius:12px;display:block;flex:0 0 auto}'
    + '.bs-log{flex:1 1 auto;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.7rem}'
    + '.bs-msg{font:400 .9rem/1.62 Inter,system-ui,sans-serif;white-space:pre-line;max-width:92%}'
    + '.bs-msg.b{background:#FFFEFA;border:1px solid rgba(3,42,46,.1);border-radius:4px 16px 16px 16px;padding:.7rem .85rem;color:#0B2E31;align-self:flex-start}'
    + '.bs-msg.u{background:#07474C;color:#F2EDE3;border-radius:16px 16px 4px 16px;padding:.6rem .85rem;align-self:flex-end}'
    + '.bs-card{display:flex;align-items:center;gap:.6rem;background:#FFFEFA;border:1px solid rgba(3,42,46,.12);border-radius:12px;padding:.45rem;text-decoration:none;margin-top:.35rem}'
    + '.bs-card img{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}'
    + '.bs-card b{display:block;font:500 .84rem/1.25 Inter,system-ui,sans-serif;color:#032A2E}'
    + '.bs-card i{font:400 .74rem/1.4 "IBM Plex Mono",monospace;color:#4A6467;font-style:normal}'
    + '.bs-wa{display:inline-block;margin-top:.5rem;background:#1FAF54;color:#fff;text-decoration:none;border-radius:999px;padding:.55rem 1rem;font:500 .84rem/1 Inter,system-ui,sans-serif}'
    + '.bs-chips{display:flex;flex-wrap:wrap;gap:.35rem;padding:0 .9rem .7rem}'
    + '.bs-chips button{background:#FFFEFA;border:1px solid rgba(3,42,46,.16);border-radius:999px;padding:.45rem .8rem;min-height:36px;font:400 .8rem/1 Inter,system-ui,sans-serif;color:#07474C;cursor:pointer}'
    + '.bs-chips button:hover{border-color:#7FD4C1}'
    + '.bs-form{display:flex;gap:.4rem;padding:.7rem .9rem;border-top:1px solid rgba(3,42,46,.1);flex:0 0 auto}'
    + '.bs-form input{flex:1;border:1px solid rgba(3,42,46,.16);border-radius:999px;padding:.6rem .9rem;font:400 .9rem Inter,system-ui,sans-serif;min-height:44px}'
    + '.bs-form button{background:#07474C;color:#F2EDE3;border:0;border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:1rem}'
    + '.bs-fab,.bs-tip,.bs-panel{right:18px}'
    + '@media(max-width:760px){.bs-fab,.bs-tip,.bs-panel{right:auto;left:12px}.bs-panel{left:12px;right:12px;width:auto}}'
    + '@media(prefers-reduced-motion:reduce){.bs-fab.wave{animation:none}.bs-tip{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement('button');
  fab.className = 'bs-fab';
  fab.setAttribute('aria-label', 'Ask Babu Samaki');
  fab.innerHTML = '<img src="' + BASE + 'images/babu-avatar.svg" alt="" width="60" height="60">';

  var panel = document.createElement('div');
  panel.className = 'bs-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Babu Samaki');
  panel.innerHTML =
    '<div class="bs-head"><img src="' + BASE + 'images/babu-avatar.svg" alt=""><span><b>Babu Samaki</b>'
    + '<span>' + (KIDS ? 'Ocean Explorers' : 'MombasaFish · Shimoni') + '</span></span>'
    + '<button class="bs-close" aria-label="Close">&times;</button></div>'
    + '<div class="bs-log" id="bsLog"></div>'
    + '<div class="bs-chips" id="bsChips"></div>'
    + '<form class="bs-form"><input type="text" aria-label="Ask a question" placeholder="'
    + (KIDS ? 'Ask about the sea…' : 'Ask about fish…') + '" autocomplete="off"><button type="submit" aria-label="Send">→</button></form>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var log = panel.querySelector('#bsLog'),
      chips = panel.querySelector('#bsChips'),
      form = panel.querySelector('form'),
      input = panel.querySelector('input');

  function say(text, cls, extra) {
    var d = document.createElement('div');
    d.className = 'bs-msg ' + cls;
    d.textContent = text;
    if (extra) { var e = document.createElement('div'); e.innerHTML = extra; d.appendChild(e); }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function reply(q, m) {
    if (!m) {
      say('That one I cannot tell you.\n\nIt is outside what I know. The people at the shop will answer you properly — they are quick.',
        'b', '<a class="bs-wa" href="' + waLink(q) + '">Ask the team on WhatsApp →</a>');
      return;
    }
    var extra = '';
    if (m.cart) {
      extra = '<a class="bs-wa" style="background:#07474C" href="' + BASE + 'catalogue.html#cart">See my cart →</a>';
      extra += (m.f || []).map(cardHTML).join('');
    } else if (m.doc) {
      extra = '<a class="bs-card bs-doc" href="' + BASE + m.doc.href + '">'
        + '<span><b>' + m.doc.title + '</b><i>Read it →</i></span></a>';
    } else {
      extra = (m.f || []).map(cardHTML).join('');
      if (m.wa) extra += '<a class="bs-wa" href="' + waLink(q) + '">Ask the team on WhatsApp →</a>';
    }
    if (m.f && m.f.length && CAT.length) {
      var lp = CAT.filter(function (x) { return x.slug === m.f[0]; })[0];
      if (lp) LAST = lp;
    }
    var text = m.a;
    if (isSwahili(q)) text = SWOPEN[Math.floor(Math.random() * SWOPEN.length)] + ' ' + text;
    say(text, 'b', extra);
  }

  var WANTS_DOC = /\brecipe|\brecipes|mapishi|\bstory|\barticle|\bblog|read about|wrote about/i;

  function answer(q) {
    say(q, 'u');
    input.value = '';
    var ci = cartIntent(q);
    if (ci) { setTimeout(function () { reply(q, ci); }, 260); return; }

    var di = deepIntent(q);
    if (di) {
      loadFishPage(di.slug).then(function (sec) {
        var body = sec[di.heading];
        setTimeout(function () {
          if (body) reply(q, { a: di.product.title + ' — ' + di.heading.toLowerCase() + '.\n\n' + body, f: [di.slug] });
          else reply(q, match(q));
        }, 120);
      });
      return;
    }
    if (WANTS_DOC.test(q)) {
      loadDocs().then(function () {
        var d = matchDocs(q);
        setTimeout(function () { reply(q, d || match(q)); }, 120);
      });
      return;
    }
    var m = match(q);
    if (m) { setTimeout(function () { reply(q, m); }, 260); return; }
    loadDocs().then(function () {
      setTimeout(function () { reply(q, matchDocs(q)); }, 120);
    });
  }

  CHIPS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = c;
    b.addEventListener('click', function () { answer(c); });
    chips.appendChild(b);
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = input.value.trim();
    if (v) answer(v);
  });

  var opened = false;
  function open() {
    panel.classList.add('open');
    fab.style.display = 'none';
    if (tip) tip.remove(), tip = null;
    if (!opened) {
      opened = true;
      var ban = document.createElement('img');
      ban.className = 'bs-scene'; ban.alt = '';
      ban.src = BASE + 'images/babu-scene.svg';
      ban.width = 400; ban.height = 210;
      log.appendChild(ban);
      say(GREET, 'b');
    }
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() { panel.classList.remove('open'); fab.style.display = ''; }

  fab.addEventListener('click', open);
  panel.querySelector('.bs-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });

  /* ---------- arrival: one wave, one tooltip, never again ---------- */
  var tip = null;
  function invite() {
    if (!STILL) { fab.classList.add('wave'); setTimeout(function () { fab.classList.remove('wave'); }, 700); }
    if (sessionStorage.getItem('bs_seen')) return;
    if (!/catalogue|fishguide|\/fish\/|\/ocean/.test(path)) return;
    tip = document.createElement('div');
    tip.className = 'bs-tip';
    tip.innerHTML = (KIDS ? 'Karibu. Ask me about the sea.' : 'Karibu. Ask me about fish.')
      + '<button class="bs-x" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(tip);
    requestAnimationFrame(function () { tip.classList.add('in'); });
    tip.querySelector('.bs-x').addEventListener('click', function (e) {
      e.stopPropagation(); tip.remove(); tip = null; sessionStorage.setItem('bs_seen', '1');
    });
    tip.addEventListener('click', open);
    setTimeout(function () { if (tip) { tip.classList.remove('in'); setTimeout(function () { if (tip) tip.remove(), tip = null; }, 320); } }, 7000);
    sessionStorage.setItem('bs_seen', '1');
  }

  var fired = false;
  function arm() {
    if (fired) return; fired = true; invite();
  }
  setTimeout(arm, 8000);
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > document.body.scrollHeight * 0.2) arm();
  }, { passive: true });

  /* ---------- catalogue ---------- */
  fetch(BASE + 'fish-index.json')
    .then(function (r) { return r.json(); })
    .then(function (j) { CAT = j; })
    .catch(function () { CAT = []; });
})();
