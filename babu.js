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
    { k: ['bone', 'bones', 'bony', 'mifupa', 'miiba', 'mwiba', 'hana miiba'], a: 'Papa — shark steak. He has no bones at all, only cartilage, the soft stuff in your ear.\n\nOne thing though: shark is a big old fish, and big old fish carry more mercury. For a small child or a woman carrying one, take Pono or tilapia fillets instead — boneless too, and no mercury worry.\n\nAfter him, Changu. Simple bones, easy to eat around.\n\nIf you want none at all and no thinking, take fillets.', sw: 'Papa — nyama ya papa. Hana miiba hata mmoja, ana gegedu tu, kile kilaini kilichomo sikioni mwako.\n\nLakini jambo moja: papa ni samaki mkubwa mzee, na wakubwa wazee wana zebaki zaidi. Kwa mtoto mdogo au mama mjamzito, chukua Pono au fillet za tilapia badala yake — nazo hazina miiba, wala hakuna wasiwasi wa zebaki.\n\nBaada yake, Changu. Miiba yake ni myepesi, ni rahisi kuiepuka.\n\nUkitaka bila miiba kabisa na bila kufikiri — chukua fillet.', f: ['papa', 'changu', 'red-snapper-fillets'] },
    { k: ['~kaang', 'fry', 'frying', 'kukaanga', 'kaanga', 'deep fry', 'pan fry'], a: 'Changu. Score him three times each side, salt, lime, hot oil. He comes off the bone in clean flakes.\n\nTafi is the everyday choice and cheaper. Mkundaji is the one chefs quietly prefer — small and sweet, almost like prawn.', sw: 'Changu. Mkate mara tatu kila upande, chumvi, ndimu, mafuta ya moto. Hutoka mifupani vipande safi.\n\nTafi ndiye wa kila siku na ni rahisi zaidi. Mkundaji ndiye wapishi humpenda kimyakimya — mdogo na mtamu, karibu kama kamba.', f: ['changu', 'tafi', 'mkundaji'] },
    { k: ['~chom', 'grill', 'grilling', 'bbq', 'barbecue', 'charcoal', 'choma', 'kuchoma', 'mkaa'], a: 'The fire punishes a soft fish. You want dense flesh.\n\nNguru and Jodari cut into thick steaks. Sulisuli Kipanga — swordfish — behaves almost like beef on a grate.\n\nDo not put pono or tafi over fierce heat. They break and fall through.', sw: 'Moto huadhibu samaki mlaini. Unataka nyama ngumu.\n\nNguru na Jodari hukatwa vipande vinene. Sulisuli Kipanga — samaki upanga — hutenda karibu kama nyama ya ngombe juu ya kichomeo.\n\nUsiweke pono au tafi kwenye moto mkali. Huvunjika na kudondoka.', f: ['nguru', 'jodari', 'sulisuli-kipanga'] },
    { k: ['biryani', 'pilau', 'rice'], a: 'Nguru. Kingfish. Nothing else comes close.\n\nBiryani is cooked long and layered, and a soft fish disappears into the rice. Nguru holds his shape.\n\nBuy it cut into thick steaks. One kilo feeds four with rice.', sw: 'Nguru. Hakuna mwingine anayemkaribia.\n\nBiryani hupikwa muda mrefu na kwa tabaka, na samaki mlaini hupotea ndani ya wali. Nguru hushika umbo lake.\n\nNunua akiwa amekatwa vipande vinene. Kilo moja hutosha watu wanne pamoja na wali.', f: ['nguru'] },
    { k: ['~pik', 'curry', 'mchuzi', 'coconut', 'nazi', 'tui', 'stew', 'kupaka'], a: 'Tewa. He flakes into large clean pieces that drink the sauce instead of dissolving into it. That is the mchuzi wa samaki classic.\n\nChangu does the same. If you want something richer, Kolekole stands up to heavy spice.', sw: 'Tewa. Hupasuka vipande vikubwa safi vinavyonywa mchuzi badala ya kuyeyuka ndani yake. Huo ndio mchuzi wa samaki wa asili.\n\nChangu hufanya vivyo hivyo. Ukitaka kitu kizito zaidi, Kolekole huhimili viungo vingi.', f: ['tewa', 'changu', 'kolekole'] },
    { k: ['omega', 'healthy', 'healthiest', 'health', 'nutrition', 'protein', 'afya', 'lishe', 'nzuri kwa afya'], a: 'The small oily fish, and they are the cheapest things we sell.\n\nSimusimu and Una carry omega-3 close to salmon for a fraction of the price. Uwono you eat whole, bones and all, so you get the calcium too.\n\nSalmon is higher still, but it is imported and costs ten times as much.', sw: 'Samaki wadogo wenye mafuta, nao ndio rahisi kuliko vyote tunavyouza.\n\nSimusimu na Una wana omega-3 karibu na salmon kwa sehemu ndogo ya bei. Uwono humla mzima, pamoja na miiba yake, kwa hivyo unapata na kalisi.\n\nSalmon ana zaidi, lakini anaagizwa kutoka nje na anagharimu mara kumi.', f: ['una', 'simusimu', 'uwono'] },
    { k: ['child', 'children', 'kid', 'kids', 'watoto', 'mtoto', 'baby', 'toddler'], a: 'Mild, boneless, small.\n\nPono is the sweetest, gentlest fish on the slab, and he has few bones. Tilapia fillets are so mild that even a suspicious child will eat them.\n\nOne caution — keep swordfish and shark for grown-ups. Big old fish carry more mercury. Small fish carry the least.', sw: 'Mlaini, bila miiba, mdogo.\n\nPono ndiye mtamu na mpole kuliko wote, na ana miiba michache. Fillet za tilapia ni laini kiasi kwamba hata mtoto mwenye shaka atakula.\n\nOnyo moja — samaki upanga na papa waachie wakubwa. Samaki wakubwa wazee wana zebaki zaidi. Wadogo wana kidogo.', f: ['pono', 'tilapia-fillets', 'changu'] },
    { k: ['pregnan', 'expecting', 'mimba', 'mjamzito'], a: 'Small fish, cooked through. Simusimu, Uwono and Una carry the least mercury of anything here, and plenty of the omega-3 that matters.\n\nChangu and Tewa are safe, lean and mild.\n\nWhat to leave alone: swordfish, shark, and anything raw. This is general knowledge, not medical advice — your own doctor knows your situation.', sw: 'Samaki wadogo, waliopikwa vizuri. Simusimu, Uwono na Una wana zebaki kidogo kuliko wote hapa, na omega-3 ya kutosha.\n\nChangu na Tewa ni salama, hawana mafuta mengi, ni wapole.\n\nWa kuachana nao: samaki upanga, papa, na chochote kibichi. Haya ni maarifa ya kawaida, si ushauri wa daktari — daktari wako ndiye anayejua hali yako.', f: ['simusimu', 'una', 'changu'] },
    { k: ['raw', 'sashimi', 'sushi', 'ceviche'], a: 'Only Jodari, and only tuna landed the same morning. Tell us when you order so we pick and handle it for that.\n\nSalmon also, since it arrives cold-chained for the purpose.\n\nRaw fish always carries some risk. If you are pregnant, unwell, elderly or feeding small children — cook it through instead.', sw: 'Jodari tu, na jodari aliyefika asubuhi hiyohiyo. Tuambie unapoagiza ili tumchague na tumshughulikie kwa ajili hiyo.\n\nSalmon pia, kwa sababu hufika akiwa kwenye baridi kwa kusudi hilo.\n\nSamaki mbichi daima ana hatari kiasi. Ukiwa mjamzito, mgonjwa, mzee, au unawalisha watoto wadogo — mpike vizuri badala yake.', f: ['jodari', 'salmon'] },
    { k: ['octopus', 'pweza', 'rubber', 'rubbery', 'chewy', 'tough'], a: 'Fast or slow. Never in between.\n\nEither char him three or four minutes over fierce heat, or simmer him forty-five to sixty minutes until a knife slides in with no resistance. Anything between those two is where rubber lives.\n\nAnd freeze him first. The ice breaks the fibres. A frozen octopus cooks softer than a fresh one — this is true, though people do not believe me.', sw: 'Haraka au polepole. Kamwe si katikati.\n\nAma mchome dakika tatu au nne kwa moto mkali, au mchemshe dakika arobaini na tano hadi sitini mpaka kisu kiingie bila pingamizi. Kati ya hizo mbili ndiko mpira unapoishi.\n\nNa mgandishe kwenye barafu kwanza. Barafu huvunja nyuzi zake. Pweza aliyegandishwa hupikika laini kuliko mbichi — hii ni kweli, ingawa watu hawaniamini.', f: ['pweza', 'ngisi'] },
    { k: ['cheap', 'cheapest', 'value', 'budget', 'affordable', 'bei nafuu', 'rahisi'], a: 'Simusimu, Uwono and Una. Most protein, most omega-3, least money.\n\nAmong the bigger fish, Tewa and Pono at 600 the kilo are the cheapest proper dinner on the page.\n\nThe Omega-3 Combo puts all three small fish together for less than buying them apart.', sw: 'Simusimu, Uwono na Una. Protini nyingi, omega-3 nyingi, pesa kidogo.\n\nMiongoni mwa wakubwa, Tewa na Pono kwa shilingi 600 kilo ndio chakula cha jioni cha bei nafuu zaidi kwenye ukurasa.\n\nOmega-3 Combo huwaweka wote watatu pamoja kwa bei ndogo kuliko kuwanunua mmoja mmoja.', f: ['una', 'tewa', 'pono'] },
    { k: ['first time', 'never cooked', 'beginner', 'easy', 'simple', 'start'], a: 'Buy Changu. Ask for it cleaned and gutted. Score it three times each side, rub salt and lime, fry it.\n\nHe forgives mistakes and he has few bones.\n\nIf a whole fish still feels like a lot, start with tilapia fillets. No bones, no scaling, four minutes in a pan.', sw: 'Nunua Changu. Omba asafishwe na atolewe matumbo. Mkate mara tatu kila upande, msugue chumvi na ndimu, mkaange.\n\nHusamehe makosa, na ana miiba michache.\n\nKama samaki mzima bado ni mwingi kwako, anza na fillet za tilapia. Hakuna miiba, hakuna magamba, dakika nne kwenye sufuria.', f: ['changu', 'tilapia-fillets'] },
    { k: ['wedding', 'harusi', 'celebration', 'party', 'guests', 'crowd', 'function', 'sherehe', 'wageni'], a: 'Variety is what people remember. A whole Nguru in the middle, lobster and kaa for the eyes, prawns and ngisi for the hands.\n\nThat is the Bwanaharusi Special — six kilos, one delivery, priced below the sum of its parts.', sw: 'Watu hukumbuka aina mbalimbali. Nguru mzima katikati, kamba wa miamba na kaa kwa macho, kamba na ngisi kwa mikono.\n\nHiyo ndiyo Bwanaharusi Special — kilo sita, usafirishaji mmoja, kwa bei iliyo chini ya jumla ya vitu vyake.', f: ['nguru', 'lobster', 'prawns-tiger'] },
    { k: ['how much fish', 'how many kilo', 'per person', 'people', 'feeds', 'portion', 'watu wangapi', 'kilo ngapi', 'watu', 'ninahitaji samaki kwa'], a: 'Count 300 grams of fish for each person.\n\nFor whole fish buy more — maybe 400 grams each — because head and bone go back to the sea, not on the plate.\n\nSo six people, two and a half kilos of fillet, or three and a half of whole fish.', sw: 'Hesabu gramu 300 za samaki kwa kila mtu.\n\nKwa samaki mzima nunua zaidi — labda gramu 400 kila mmoja — kwa sababu kichwa na miiba hurudi baharini, si sahanini.\n\nKwa hivyo watu sita: kilo mbili na nusu za fillet, au tatu na nusu za samaki mzima.', f: [] },
    { k: ['~hifadhi', '~gandish', 'store', 'storage', 'keep', 'fridge', 'freeze', 'freezer', 'how long', 'kuhifadhi', 'friji'], a: 'On ice or in the coldest part of the fridge, and cook it within two days.\n\nTo freeze: dry it, wrap it tight, minus eighteen. Three months. Never freeze again what has already thawed.\n\nShellfish is different. Cook it the day it arrives.', sw: 'Juu ya barafu au sehemu baridi zaidi ya friji, na mpike ndani ya siku mbili.\n\nKugandisha: mkaushe, mfunge vizuri, nyuzi kumi na nane chini ya sifuri. Miezi mitatu. Usigandishe tena kilichokwisha yeyuka.\n\nSamakigamba ni tofauti. Wapike siku wanayofika.', f: [] },
    { k: ['~safish', '~meny', '~kat', 'clean', 'gut', 'scale', 'fillet', 'cut', 'prepare', 'kusafisha', 'safisha', 'kukata'], a: 'We clean it however you say — scaled, gutted, filleted, cut into steaks, peeled, or left whole. Choose when you check out.\n\nOne thing to know about prawns: peeling loses about forty in a hundred to shell and head. You pay for the weight you order and receive the cleaned meat.', sw: 'Tunasafisha vyovyote utakavyosema — kutoa magamba, kutoa matumbo, kukata fillet, vipande vinene, kumenya, au kumwacha mzima. Chagua unapomaliza kuagiza.\n\nJambo moja kuhusu kamba: kumenya hupoteza karibu arobaini kwa mia kwa gamba na kichwa. Unalipia uzito unaoagiza, na unapokea nyama iliyosafishwa.', f: [] },
    { k: ['~leta', '~lete', '~fikish', 'deliver', 'delivery', 'transport', 'shipping', 'send', 'county', 'nairobi', 'nakuru', 'kisumu', 'eldoret', 'kuleta', 'usafiri', 'kufikisha'], a: 'Anywhere in Kenya. Mombasa the same day by rider. Everywhere else by express courier or bus, in a sealed cooler with ice that holds cold for up to seventy-two hours.\n\nThe box price you can see on the shop page. The transport we quote you before you pay a shilling — we pass on what the transporter charges us and add nothing.', sw: 'Popote nchini Kenya. Mombasa siku hiyohiyo kwa pikipiki. Kwingine kote kwa kozi ya haraka au basi, ndani ya kikapu cha barafu kilichofungwa kinachoshika baridi hadi saa sabini na mbili.\n\nBei ya kikapu unaiona kwenye ukurasa wa duka. Usafiri tunakuambia kabla hujalipa hata shilingi moja — tunapitisha kile tunachotozwa, hatuongezi kitu.', f: [] },
    { k: ['~lip', 'pay', 'payment', 'mpesa', 'm-pesa', 'cash', 'card', 'kulipa', 'malipo', 'pesa'], a: 'M-Pesa, after we confirm your total. Never before.\n\nYour cart becomes a message on WhatsApp. We reply with what is available and what it comes to — fish, box, transport, as three separate lines. Then you decide.', sw: 'M-Pesa, baada ya kuthibitisha jumla yako. Kamwe si kabla.\n\nKikapu chako huwa ujumbe kwenye WhatsApp. Tunajibu kilichopo na kinafika kiasi gani — samaki, kikapu, usafiri, mistari mitatu tofauti. Kisha wewe unaamua.', f: [] },
    { k: ['fresh', 'freshness', 'how fresh', 'frozen', 'freshi', 'mbichi', 'ya leo'], a: 'The boats leave Shimoni at half past four. They land about eleven, and we buy the same morning, on the sand, from the man who caught it.\n\nCleaned and on ice within hours. Not days.\n\nIf what reaches you is not right, send one photograph within a day and we replace it or refund it. We do not ask you to send fish back.', sw: 'Mitumbwi huondoka Shimoni saa kumi na nusu alfajiri. Hufika karibu saa tano, na tunanunua asubuhi hiyohiyo, mchangani, kutoka kwa mtu aliyemvua.\n\nHusafishwa na kuwekwa kwenye barafu papo hapo.', f: [] },
    { k: ['guarantee', 'refund', 'wrong', 'complain', 'bad', 'problem'], a: 'One photograph within twenty-four hours, and we replace the item on your next order or refund it.\n\nWe do not ask anyone to send fish back. This is a small business on a small coast — our name travels faster than any policy.', sw: 'Picha moja ndani ya saa ishirini na nne, na tunabadilisha kitu hicho kwenye oda yako ijayo au tunarudisha pesa.\n\nHatumwombi mtu kurudisha samaki. Hii ni biashara ndogo kwenye pwani ndogo; sifa yetu husafiri haraka kuliko karatasi yoyote ya sheria.', f: [] },
    { k: ['box', 'boxes', 'bundle', 'combo', 'familia', 'bwanaharusi', 'boil', 'choma box'], a: 'We build ready-made boxes — from a week of family meals to a full wedding table. Every one is priced below the sum of its parts.\n\nThe shop page lists them all with what is inside each.', sw: 'Tunatengeneza visanduku tayari — kutoka mlo wa wiki hadi meza nzima ya harusi. Kila kimoja kina bei chini ya jumla ya vitu vyake.\n\nUkurasa wa duka unaonyesha vyote.', f: [] },
    { k: ['restaurant', 'hotel', 'wholesale', 'bulk', 'trade', 'supply'], a: 'That is a different conversation, and a better one to have with the people at the shop than with me.\n\nThey agree a weekly volume, a price fixed in advance, and cutting to your specification.', sw: 'Hayo ni mazungumzo mengine, na ni bora uyafanye na watu wa dukani kuliko na mimi.\n\nHukubaliana kiasi cha wiki na bei iliyowekwa mapema. Kuna ukurasa wa jumla kwa ajili hiyo.', f: [], wa: true },
    { k: ['sea moss', 'mwani', 'seamoss'], a: 'Farmed on lines in shallow water down the coast, much of it by women working together at Kibuyuni. Sun-dried.\n\nRinse it, soak it four to eight hours until it swells, then blend it into a gel. It keeps two weeks in the fridge.\n\nIt is a food, not a medicine. Be careful of anyone who tells you otherwise.', sw: 'Hupandwa kwenye kamba majini mafupi kandokando ya pwani, wengi wao na wanawake wanaofanya kazi pamoja Kibuyuni. Hukaushwa juani.\n\nSuuza, loweka saa nne hadi nane, kisha saga na maji kidogo mpaka iwe jeli.', f: ['mwani-msafi', 'unga-wa-mwani'] },
    { k: ['honey', 'asali', 'mikoko', 'mangrove'], a: 'The bees forage mangrove blossom, and it gives a dark honey with a faint salt note you will not find inland.\n\nRaw, so it will crystallise. Stand the jar in warm water — never a microwave.\n\nAnd never give honey to a child under one year.', sw: 'Nyuki hutafuta maua ya mikoko, na hutoa asali nyeusi yenye ladha ya chumvi kidogo usiyoipata bara.\n\nNi ghafi, kwa hivyo itaganda. Weka chupa kwenye maji ya uvuguvugu.', f: ['asali-ya-mikoko'] },
    { k: ['prawn', 'prawns', 'kamba', 'shrimp'], a: 'Six sizes, and the number tells you how many to a kilo. Jumbo is a dozen or so — big enough to be the whole meal. Tiger is the sweet spot for most tables. Cocktail are tiny and go in pilau.\n\nBuy shell-on if you want flavour in the sauce. Ask for peeled if you want both hands free.', sw: 'Ukubwa sita, na namba hukuambia wangapi kwa kilo. Jumbo ni kumi na wawili hivi — wakubwa wa kutosha kuwa mlo mzima. Tiger ndiye sawa kwa meza nyingi.', f: ['prawns-jumbo', 'prawns-tiger', 'prawns-cocktail'] },
    { k: ['lobster', 'crab', 'kaa', 'shellfish', 'oyster', 'chaza', 'mussel', 'kome', 'clam'], a: 'Lobster here is the spiny kind — no big front claws, all the meat in the tail, sweeter than the cold-water sort. Split it, garlic butter, six minutes shell-side down.\n\nKaa is the mangrove crab. Steam twelve to fifteen minutes the kilo and crack it at the table.\n\nMussels and clams open in five minutes in coconut. Anything that stays shut, throw away.', sw: 'Kamba wa miamba wa hapa hana makucha makubwa mbele — nyama yote iko mkiani, na ni mtamu kuliko wa maji baridi. Mpasue, siagi ya kitunguu saumu, dakika sita.', f: ['lobster', 'kaa', 'kome'] },
    { k: ['salmon'], a: 'Salmon is a cold-water fish. He does not live in our ocean, and I will not pretend otherwise — ours is imported, and we say so on the label.\n\nIf what you want is the omega-3, buy Una instead. Nearly as much, for a sixth of the price.', sw: 'Salmon ni samaki wa maji baridi. Haishi baharini mwetu, na sitajifanya vinginevyo — wetu anaagizwa kutoka nje, na tunasema hivyo kwenye lebo.', f: ['salmon', 'una'] },
    { k: ['tafi', 'sustainab', 'environment', 'conservation', 'overfish'], a: 'Tafi. He grazes the seagrass, he grows fast, and there are many of him. A fishery lives on fish like that.\n\nThe small oily fish too — simusimu, uwono, una. Eating small fish presses on the ocean far less than eating the big ones that hunt them.\n\nWhat to eat rarely: the large old fish that took twenty years to grow.', sw: 'Tafi. Hula majani ya baharini, hukua haraka, na wako wengi. Uvuvi huishi kwa samaki kama hao.\n\nNa samaki wadogo wenye mafuta pia — simusimu, uwono.', f: ['tafi', 'simusimu'] },
    { k: ['how do i order', 'how to order', 'can i buy', 'can i order', 'place an order', 'order online', 'buy here', 'buy online', 'checkout', 'check out', 'how do i pay you', 'nataka kuagiza', 'naagizaje', 'ninanunuaje', 'kuagiza', 'nunua wapi'], a: 'Two ways, and both start the same.\n\nBuild your basket on the shop page, then either place the order right there \u2014 name, phone, town \u2014 and you get an order number and tracking code on the screen at once. Or send the basket to WhatsApp and talk to a person.\n\nEither way nothing is charged. We reply with what is available and your full total \u2014 fish, cooler box, transport, as three separate lines \u2014 and you pay by M-Pesa only after you have seen it.', sw: 'Njia mbili, na zote zinaanza sawa.\n\nJaza kikapu chako kwenye ukurasa wa duka, kisha ama uweke oda hapohapo \u2014 jina, simu, mji \u2014 nawe utapata namba ya oda na msimbo wa kufuatilia papo hapo. Au tuma kikapu kwenye WhatsApp uzungumze na mtu.\n\nKwa njia yoyote, hakuna kinacholipishwa bado. Tunajibu kilichopo na jumla yako yote \u2014 samaki, kikapu, usafiri, mistari mitatu tofauti \u2014 nawe unalipa kwa M-Pesa baada tu ya kuiona.', f: [], doc: { href: 'catalogue.html#cart', title: 'Go to the shop' } },
    { k: ['wholesale', 'bulk', 'jumla', 'kwa jumla', 'supply my restaurant', 'supply hotel', 'for my restaurant', 'for my hotel', 'restaurant supply', 'hotel supply', 'weekly supply', 'standing order', 'large quantity', 'mgahawa', 'hoteli'], a: 'Yes \u2014 we supply kitchens.\n\nYou tell us the species, the weekly volume, how you want it prepared and which days you need it. We agree a price in advance for the period, so your kitchen knows its cost before the week starts.\n\nThere is no fixed minimum for a first order. For standing supply we agree a weekly volume so we can commit the right buying at the landing site.\n\nThe terms are written out on the wholesale page \u2014 read them, then talk to the shop.', sw: 'Ndiyo \u2014 tunahudumia mikahawa na hoteli.\n\nTuambie aina ya samaki, kiasi cha wiki, jinsi unavyotaka asafishwe, na siku unazohitaji. Tunakubaliana bei mapema kwa kipindi hicho, ili jikoni lako lijue gharama kabla wiki haijaanza.\n\nHakuna kiwango cha chini kwa oda ya kwanza. Kwa ugavi wa kudumu tunakubaliana kiasi cha wiki.\n\nMasharti yote yameandikwa kwenye ukurasa wa jumla.', f: [], doc: { href: 'wholesale.html', title: 'Wholesale terms' }, wa: true },
    { k: ['allerg', 'allergic', 'allergy', 'mzio', 'nina mzio', 'cannot eat shellfish', 'shellfish allergy', 'reaction', 'intolerant'], a: 'This is worth being careful about, so I will be plain with you.\n\nA shellfish allergy and a fish allergy are two different things. Prawns, crab, lobster, squid, octopus, mussels, clams and oysters are shellfish. Changu, nguru, tewa, pono, jodari and the rest are fin fish \u2014 most people allergic to shellfish can eat them.\n\nBut I cannot promise you a clean kitchen. We clean, fillet and pack fish and shellfish on the same surfaces, in the same room, on the same ice. If your allergy is serious, that matters more than which fish you choose, and you should tell the shop before you order so they can decide honestly whether they can serve you safely.\n\nI am not a doctor. If a reaction has ever sent you to hospital, ask yours first.', sw: 'Hili ni la kuangalia kwa makini, kwa hivyo nitakuambia waziwazi.\n\nMzio wa samakigamba na mzio wa samaki ni vitu viwili tofauti. Kamba, kaa, kamba wa miamba, ngisi, pweza, kome na chaza ni samakigamba. Changu, nguru, tewa, pono na jodari ni samaki wa kawaida \u2014 watu wengi wenye mzio wa samakigamba huweza kuwala.\n\nLakini siwezi kukuahidi jiko safi kabisa. Tunasafisha na kufunga samaki na samakigamba mahali pamoja, kwenye barafu moja. Mzio wako ukiwa mkali, hilo ni muhimu kuliko chaguo la samaki \u2014 waambie watu wa dukani kabla ya kuagiza.\n\nMimi si daktari. Kama umewahi kupelekwa hospitali kwa mzio, muulize daktari wako kwanza.', f: [], wa: true },
    { k: ['mkizi', 'mullet', 'white mullet', 'mugil'], a: 'Mkizi \u2014 white mullet. Silver, firm, and cheap at 600 the kilo.\n\nHe is best fried whole until the skin crisps. Score him three times a side, salt and lime, hot oil.\n\nOne honest word about him: mullet feeds off the bottom, so he tastes of the water he lived in. From clean inshore water he is sweet and firm. From a dirty creek he can taste of mud. That is why we care where he comes from and gut him the moment he lands \u2014 and why, if one ever reaches you tasting of mud, you send a photograph and we replace it.\n\nHe is not the same fish as mkundaji, the red mullet. Different family altogether.', sw: 'Mkizi \u2014 samaki wa fedha, mgumu, na rahisi kwa shilingi 600 kilo.\n\nNi mzuri zaidi akikaangwa mzima mpaka ngozi iwe crispy. Mkate mara tatu kila upande, chumvi na ndimu, mafuta ya moto.\n\nNeno moja la ukweli kumhusu: mkizi hula chini, kwa hivyo huonja maji aliyoishi. Kutoka maji safi ya pwani ni mtamu na mgumu. Kutoka mto mchafu anaweza kuonja matope. Ndiyo maana tunajali anakotoka na tunamtoa matumbo mara anapofika \u2014 na kama akikufikia akiwa na ladha ya matope, tuma picha nasi tutabadilisha.\n\nSi sawa na mkundaji. Ni familia tofauti kabisa.', f: ['mkizi', 'changu', 'tafi'] },
    { k: ['ocean hub', 'blue economy', 'uchumi wa buluu', 'mangrove forest', 'mangrove restoration', 'about mangroves', 'coral reef', 'matumbawe', 'seagrass', 'sea grass', 'marine ecosystem', 'marine conservation', 'conservation', 'uhifadhi wa bahari', 'marine research', 'utafiti wa bahari', 'the kenyan coast', 'coastal communities'], a: 'There is a whole page about that now \u2014 the Ocean Hub.\n\nIt gathers what is happening along this coast: the fisheries, the mangroves and reefs, the seaweed farms, the people, and the research being done on all of it. Some of it we wrote ourselves after going out to look; the rest points you to the institutions doing the work.\n\nIf you came here for fish and found yourself curious about the sea it came from, start there.', sw: 'Kuna ukurasa mzima kuhusu hilo sasa \u2014 Ocean Hub.\n\nUnakusanya yanayotokea kwenye pwani hii: uvuvi, mikoko na matumbawe, mashamba ya mwani, watu, na utafiti unaofanyika. Mengine tuliyaandika wenyewe baada ya kwenda kuona; mengine yanakuelekeza kwa taasisi zinazofanya kazi hiyo.\n\nUkija kwa ajili ya samaki kisha ukatamani kujua bahari aliyotoka, anza hapo.', f: [], doc: { href: 'coast.html', title: 'MombasaFish Ocean \u2014 the coast' } },
    { k: ['halal', 'haram', 'is it halal', 'muslim', 'islamic', 'ni halali', 'halali'], a: 'Fish is halal. On that there is no argument anywhere.\n\nShellfish is where the schools differ. Most people on this coast follow the Shafi\u2019i madhhab, which permits everything from the sea \u2014 prawns, crab, lobster, squid, octopus, all of it. Some other schools permit fish only. I am a fishmonger, not a sheikh: follow what you and your family follow, and if you are unsure, ask someone qualified rather than me.\n\nWhat I can tell you is what is in the box. No pork and no alcohol come near our fish \u2014 and if you want to know exactly how a thing was handled, ask the shop and they will tell you plainly.', sw: 'Samaki ni halali. Hilo halina mzozo popote.\n\nSamakigamba ndipo madhehebu hutofautiana. Wengi hapa pwani hufuata madhehebu ya Shafi\u2019i, yanayoruhusu vyote vya baharini \u2014 kamba, kaa, ngisi, pweza, vyote. Madhehebu mengine huruhusu samaki tu. Mimi ni muuza samaki, si sheikh: fuata unavyofuata wewe na familia yako, na ukiwa na shaka, muulize mwenye elimu.\n\nNinachoweza kukwambia ni kilicho ndani ya kikapu. Hakuna nguruwe wala pombe inayokaribia samaki wetu.', f: [], wa: true },
    { k: ['ramadan', 'ramadhan', 'iftar', 'futari', 'suhoor', 'daku', 'fasting', 'kufunga', 'mfungo'], a: 'For futari, after a long day, do not start with something heavy.\n\nA light broth first \u2014 fish head and bones simmered twenty minutes with ginger. Then something gentle: tewa or pono in coconut, changu fried soft, tilapia fillets if the children are eating.\n\nFor daku, before the fast, you want food that stays with you. The oily fish do that best \u2014 simusimu, una, uwono. Protein and fat carry you further than rice alone.\n\nOrder early in Ramadan. Everybody wants fish at futari and the boats do not go out more often because it is Ramadan.', sw: 'Kwa futari, baada ya siku ndefu, usianze na kitu kizito.\n\nSupu nyepesi kwanza \u2014 kichwa na mifupa ya samaki vikichemshwa dakika ishirini na tangawizi. Kisha kitu chepesi: tewa au pono kwenye nazi, changu aliyekaangwa laini, au fillet za tilapia kama watoto wanakula.\n\nKwa daku, kabla ya kufunga, unataka chakula kinachokaa nawe. Samaki wenye mafuta ndio bora \u2014 simusimu, una, uwono.\n\nAgiza mapema mwezi wa Ramadhani. Kila mtu anataka samaki wakati wa futari, na mitumbwi haiongezi safari kwa sababu ni Ramadhani.', f: ['tewa', 'simusimu', 'changu'] },
    { k: ['defrost', 'thaw', 'frozen fish', 'from the freezer', 'kuyeyusha', 'barafu ikiisha'], a: 'Slowly, in the fridge, overnight. That is the whole answer.\n\nNever on the counter and never in hot water \u2014 the outside warms while the middle is still ice, and that is where trouble grows. If you are in a hurry, put it in a sealed bag under cold running water; thirty minutes for a fillet.\n\nCook it the same day it thaws. And never freeze it again \u2014 the second freeze breaks the flesh and you taste it.\n\nPrawns and squid you can cook straight from frozen. They prefer it.', sw: 'Polepole, kwenye friji, usiku kucha. Hilo ndilo jibu lote.\n\nKamwe si mezani na kamwe si kwenye maji ya moto \u2014 nje huwa moto wakati ndani bado ni barafu, na hapo ndipo shida huzaliwa. Ukiwa na haraka, mtie kwenye mfuko uliofungwa chini ya maji baridi yanayotiririka; dakika thelathini kwa fillet.\n\nMpike siku hiyohiyo anayoyeyuka. Na kamwe usimgandishe tena.\n\nKamba na ngisi waweza kuwapika wakiwa wamegandishwa. Wanapendelea hivyo.', f: [] },
    { k: ['crowd', 'many people', 'big group', 'function', 'kesha', 'harambee', 'church', 'msikiti', 'watu wengi', 'fifty people', 'hundred people', 'catering', 'event'], a: 'Work backwards from the plate.\n\nThree hundred grams of fish for each person if it is fillet or steak. Four hundred if it is whole fish, because head and bone go back to the sea, not on the plate.\n\nSo fifty people is fifteen kilos of fillet, or twenty of whole fish. A hundred people, double it.\n\nAt that size do not order off this page \u2014 talk to the shop. They will fix a price in advance, tell you honestly what the boats can land by your date, and pack it so it arrives cold. A wedding is not the day to discover the catch was short.', f: [], wa: true },
    { k: ['recovering', 'recovery', 'unwell', 'sick', 'hospital', 'convalescent', 'mgonjwa', 'anaumwa', 'weak', 'after surgery', 'anemia', 'anaemia'], a: 'Something light, easy to chew, with nothing to pick out.\n\nPono is the gentlest fish on the slab. Tewa flakes into soft clean pieces. Tilapia fillets have no bones at all, which matters when somebody is tired.\n\nAnd broth. Fish head and bones simmered twenty minutes makes a soup that people who cannot face food will still take. On this coast we have fed the sick that way for a very long time.\n\nThis is a fishmonger talking, not a doctor. If there is a diet the hospital gave you, that comes first.', sw: 'Kitu chepesi, rahisi kutafuna, kisicho na cha kuchomoa.\n\nPono ndiye mpole kuliko wote. Tewa hupasuka vipande laini safi. Fillet za tilapia hazina miiba kabisa, jambo la maana mtu akiwa amechoka.\n\nNa supu. Kichwa na mifupa vikichemshwa dakika ishirini hutoa supu ambayo hata asiyeweza kula atainywa. Hapa pwani tumewalisha wagonjwa hivyo tangu zamani.\n\nHuyu ni muuza samaki anayezungumza, si daktari. Kama hospitali walikupa mpango wa chakula, huo unatangulia.', f: ['pono', 'tewa', 'tilapia-fillets'] },
    { k: ['expensive', 'why so expensive', 'too much', 'ghali', 'bei ghali', 'cheaper', 'discount', 'punguza', 'bei nafuu', 'negotiate', 'bargain', 'reduce the price'], a: 'I will not pretend the price is small. Let me tell you where it goes.\n\nA man went out in the dark in a small boat. He came back with what the sea gave him, not what he ordered. It was iced within the hour, driven up from Shimoni, cleaned, weighed and packed cold so it reaches you still stiff. Every one of those steps costs somebody something, and the fisherman is paid first \u2014 that is the point of the whole business.\n\nIf you want to spend less, spend it better. Buy whole instead of fillet, because you are paying for the knife. Take the small fish \u2014 dagaa, tafi, changu \u2014 they are the sweetest and the cheapest. Or take a box, where the saving is already built in. Tell me your budget and I will build you a basket that fits it.', sw: 'Sitasema bei ni ndogo. Nikuambie inakoenda.\n\nMtu alitoka gizani kwa mtumbwi mdogo. Alirudi na alichopewa na bahari, si alichoagiza. Kiliwekwa barafu ndani ya saa moja, kikaletwa kutoka Shimoni, kikasafishwa, kikapimwa na kufungwa kikiwa baridi. Kila hatua inagharimu mtu, na mvuvi hulipwa kwanza \u2014 hiyo ndiyo maana ya biashara hii.\n\nUkitaka kutumia kidogo, tumia vizuri. Nunua mzima badala ya fillet, kwa sababu unalipia kisu. Chukua samaki wadogo \u2014 dagaa, tafi, changu. Au chukua kisanduku. Niambie bajeti yako nami nitakutengenezea kikapu.', f: [] },
    { k: ['protein', 'gym', 'muscle', 'weight loss', 'kupunguza uzito', 'diet', 'lishe', 'calories', 'body building', 'misuli', 'healthy eating'], a: 'Fish is the cheapest honest protein on this coast. Roughly twenty grams in every hundred grams of flesh, and the fat that comes with it is the good kind.\n\nIf you are training and want lean weight: tuna, jodari, nguru. Firm, high protein, very little fat. Grill or pan-sear, do not deep fry.\n\nIf you are cutting: tilapia fillets, pono, changu. Light, clean, filling.\n\nIf you want the omega-3 for your heart and your head: the small oily ones \u2014 simusimu, una, uwono. Two meals a week is the usual advice, and they are the cheapest fish I sell.\n\nHow you cook it decides most of it. The same fillet is a lean meal grilled and a heavy one swimming in oil.', sw: 'Samaki ni protini rahisi na ya kweli zaidi hapa pwani. Karibu gramu ishirini kwa kila gramu mia ya nyama, na mafuta yanayokuja nayo ni ya aina nzuri.\n\nUkifanya mazoezi na unataka misuli: jodari, nguru. Choma au kaanga kidogo, usikaange kwenye mafuta mengi.\n\nUkipunguza uzito: fillet za tilapia, pono, changu.\n\nUkitaka omega-3: wadogo wenye mafuta \u2014 simusimu, una, uwono. Milo miwili kwa wiki, nao ndio rahisi zaidi.\n\nJinsi unavyompika ndiyo huamua mengi.', f: ['jodari', 'simusimu', 'tilapia-fillets'] },
    { k: ['farmed', 'wild', 'wild caught', 'aquaculture', 'pond fish', 'kufugwa', 'wa kufugwa', 'wa porini', 'trawler', 'trawled'], a: 'Almost everything I sell is wild \u2014 caught by hand from small boats out of Shimoni and the reefs around it. Not trawled, not farmed, not flown in.\n\nThe exceptions are honest ones. Tilapia is a lake and pond fish. Salmon is not African at all; it is farmed in cold water far from here and comes to us frozen, and I will never tell you otherwise.\n\nWild does not automatically mean better \u2014 it means the sea decides. The size varies, and some days a fish simply is not there. Farmed means steady supply and a steady price. You are buying a different bargain, not a worse one.', sw: 'Karibu kila kitu ninachouza ni wa porini \u2014 aliyevuliwa kwa mkono na mitumbwi midogo kutoka Shimoni. Si wa kukokotwa, si wa kufugwa, si wa kuletwa kwa ndege.\n\nIsipokuwa wachache wa kweli. Tilapia ni samaki wa ziwa na bwawa. Salmon si wa Afrika kabisa; hufugwa kwenye maji baridi mbali na hapa na hutufikia amegandishwa, nami sitakudanganya.\n\nWa porini si lazima awe bora \u2014 maana yake bahari ndiyo inayoamua. Wa kufugwa maana yake upatikanaji wa uhakika.', f: [] },
    { k: ['leftover', 'leftovers', 'reheat', 'warm it again', 'next day', 'mabaki', 'kupasha', 'iliyobaki', 'aliyebaki', 'day old'], a: 'Cooked fish keeps two days in the fridge, covered. No more.\n\nDo not reheat it hard. The microwave turns good fish into rubber and fills the house with the smell. Warm it gently in a pan with a spoon of coconut milk or water, lid on, low heat, three minutes.\n\nBut the better answer is not to reheat it at all. Flake it cold into a salad with lime and onion. Fold it through rice with a fried egg. Mash it with potato, egg and dhania and fry small cakes \u2014 children who will not touch a fish with a face on it will eat those.', sw: 'Samaki aliyepikwa hukaa siku mbili kwenye friji, amefunikwa. Si zaidi.\n\nUsimpashe kwa nguvu. Microwave humfanya samaki mzuri kuwa mpira na hujaza nyumba harufu. Mpashe polepole kwenye sufuria na kijiko cha tui au maji, funika, moto mdogo, dakika tatu.\n\nLakini jibu bora ni kutompasha kabisa. Mchanganye akiwa baridi kwenye saladi na ndimu na kitunguu. Mchanganye na wali na yai la kukaanga. Msonge na viazi, yai na dhania kisha ukaange vikaanga vidogo.', f: [] },
    { k: ['open', 'hours', 'where are you', 'shop', 'location', 'visit', 'duka', 'wapi', 'mko wapi'], a: 'The shop is in Mombasa — there is a pin on the map at the bottom of every page.\n\nFor hours and whether the boats have come in today, ask the people at the shop. They will know; I only know fish.', sw: 'Duka liko Mombasa — kuna alama kwenye ramani chini ya kila ukurasa.\n\nKwa saa za kufungua na kama mitumbwi imefika leo, waulize watu wa dukani.', f: [], wa: true }
  ];

  function greetText() {
    if (KIDS) return T('Karibu, mwanangu. I am Babu Samaki. Ask me about the sea.',
                       'Karibu, mwanangu. Mimi ni Babu Samaki. Niulize kuhusu bahari.');
    return T('Karibu. I am Babu Samaki. Ask me about fish — what to buy, how to cook it, how much you need.',
             'Karibu. Mimi ni Babu Samaki. Niulize kuhusu samaki — wa kununua, wa kupika, na kiasi unachohitaji.');
  }
  var GREET = greetText();   /* reassigned when the language switch is used */

  function chipSet() {
    if (KIDS) return T(['What is a pweza?', 'Which fish is biggest?', 'Do sharks have bones?', 'What is a coral reef?'],
      ['Pweza ni nini?', 'Samaki gani mkubwa zaidi?', 'Papa ana miiba?', 'Matumbawe ni nini?']);
    if (/fishguide|\/fish\//.test(path)) return T(['How do I cook this?', 'Is it bony?', 'What goes with it?', 'Something cheaper?'],
      ['Nimpike vipi?', 'Ana miiba?', 'Nile na nini?', 'Kuna rahisi zaidi?']);
    if (/recipes/.test(path)) return T(['Can I use another fish?', 'How much for six people?', 'Where do I buy this?', 'How do I store it?'],
      ['Naweza kutumia samaki mwingine?', 'Kiasi gani kwa watu sita?', 'Ninunue wapi?', 'Nihifadhi vipi?']);
    return T(['Which fish has fewest bones?', 'Best for a first-time cook?', 'What is good value?', 'What do I need for biryani?'],
      ['Samaki gani ana miiba michache?', 'Wa mpishi wa mara ya kwanza?', 'Bei nafuu ni ipi?', 'Nahitaji nini kwa biryani?']);
  }
  var CHIPS = chipSet();

  /* ---------- helpers ---------- */
  function norm(s) { return (' ' + s + ' ').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' '); }
  function money(n) { return Number(n).toLocaleString('en-KE'); }

  /* ---------- Swahili ---------- */
  var SWWORDS = [' samaki ', ' gani ', ' nini ', ' wapi ', ' ngapi ', ' bei ', ' nataka ',
    ' naomba ', ' mimi ', ' unaweza ', ' kuna ', ' hana ', ' miiba ', ' watu ', ' habari ',
    ' shikamoo ', ' asante ', ' tafadhali ', ' pesa ', ' leo ', ' nzuri ', ' kupika ',
    ' mnaleta ', ' naweza ', ' vipi ', ' ninahitaji ', ' mna ', ' kwa ', ' yangu ', ' bei '];
  /* ---------- which language is he being spoken to in? ----------
     One Swahili word is not enough: Kenyans code-switch constantly
     ("which samaki is good?" is an English question). Decisive words
     settle it alone; ordinary ones need two. */
  var SW_STRONG = ['nataka','ninahitaji','naomba','niambie','sitaki','tafadhali','kwa nini',
    'bei gani','ni gani','samaki gani','ngapi','vipi','unaweza','unauza','mnauza','nipike',
    'ninunue','nifanye','naweza','tuma','nisaidie','hujambo','shikamoo','mnauzaje',
    'habari za','habari ya','habari yako','asante','shukrani','kwaheri','marahaba','jambo',
    'mambo','niaje','usiku mwema','samahani','pole sana','tutaonana','nakushukuru'];
  var SW_WEAK = ['samaki','kilo','bei','gani','wapi','nini','watoto','mtoto','mjamzito','mzima',
    'mbichi','miiba','mafuta','kupika','pika','kuchoma','choma','kaanga','kukaanga','mchuzi',
    'hifadhi','kuhifadhi','friji','barafu','asante','habari','karibu','sawa','ndiyo','hapana',
    'kuna','hakuna','hii','hiyo','yangu','yako','wewe','mimi','nzuri','rahisi','ghali','leo',
    'nyumbani','duka','pesa','malipo','kulipa','kuleta','usafiri','watu','wangapi','nyama'];

  function isSwahili(q) {
    var s = norm(q), n = 0;
    for (var i = 0; i < SW_STRONG.length; i++) if (s.indexOf(' ' + SW_STRONG[i]) > -1) return true;
    SW_WEAK.forEach(function (w) { if (s.indexOf(' ' + w + ' ') > -1) n++; });
    return n >= 2;
  }

  var LANG = 'en';
  try { LANG = localStorage.getItem('mf_babu_lang') || 'en'; } catch (e) {}
  /* the message wins over the switch: Swahili in, Swahili out */
  function langOf(q) { return isSwahili(q) ? 'sw' : LANG; }
  function T(en, sw) { return LANG === 'sw' && sw ? sw : en; }


  /* Questions he must never answer from the rulebook, however well they match.
     Places we do not serve, and terms that are not his to agree. */
  var HANDOFF = ['uganda', 'tanzania', 'rwanda', 'somalia', 'ethiopia', 'export to', 'ship abroad',
    'pay after', 'pay later', 'pay on delivery', 'cash on delivery', 'lipa nikipokea', 'credit', 'invoice', 'discount', 'cheaper price', 'negotiate',
    'partnership', 'job', 'employ', 'invest'];

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
        if (kw.charAt(0) === '~') {                 /* Swahili verb stem */
          var st = kw.slice(1);
          if (q.split(' ').some(function (w) { return w.length > 2 && w.indexOf(st) > -1; })) s += st.length + 2;
          return;
        }
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


  /* ---------- the rest of his own house ----------
     He already reads the 42 product pages, the blog and recipe
     indexes. These are the pages he could not reach: the Ask page,
     the fish guide, wholesale, about, the ecosystem and the policies.
     Roughly 8,700 words, all written by us, all true. Loaded only
     when the rulebook comes up empty, then kept for the session. */
  var SITE_PAGES = [
    { u: 'ask.html',       label: 'Ask the fishmonger' },
    { u: 'fishguide.html', label: 'The fish guide' },
    { u: 'wholesale.html', label: 'Wholesale' },
    { u: 'about.html',     label: 'How we source' },
    { u: 'ecosystem.html', label: 'Our ecosystem' },
    { u: 'policies.html',  label: 'Policies & guarantee' },
    { u: 'shimoni.html',   label: 'Why Shimoni' }
  ];
  var SECTIONS = null, SECTIONS_LOADING = null, DF = {}, NSEC = 1;

  function loadSections() {
    if (SECTIONS) return Promise.resolve();
    if (SECTIONS_LOADING) return SECTIONS_LOADING;
    SECTIONS_LOADING = Promise.all(SITE_PAGES.map(function (p) {
      return fetch(BASE + p.u).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; });
    })).then(function (pages) {
      SECTIONS = [];
      pages.forEach(function (html, i) {
        if (!html) return;
        var page = SITE_PAGES[i], doc;
        try { doc = new DOMParser().parseFromString(html, 'text/html'); } catch (e) { return; }

        /* the Ask page: <div class="askq"><h2>Q</h2><div class="aska">A</div></div> */
        doc.querySelectorAll('.askq').forEach(function (d) {
          var h = d.querySelector('h2'), a = d.querySelector('.aska');
          if (!h || !a) return;
          var t = a.textContent.replace(/\s+/g, ' ').trim();
          if (t.length > 40) SECTIONS.push({ p: page, h: h.textContent.trim(), t: t.slice(0, 700) });
        });

        /* question-and-answer blocks: the policies */
        doc.querySelectorAll('details').forEach(function (d) {
          var s = d.querySelector('summary'), a = d.querySelector('.a') || d;
          if (!s) return;
          var t = a.textContent.replace(s.textContent, '').replace(/\s+/g, ' ').trim();
          if (t.length > 40) SECTIONS.push({ p: page, h: s.textContent.trim(), t: t.slice(0, 700) });
        });

        /* ordinary sections with a heading */
        doc.querySelectorAll('section, .psec').forEach(function (sec) {
          if (sec.querySelector('details') || sec.querySelector('.askq')) return;   /* already taken */
          var h = sec.querySelector('h2, h3');
          if (!h) return;
          var t = sec.textContent.replace(h.textContent, '').replace(/\s+/g, ' ').trim();
          if (t.length > 80) SECTIONS.push({ p: page, h: h.textContent.trim(), t: t.slice(0, 700) });
        });
      });
      /* how common is each word? "delivery" is everywhere, "refund" is not. */
      DF = {}; NSEC = SECTIONS.length || 1;
      SECTIONS.forEach(function (s) {
        var seen = {};
        norm(s.h + ' ' + s.t).split(' ').forEach(function (w) {
          if (w.length < 4 || seen[w]) return;
          seen[w] = 1; DF[w] = (DF[w] || 0) + 1;
        });
      });
    }).catch(function () { SECTIONS = []; });
    return SECTIONS_LOADING;
  }

  var STOP = { what:1, when:1, where:1, which:1, does:1, do:1, you:1, your:1, the:1, and:1, for:1,
    can:1, have:1, with:1, from:1, are:1, is:1, how:1, much:1, many:1, that:1, this:1, they:1, will:1, here:1, there:1, about:1, just:1, like:1, some:1, more:1,
    tell:1, know:1, want:1, need:1, please:1, also:1, been:1, than:1, then:1, them:1 };

  function matchSection(qRaw) {
    if (!SECTIONS || !SECTIONS.length) return null;
    var seen = {}, q = [];
    norm(qRaw).trim().split(' ').forEach(function (w) {
      if (w.length >= 4 && !STOP[w] && !seen[w]) { seen[w] = 1; q.push(w); }
    });
    if (!q.length) return null;

    var best = null, bestScore = 0, bestHead = 0, bestBody = 0;
    SECTIONS.forEach(function (s) {
      var head = norm(s.h), body = norm(s.t), score = 0, inHead = 0, inBody = 0;
      q.forEach(function (w) {
        var idf = Math.log(NSEC / (1 + (DF[w] || 0))) + 0.4;   /* rare words count for more */
        var k = idf * w.length;
        if (head.indexOf(' ' + w) > -1) { score += k * 3; inHead++; }
        else if (body.indexOf(' ' + w) > -1) {
          var c = body.split(' ' + w).length - 1;
          score += k * Math.min(c, 3); inBody++;
        }
      });
      if (score > bestScore) { bestScore = score; best = s; bestHead = inHead; bestBody = inBody; }
    });

    /* answer only when confident: the heading matched, or several distinct
       words did. Otherwise stay quiet and let the team take it. */
    var confident = (bestHead >= 1 && bestScore >= 14) || (bestBody >= 2 && bestScore >= 26);
    if (!best || !confident) return null;

    var body = best.t;
    if (body.length > 420) {
      var cut = body.slice(0, 420);
      var stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '));
      body = (stop > 180 ? cut.slice(0, stop + 1) : cut) + ' …';
    }
    var lead = (LANG === 'sw')
      ? 'Hili limeandikwa kwenye tovuti yetu (kwa Kiingereza):'
      : 'This is what our own page says.';
    return { a: lead + '\n\n' + best.h + '\n\n' + body, doc: { href: best.p.u, title: best.p.label } };
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




  /* ================= how he talks to people =================
     Before he knows anything about fish, he should know how to
     be greeted, thanked, doubted and complained to. An elder who
     answers "that one I cannot tell you" to "hello" is no elder. */

  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function hour(){ return new Date().getHours(); }
  function timeGreet(){
    var h = hour();
    if (h < 5)  return 'You are awake late, mwanangu.';
    if (h < 12) return 'Habari za asubuhi.';
    if (h < 16) return 'Habari za mchana.';
    if (h < 19) return 'Habari za jioni.';
    return 'Habari za usiku.';
  }

  var TALK = [
    { id:'shikamoo', k:['shikamoo','shikamo'], sw: function(){ return 'Marahaba, mwanangu.\n\nNi vizuri kusalimiwa vyema. Sasa — unataka kujua nini?'; },
      reply: function(){
        return 'Marahaba, mwanangu.\n\nIt is good to be greeted properly. Now — what do you want to know?'; } },

    { id:'greet', k:['hello','hallo','hi','hey','habari','jambo','mambo','sasa','salaam','salam',
        'good morning','good afternoon','good evening','niaje','vipi','hujambo','karibu'], sw: function(){ return timeGreetSw() + '\n\n' + pick([
          'Mimi ni Babu Samaki. Niulize kuhusu samaki — wa kununua, wa kupika, na kiasi unachohitaji.',
          'Karibu. Keti. Niulize lolote kuhusu bahari au kilicho juu ya barafu leo.',
          'Karibu. Nimekaa majini muda mrefu. Unahitaji nini?' ]); },
      reply: function(){
        return timeGreet() + '\n\n' + pick([
          'I am Babu Samaki. Ask me about fish — what to buy, how to cook it, how much you need.',
          'Karibu. Sit. Ask me anything about the sea or what is on the ice today.',
          'Karibu. I have been on this water a long time. What do you need?' ]); } },

    { id:'howareyou', k:['how are you','habari yako','u hali gani','how you doing','uko aje'], sw: function(){ return pick([
          'Mimi ni mzima. Bahari ilikuwa nzuri asubuhi hii.',
          'Nzuri tu. Magoti yangu yanalalamika, samaki hawalalamiki.',
          'Nipo, na kwa umri wangu hiyo yatosha.' ]) + '\n\nNa wewe je? Unapika nini?'; },
      reply: function(){
        return pick([
          'I am well. The sea was kind this morning.',
          'Well enough. My knees complain, the fish do not.',
          'I am here, and that is enough at my age.' ]) + '\n\nAnd you? What are you cooking?'; } },

    { id:'thanks', k:['thank','thanks','asante','shukran','shukrani','nashukuru','appreciate'], sw: function(){ return pick([ 'Karibu sana.', 'Karibu. Si kitu.', 'Karibu, mwanangu.' ])
          + '\n\nRudi tena ukinihitaji. Mimi siendi popote.' + (Math.random() < .45 ? methali('sw') : ''); },
      reply: function(){
        return pick([
          'Karibu sana.',
          'Karibu. It is nothing.',
          'Karibu, mwanangu.' ]) + '\n\nCome back when you need me. I do not go anywhere.' + (Math.random() < .45 ? methali('en') : ''); } },

    { id:'bye', k:['bye','goodbye','kwaheri','later','see you','tutaonana','baadaye','good night','usiku mwema'],
      sw: function(){ return pick([
          'Kwaheri. Mpike vizuri.',
          'Nenda salama. Na usimpike pweza kupita kiasi.',
          'Kwaheri, mwanangu. Bahari itakuwepo kesho pia.' ]) + (Math.random() < .45 ? methali('sw') : ''); },
      reply: function(){
        return pick([
          'Kwaheri. Cook it well.',
          'Nenda salama. And do not overcook the octopus.',
          'Kwaheri, mwanangu. The sea will still be here tomorrow.' ]) + (Math.random() < .45 ? methali('en') : ''); } },

    { id:'who', k:['who are you','what is your name','your name','who is babu','are you babu',
        'wewe ni nani','jina lako'], sw: function(){ return 'Wananiita Babu Samaki.\n\nNimetumia maisha yangu kwenye pwani hii. Sasa ninakaa hapa na kujibu maswali ili mtu asisubiri duka lifunguliwe.'; },
      reply: function(){
        return 'They call me Babu Samaki — Grandfather Fish.\n\nI have spent my life on this coast. Now I sit here and answer questions so nobody has to wait for the shop to open.'; } },

    { id:'real', k:['are you real','are you human','are you a robot','are you a bot','are you ai',
        'are you a person','ni mtu','wewe ni roboti','are you alive','chatbot'], sw: function(){ return 'Hapana, mwanangu. Mimi si mtu halisi.\n\nMimi ni kitu ambacho duka lilijenga ili kuwe na mtu wa kukujibu kila wakati — usiku, Jumapili, wakati mitumbwi iko baharini.\n\nLakini ninayokuambia kuhusu samaki ni ya kweli. Yanatoka kwa watu wanaofanya kazi hiyo, na nisipojua jambo, nitasema sijui badala ya kubuni.'; },
      reply: function(){
        return 'No, mwanangu. I am not a real man.\n\nI am something the shop built so that somebody is always here — at night, on a Sunday, when the boats are out.\n\nBut what I tell you about fish is true. It comes from people who do the work, and if I do not know a thing, I will say so rather than invent it.'; } },

    { id:'canyou', k:['what can you do','can you help','how do you work','what do you know',
        'unaweza nini','unajua nini','help me'], sw: function(){ return 'Ninawajua samaki wa pwani hii — nani ana miiba, nani anafaa motoni, nani ni mzuri kwa mtoto au kwa mama mjamzito.\n\nNinajua bei za kila kitu, na naweza kuweka kwenye kikapu chako ukiniambia kilo ngapi.\n\nNinajua mapishi na hadithi zilizo kwenye tovuti hii.\n\nNisiyoyajua — usafiri kwenda mahali ambapo hatujafika, au bei ambazo hatujakubaliana — nitawapa watu wa dukani.'; },
      reply: function(){
        return 'I know the fish on this coast — which has bones, which suits the fire, which is good for a child or a woman carrying one.\n\nI know what everything costs, and I can put it in your basket if you tell me how many kilos.\n\nI know the recipes and the stories on this site.\n\nWhat I do not know — delivery to a place we have not been, prices we have not agreed — I will hand to the people at the shop.'; } },

    { id:'compliment', k:['i love','nice site','beautiful site','good site','well done','you are helpful',
        'good job','impressive','poa','nzuri sana','safi','vizuri'], sw: function(){ return pick([
          'Asante. Waliojenga hii walifanya kazi kubwa.',
          'Asante, mwanangu. Mwambie mtu mwingine, hiyo ndiyo shukrani bora.',
          'Asante. Sasa — tuzungumze kuhusu samaki?' ]); },
      reply: function(){
        return pick([
          'Asante. The people who built this worked hard on it.',
          'Asante, mwanangu. Tell somebody else, that is the best thanks.',
          'Asante. Now — shall we talk about fish?' ]); } },

    { id:'complaint', k:['not happy','unhappy','disappointed','bad service','you are late','late delivery',
        'poor','terrible','awful','angry','complain','complaint','kulalamika','malalamiko','sijaridhika',
        'nimechelewa','never arrived','did not arrive','wrong order'], sw: function(){ return 'Samahani. Hilo halikupaswa kutokea.\n\nSiwezi kulirekebisha kutoka hapa — mimi najua samaki tu — lakini watu wa dukani wanaweza, na watafanya. Wapelekee picha moja na ueleze kilichokwenda vibaya.\n\nKama samaki hakuwa mzuri, watabadilisha au watarudisha pesa. Hawakuombi kurudisha samaki.'; },
      reply: function(){
        return 'I am sorry. That should not have happened.\n\nI cannot fix it from here — I only know fish — but the people at the shop can, and they will. Send them one photograph and what went wrong.\n\nIf the fish was not right, they replace it or refund it. They do not ask you to send it back.'; },
      wa: true },

    { id:'order', k:['where is my order','my order','track my order','order status','my delivery',
        'oda yangu','imefika wapi','when will it arrive','has it been sent','dispatched'], sw: function(){ return 'Unaweza kujionea mwenyewe.\n\nKwenye risiti yako ya WhatsApp kuna namba ya oda na msimbo wa kufuatilia. Weka zote mbili kwenye ukurasa wa kufuatilia, nao utakuambia samaki wako amefika wapi.\n\nUkurasa usipompata, watu wa dukani watajua.'; },
      reply: function(){
        return 'You can see it yourself.\n\nOn your WhatsApp receipt there is an order number and a tracking code. Put both on the tracking page and it will tell you where your fish has reached.\n\nIf the page cannot find it, the shop will know.'; },
      track: true },

    { id:'company', k:['who owns','who runs','about the company','about mombasafish','your company',
        'tell me about you','your story','how long have you','who started'], sw: function(){ return 'MombasaFish ni biashara ndogo iliyoko Mombasa. Samaki hutoka kwenye mitumbwi midogo ya Shimoni, wanunuliwa mchangani asubuhi ileile wanapofika.\n\nHilo ndilo wazo lote — hakuna madalali kati ya aliyemvua na atakayemla.\n\nKuna maelezo zaidi kwenye tovuti ukitaka.'; },
      reply: function(){
        return 'MombasaFish is a small business in Mombasa. The fish comes from the small boats at Shimoni, bought on the sand the same morning it lands.\n\nThat is the whole idea — no brokers between the man who caught it and the person who eats it.\n\nThere is a fuller telling on the site if you want it.'; },
      link: 'about.html', linkLabel: 'How we source →' },

    { id:'shimoni', k:['why shimoni','where is shimoni','about shimoni','pemba channel'], sw: function(){ return 'Kwa sababu ya mahali maji ya kina yalipo.\n\nHuko Shimoni, Mkondo wa Pemba hukaribia ufuo, kwa hivyo mtumbwi mdogo huweza kufika kwa samaki wa bahari kuu na kurudi siku hiyohiyo. Na ndani yake kuna matumbawe, majani ya baharini na mikoko — makazi matatu tofauti kwa samaki wa aina tatu.\n\nKuna ukurasa kuhusu hilo.'; },
      reply: function(){
        return 'Because of where the deep water sits.\n\nAt Shimoni the Pemba Channel comes close to shore, so a small boat can reach open-ocean fish and be home the same day. And inshore of it there is reef, seagrass and mangrove — three different homes for three different kinds of fish.\n\nThere is a page about it.'; },
      link: 'shimoni.html', linkLabel: 'Why Shimoni →' },

    { id:'ack', k:['ok','okay','sawa','sawa sawa','alright','fine','yes','yeah','ndiyo','no','hapana',
        'haha','hahaha','lol','hmm','cool','great','sure'], whole: true, sw: function(){ return pick([ 'Mm.', 'Sawa.', 'Ndiyo.', 'Haya.' ]) + ' ' + pick([
          'Niulize ukiwa tayari.', 'Nini kingine?', 'Nipo hapa.' ]); },
      reply: function(){
        return pick([ 'Mm.', 'Sawa.', 'Ndiyo.', 'Haya.' ]) + ' ' + pick([
          'Ask me when you are ready.',
          'What else?',
          'I am here.' ]); } },

    { id:'smalltalk', k:['weather','football','politics','news','joke','music','how is life','story ya'],
      sw: function(){ return 'Hilo liko nje ya maji yangu, mwanangu.\n\nNinajua samaki, bahari, na la kufanya na vyote viwili. Niulize mojawapo, utaniona wa manufaa.'; },
      reply: function(){
        return 'That one is outside my water, mwanangu.\n\nI know fish, the sea, and what to do with both. Ask me one of those and you will find me useful.'; } }
  ];

  /* A conversational opener attached to a real question should not
     swallow the question. Greet, then answer what was actually asked. */
  var GREETINGS_ONLY = /^(habari\s+(za|ya)\s+\w+|habari\s+yako|good\s+(morning|afternoon|evening)|shikamoo|hello|hallo|habari|jambo|mambo|niaje|salaam|salam|sasa|vipi|hey|hi)\b[\s,!.]*/i;

  function talkMatch(qRaw) {
    var q = norm(qRaw);
    var words = q.trim().split(' ').filter(Boolean).length;
    var best = null, bestScore = 0;
    TALK.forEach(function (t) {
      var s = 0;
      t.k.forEach(function (kw) {
        if (q.indexOf(' ' + kw + ' ') > -1) s += kw.length + 2;
        else if (q.indexOf(' ' + kw) > -1) s += kw.length;
      });
      if (s > bestScore) { bestScore = s; best = t; }
    });
    if (!best || bestScore < 2) return null;
    /* single common words — "no", "yes", "fine" — are only ever an
       acknowledgement when they are the entire message. Otherwise
       "which fish has no bones" gets answered with "Mm. What else?" */
    if (best.whole) {
      var bare = q.trim();
      var isWhole = best.k.some(function (kw) { return bare === kw; });
      if (!isWhole) return null;
    }
    /* long messages are questions with manners on the front, not chit-chat */
    if (words > 6 && best.id !== 'complaint' && best.id !== 'order' &&
        best.id !== 'real' && best.id !== 'who' && best.id !== 'company') return null;
    return best;
  }


  /* ============ methali — real Swahili proverbs, used sparingly ============ */
  var METHALI = [
    { sw:'Samaki mkunje angali mbichi.',            en:'Bend the fish while it is still fresh.' },
    { sw:'Haraka haraka haina baraka.',             en:'Hurry hurry has no blessing.' },
    { sw:'Mvumilivu hula mbivu.',                   en:'The patient one eats the ripe fruit.' },
    { sw:'Ukiona vyaelea, vimeundwa.',              en:'If you see things floating, they were built.' },
    { sw:'Maji ukiyavulia nguo huna budi kuyaoga.', en:'Once undressed for the water, you must bathe in it.' },
    { sw:'Penye nia ipo njia.',                     en:'Where there is will, there is a way.' }
  ];
  function methali(L) {
    var m = METHALI[Math.floor(Math.random() * METHALI.length)];
    return L === 'sw' ? '\n\n' + m.sw : '\n\n' + m.sw + '\n(' + m.en + ')';
  }

  /* ============ the monsoon — kaskazi and kusi ============ */
  function season() {
    var m = new Date().getMonth();                       /* 0 = Jan */
    if (m === 10 || m === 11 || m <= 2) return 'kaskazi';
    if (m === 3 || m === 4) return 'matlai';
    if (m >= 5 && m <= 7) return 'kusi';
    return 'kusi-end';
  }
  var SEASON_RE = /\b(season|monsoon|this month|right now|what.{0,4}(good|best) (today|now|this)|kaskazi|kusi|msimu|wakati gani|mwezi huu|leo kuna nini|sasa hivi)\b/i;
  function seasonAnswer(L) {
    var s = season();
    var T2 = {
      kaskazi: { en:'We are in kaskazi — the north-east monsoon, November to March.\n\nThe sea lies flat, the small boats go out most days, and the big pelagics come within reach. This is when nguru and jodari are at their best, and when sailfish and sulisuli are landed.\n\nIt is the easiest season to buy well. Take the big fish now.',
                 sw:'Tuko kwenye kaskazi — pepo za kaskazi mashariki, Novemba hadi Machi.\n\nBahari iko shwari, mitumbwi hutoka karibu kila siku, na samaki wa bahari kuu hufikika. Huu ndio wakati wa nguru na jodari, na ndipo sulisuli hupatikana.\n\nNi msimu rahisi wa kununua vizuri. Chukua wakubwa sasa.' },
      matlai:  { en:'We are between the winds — matlai, the turn from kaskazi into kusi.\n\nThe sea is deciding what it wants to do. Some days the boats go far, some days they stay inshore. Reef fish are the safer bet: changu, tewa, pono.\n\nIf you want nguru, take it now. It gets harder from here.',
                 sw:'Tuko kati ya pepo — matlai, mabadiliko kutoka kaskazi kwenda kusi.\n\nBahari bado inaamua. Siku nyingine mitumbwi huenda mbali, siku nyingine hukaa karibu. Samaki wa miamba ndio salama zaidi: changu, tewa, pono.\n\nUkitaka nguru, mchukue sasa. Kuanzia hapa inakuwa vigumu.' },
      kusi:    { en:'We are deep in kusi — the south-east monsoon, and the roughest of it.\n\nThe wind is up, the small boats lose days, and reaching the deep water is hard work. So I would not promise you swordfish this week.\n\nWhat is steady now is the reef: changu, tewa, pono, tafi. And the small oily fish, which are cheap and never fail.',
                 sw:'Tuko ndani kabisa ya kusi — pepo za kusi mashariki, na ndio kali zaidi.\n\nUpepo ni mkali, mitumbwi hupoteza siku, na kufika kwenye kina ni kazi. Kwa hivyo sitakuahidi samaki upanga wiki hii.\n\nWa kutegemea sasa ni wa miamba: changu, tewa, pono, tafi. Na wale wadogo wenye mafuta, ambao ni rahisi na hawakosekani.' },
      'kusi-end': { en:'Kusi is easing — September into October, the wind dropping off.\n\nThe boats are getting their days back and the deep water is opening up again. Reef fish are still the reliable buy, but nguru and jodari start returning.\n\nBy November the sea lies flat and everything is on the table.',
                 sw:'Kusi inapungua — Septemba kuelekea Oktoba, upepo unatulia.\n\nMitumbwi inarudisha siku zake na kina kinaanza kufikika tena. Samaki wa miamba bado ndio wa kutegemea, lakini nguru na jodari wanaanza kurudi.\n\nIfikapo Novemba bahari hulala na kila kitu kinapatikana.' }
    }[s];
    return L === 'sw' ? T2.sw : T2.en;
  }

  /* ============ budget basket — "nina 2000, nipe nini?" ============ */
  var MONEY_CUE = /\b(nina|niko na|i have|i've got|ive got|budget|bajeti|bob|ksh|kes|shillings?|shilingi|pesa|elfu|worth of|kwa)\b/i;
  var ELFU = { moja:1, mbili:2, tatu:3, nne:4, tano:5, sita:6, saba:7, nane:8, tisa:9, kumi:10 };
  function parseBudget(q) {
    var s = norm(String(q).replace(/,(?=\d)/g, ''));   /* 2,500 must not become 2 500 */
    if (!MONEY_CUE.test(s)) return 0;
    var e = s.match(/elfu\s+(\w+)/);
    if (e && ELFU[e[1]]) return ELFU[e[1]] * 1000;
    var d = s.match(/(\d[\d,]{2,6})/);
    if (!d) return 0;
    var n = parseFloat(d[1].replace(/,/g, ''));
    if (/\belfu\b/.test(s) && n <= 20) n *= 1000;
    return (n >= 400 && n <= 200000) ? n : 0;
  }
  function bySlug(sl) { return CAT.filter(function (x) { return x.slug === sl; })[0]; }
  function budgetBasket(B, L) {
    /* variety beats volume: one reef fish, one small oily, one treat */
    var groups = [
      ['changu', 'tewa', 'pono', 'red-snapper'],
      ['simusimu', 'una', 'uwono'],
      ['pweza', 'ngisi', 'prawns-tiger', 'kaa'],
      ['nguru', 'jodari']
    ];
    var pick = [], spent = 0;
    groups.forEach(function (g) {
      for (var i = 0; i < g.length; i++) {
        var p = bySlug(g[i]);
        if (p && p.unit === 'kg' && spent + p.price <= B * 0.92) { pick.push({ p: p, kg: 1 }); spent += p.price; return; }
      }
    });
    if (!pick.length) {                                  /* small budget: cheapest single item */
      var cheap = CAT.filter(function (p) { return p.unit === 'kg' && p.price <= B; })
                     .sort(function (a, c) { return a.price - c.price; })[0];
      if (!cheap) return null;
      pick.push({ p: cheap, kg: Math.max(0.5, Math.floor((B / cheap.price) * 2) / 2) });
      spent = cheap.price * pick[0].kg;
    }
    /* spend the remainder evenly, and never pile 20 kg of sardines on one man */
    var CAPKG = 4, idx = 0, guard = 0;
    while (guard++ < 200) {
      var added = false;
      for (var i = 0; i < pick.length; i++) {
        var it = pick[(idx + i) % pick.length];
        if (it.kg + 0.5 <= CAPKG && spent + it.p.price / 2 <= B) {
          it.kg += 0.5; spent += it.p.price / 2; idx = (idx + i + 1) % pick.length; added = true; break;
        }
      }
      if (!added && pick.length < 7) {          /* money left over buys variety, not bulk */
        var extra = CAT.filter(function (p) {
          return p.unit === 'kg' && spent + p.price <= B &&
                 p.slug !== 'salmon' &&                       /* imported — he will not push it */
                 /Whole Fish|Fillets|Prawns|Shellfish/i.test(p.cat) &&
                 !pick.some(function (x) { return x.p.slug === p.slug; });
        }).sort(function (a, c) { return c.price - a.price; })[0];
        if (extra) { pick.push({ p: extra, kg: 1 }); spent += extra.price; added = true; }
      }
      if (!added) break;
    }
    var left = B - spent;
    var rows = pick.map(function (it) {
      var line = it.p.title + (it.p.sub ? ' (' + it.p.sub + ')' : '');
      return { line: line, kg: it.kg, cost: it.p.price * it.kg, p: it.p };
    });
    return { rows: rows, spent: spent, left: left, pick: pick };
  }

  /* ============ cart adviser ============ */
  var COAST = /mombasa|kilifi|kwale|lamu|tana river|taita/i;
  var CART_RE = /\b(check|review|look at|see)\s+(my\s+)?(cart|basket|kikapu)|kikapu changu|nimesahau|am i missing|anything missing|is my (cart|order) ok/i;
  function cartAdvice(L) {
    var d = readCart(), q = d.q || {}, names = Object.keys(q);
    if (!names.length) return L === 'sw'
      ? 'Kikapu chako ni tupu bado.\n\nNiambie unapika nini, au bajeti yako, nami nitakujazia.'
      : 'Your basket is empty.\n\nTell me what you are cooking, or what you have to spend, and I will fill it.';
    var kg = 0, val = 0, shell = false, prawn = false;
    names.forEach(function (n) {
      var p = CAT.filter(function (x) { return x.name === n; })[0];
      if (!p) return;
      if (p.unit === 'kg') kg += q[n];
      val += p.price * q[n];
      if (/Shellfish|pweza|ngisi|kaa|lobster|clam/i.test(p.cat + ' ' + p.slug)) shell = true;
      if (/Prawn/i.test(p.cat)) prawn = true;
    });
    var out = [], notes = [];
    out.push(L === 'sw'
      ? 'Kwenye kikapu: vitu ' + names.length + ', karibu kilo ' + kg + ', jumla KES ' + val.toLocaleString() + '.'
      : 'In your basket: ' + names.length + ' item' + (names.length > 1 ? 's' : '') + ', about ' + kg + ' kg, KES ' + val.toLocaleString() + '.');
    var far = d.county && !COAST.test(d.county);
    if (far && d.noBox) notes.push(L === 'sw'
      ? 'Unatuma ' + d.county + ' bila kikapu cha barafu. Hiyo ni safari ndefu — bila barafu iliyofungwa, samaki hafiki akiwa mzima. Ningeongeza kikapu.'
      : 'This is going to ' + d.county + ' with no cooler box. That is a long road — without sealed ice the fish will not arrive as it left. I would add the box.');
    if (!d.county) notes.push(L === 'sw'
      ? 'Hujachagua kaunti bado. Ichague ili tujue usafiri na ukubwa wa kikapu.'
      : 'You have not picked a county yet. Choose it so we can size the box and quote the transport.');
    if (shell) notes.push(L === 'sw'
      ? 'Una samakigamba humo. Wapike siku wanayofika — hawasubiri kama samaki wa kawaida.'
      : 'You have shellfish in there. Cook it the day it arrives — it does not keep like fin fish.');
    if (prawn && d.prep && /peel/i.test(d.prep)) notes.push(L === 'sw'
      ? 'Umechagua kumenya kamba. Kumbuka: gamba na kichwa ni karibu asilimia arobaini ya uzito.'
      : 'You chose peeled prawns. Remember shell and head are about forty per cent of the weight.');
    if (kg >= 5 && kg <= 20) notes.push(L === 'sw'
      ? 'Kwa kilo ' + kg + ', kikapu cha kilo ' + (kg <= 10 ? 10 : 20) + ' ndicho kinachofaa.'
      : 'At ' + kg + ' kg, the ' + (kg <= 10 ? 10 : 20) + ' kg cooler is the right size.');
    if (!notes.length) notes.push(L === 'sw' ? 'Inaonekana sawa kwangu.' : 'It looks right to me.');
    return out.concat(notes).join('\n\n');
  }


  /* ============ what to take instead ============ */
  var ALT = {
    nguru:['jodari','kolekole','tengesi'], jodari:['nguru','sulisuli','sulisuli-kipanga'],
    'sulisuli':['nguru','jodari','kolekole'], 'sulisuli-kipanga':['nguru','jodari','kolekole'],
    tengesi:['kolekole','nguru','changu'],
    changu:['tewa','red-snapper','kolekole'], tewa:['changu','pono','red-snapper'],
    pono:['tewa','tafi','changu'], tafi:['mkizi','pono','tewa'],
    kolekole:['tengesi','changu','nguru'], 'red-snapper':['changu','tewa','kolekole'],
    mkizi:['tafi','una','pono'],
    mkundaji:['changu','tafi','pono'], songoro:['changu','kolekole','tewa'],
    papa:['red-snapper-fillets','tilapia-fillets','pono'],
    simusimu:['una','uwono'], una:['mkizi','simusimu','uwono'], uwono:['simusimu','una'],
    salmon:['una','jodari','nguru'],
    pweza:['ngisi','kaa'], ngisi:['pweza','prawns-tiger'],
    kaa:['lobster','pweza','prawns-jumbo'], lobster:['kaa','prawns-jumbo','prawns-king'],
    'prawns-tiger':['prawns-king','prawns-s1','ngisi'], 'prawns-king':['prawns-tiger','prawns-jumbo'],
    'prawns-jumbo':['prawns-king','lobster'], 'prawns-s1':['prawns-tiger','prawns-s2'],
    'tilapia-fillets':['white-snapper-fillets','red-snapper-fillets','pono'],
    'red-snapper-fillets':['white-snapper-fillets','tilapia-fillets'],
    'white-snapper-fillets':['red-snapper-fillets','tilapia-fillets']
  };
  var FIRM = ['nguru','jodari','sulisuli','sulisuli-kipanga','kolekole','papa','tengesi'];
  var SOFT = ['pono','tafi','tewa'];
  var SUB_RE = /\b(instead of|in place of|alternative|substitute|replace|what else|something else|other than|apart from)\b|badala ya|mbadala|hakuna|hamna|mmeisha|umeisha|nitumie nini|nichukue nini|kama sipati/i;

  function subAnswer(p, q, L) {
    var list = (ALT[p.slug] || []).map(bySlug).filter(Boolean);
    if (!list.length) return null;
    var nm = function (x) { return (x.sub && x.sub.length < 20 ? x.sub : x.title); };
    var head = L === 'sw'
      ? (nm(p) + ' hayupo? Haya, hawa ndio ninaokupendekeza:')
      : ('No ' + nm(p) + '? Then these are the ones I would take:');
    var body = list.map(function (x, i) {
      var tag = L === 'sw'
        ? (i === 0 ? 'karibu sawa kabisa' : i === 1 ? 'mzuri pia' : 'kama huyo hayupo')
        : (i === 0 ? 'closest of all' : i === 1 ? 'also good' : 'if that one is gone');
      return '· ' + nm(x) + ' — KES ' + x.price + '/' + x.unit + ' — ' + tag;
    }).join('\n');
    var warn = '';
    if (FIRM.indexOf(p.slug) > -1) warn = L === 'sw'
      ? '\n\nUsichukue pono wala tafi badala yake. Ni walaini — watavunjika motoni na kupotea kwenye wali.'
      : '\n\nDo not take pono or tafi in his place. They are soft — they break on the fire and vanish into rice.';
    else if (SOFT.indexOf(p.slug) > -1) warn = L === 'sw'
      ? '\n\nHawa wote ni wapole. Ukiwapika, usiwageuze mara nyingi.'
      : '\n\nThese are all gentle fish. Once they are in the pan, turn them once and no more.';
    return { text: head + '\n\n' + body + warn, f: list.slice(0, 3).map(function (x) { return x.slug; }) };
  }

  /* ============ how to tell a fresh fish ============ */
  var FRESH_RE = /\b(how (do|can|will) i (know|tell|check)|how to tell|is it (really )?fresh|freshness|check(ing)? (if|the fish)|spot a (bad|fresh)|gone off|off fish)\b|najuaje|nitajuaje|nitajuaje kama|kujua kama.*mbichi|ni mbichi kweli|jinsi ya kujua/i;
  function freshAnswer(L) {
    return L === 'sw'
      ? 'Tumia macho, kisha kidole, kisha pua. Kwa mpangilio huo.\n\nMacho: yawe angavu na yamejaa. Yakiwa na ukungu au yamezama — ni siku, si masaa.\n\nMashavu: inua kifuniko. Yawe mekundu kama damu mpya. Yakiwa ya kahawia au kijivu — mwache.\n\nNyama: ibonyeze. Irudi mahali pake. Kidole chako kikiacha shimo, amezeeka.\n\nHarufu: ya bahari. Kamwe si ya amonia. Harufu kali ndiyo ishara ya kwanza ya kweli.\n\nMagamba yashikane, si yanayoanguka. Na mkia usiwe umekauka.\n\nFanya hivi kwa samaki wangu pia. Ninapendelea ukague.'
      : 'Use your eyes, then your finger, then your nose. In that order.\n\nEyes: clear and full. Cloudy or sunken means days, not hours.\n\nGills: lift the flap. Red like fresh blood. Brown or grey — leave it.\n\nFlesh: press it. It should come back. If your finger leaves a hole, it is old.\n\nSmell: the sea, and nothing more. Never ammonia. The nose is the first honest witness.\n\nScales should hold on, not fall off in your hand. The tail should not be dried out.\n\nDo this to my fish too. I would rather you checked.';
  }

  /* ============ when the cooking goes wrong ============ */
  var TROUBLE = [
    { re:/\b(dry|dried out|tough|chewy|like cardboard)\b|kavu|imekauka|ngumu/i, not:/octopus|pweza|ngisi|squid/i,
      en:'You cooked it too long. Almost always that.\n\nFish is done when the flesh turns from clear to white and just parts when you push it. That is it. Another two minutes and you have lost it.\n\nTake it off the heat while it still looks a moment underdone — it keeps cooking on the plate.\n\nAnd lean fish punishes you faster. Changu and tewa have little fat to protect them. Oily fish like jodari forgive more.',
      sw:'Umempika muda mrefu kupita kiasi. Karibu daima ni hilo.\n\nSamaki huiva nyama yake inapobadilika kutoka rangi ya uwazi kuwa nyeupe, na kutengana kidogo ukiisukuma. Basi. Dakika mbili zaidi na umempoteza.\n\nMtoe motoni akiwa bado anaonekana kama hajaiva kabisa — huendelea kuiva sahanini.\n\nNa samaki asiye na mafuta huadhibu haraka. Changu na tewa hawana mafuta ya kuwalinda. Wenye mafuta kama jodari husamehe zaidi.' },
    { re:/\b(rubber|rubbery|bouncy|like a tyre)\b|mpira/i,
      en:'Then it is octopus, and you stopped in the middle.\n\nThere are only two ways: three or four minutes over fierce heat, or forty-five to sixty minutes at a gentle simmer. Anywhere between those is rubber.\n\nFreeze him before you cook him. The ice breaks the fibres, and a frozen octopus comes out softer than a fresh one. People never believe me on this.',
      sw:'Basi huyo ni pweza, na ulisimama katikati.\n\nKuna njia mbili tu: dakika tatu au nne kwa moto mkali, au dakika arobaini na tano hadi sitini kwa moto wa taratibu. Kati ya hizo ni mpira.\n\nMgandishe kabla ya kumpika. Barafu huvunja nyuzi, na pweza aliyegandishwa hutoka laini kuliko mbichi. Watu hawaniamini kwa hili.' },
    { re:/\b(fell apart|fall apart|falls apart|falling apart|broke|breaking|crumbl|disintegrat)\b|imevunjika|inavunjika|imesambaratika/i,
      en:'Three reasons, and it is usually the first.\n\nYou turned it too early. Fish lets go of the pan by itself when it is ready. If it sticks, it is not ready — wait.\n\nOr the pan was not hot when the fish went in.\n\nOr you chose a soft fish for a hard job. Pono and tafi break easily. For frying and turning, take changu.',
      sw:'Sababu tatu, na mara nyingi ni ya kwanza.\n\nUlimgeuza mapema mno. Samaki hujiachia mwenyewe kutoka kwenye sufuria akiwa tayari. Akishikamana, bado hajawa tayari — subiri.\n\nAu sufuria haikuwa moto samaki alipoingia.\n\nAu ulimchagua samaki mlaini kwa kazi ngumu. Pono na tafi huvunjika kwa urahisi. Kwa kukaanga na kugeuza, chukua changu.' },
    { re:/\b(stuck|sticking|sticks to the pan|glued)\b|imeshikamana|inashikamana/i,
      en:'The pan was not hot enough, or the fish was wet, or both.\n\nDry the fish with a cloth first. Water is the enemy — it steams instead of searing.\n\nHeat the pan until the oil shimmers, then put the fish in and leave it alone. Do not touch it. It will release itself.',
      sw:'Sufuria haikuwa moto wa kutosha, au samaki alikuwa na maji, au vyote viwili.\n\nMkaushe samaki kwa kitambaa kwanza. Maji ndio adui — hufanya achemke badala ya kukaangika.\n\nPasha sufuria mpaka mafuta yametetemeka, kisha mtie samaki na umwache. Usimguse. Atajiachia mwenyewe.' },
    { re:/\b(smell|smells|stink|stinks|ammonia|fishy)\b|harufu|inanuka/i,
      en:'If it smells of ammonia, do not cook it and do not eat it. That fish is finished. If it came from us, send a photograph the same day.\n\nIf it is only strong and fishy, that is often the blood line along the bone. Cut it out. A rinse in water with lime or a little vinegar helps too.\n\nAnd never leave fish sitting in its own melted ice water.',
      sw:'Ikiwa ananuka amonia, usimpike wala usimle. Samaki huyo amekwisha. Kama alitoka kwetu, tuma picha siku hiyohiyo.\n\nIkiwa ni harufu kali tu ya samaki, mara nyingi ni mstari wa damu ulio kando ya mfupa. Ukate. Kumsuuza kwa maji yenye ndimu au siki kidogo pia husaidia.\n\nNa kamwe usimwache samaki amekaa ndani ya maji ya barafu iliyoyeyuka.' },
    { re:/\b(bland|no taste|tasteless|no flavour|no flavor)\b|haina ladha|haina chumvi/i,
      en:'You salted it too late.\n\nSalt the fish and let it sit twenty minutes before it meets the heat. It needs time to travel inward. Salt at the pan only seasons the outside.\n\nScore the sides three times so salt, lime and spice reach the middle. That is what the cuts are for — not decoration.',
      sw:'Ulimtia chumvi kuchelewa.\n\nMtie chumvi na umwache dakika ishirini kabla hajakutana na moto. Chumvi inahitaji muda kuingia ndani. Chumvi ya sufurani hukolea nje tu.\n\nMkate pembeni mara tatu ili chumvi, ndimu na viungo vifike katikati. Ndiyo maana ya mikato hiyo — si mapambo.' },
    { re:/\b(raw inside|not cooked|undercooked|still cold)\b|mbichi ndani|hajaiva/i,
      en:'The heat was too high and the fish too thick. The outside burned before the middle woke up.\n\nDrop the heat and give it time. Or cut thinner steaks.\n\nFor a whole fish, the test is the thickest part behind the head. When a knife goes in there with no resistance and comes out warm, it is done.',
      sw:'Moto ulikuwa mkali mno na samaki mnene mno. Nje kuliungua kabla ndani hakujaamka.\n\nPunguza moto na umpe muda. Au kata vipande vyembamba zaidi.\n\nKwa samaki mzima, kipimo ni sehemu nene nyuma ya kichwa. Kisu kikiingia hapo bila pingamizi na kikatoka kikiwa na joto, ameiva.' }
  ];
  var TROUBLE_RE = /\b(went wrong|came out|turned out|why (is|did|was) (my|the) (fish|it)|my fish|problem|mistake)\b|samaki wangu|nilipika|imekuwa|kwa nini/i;
  function troubleAnswer(q, L) {
    for (var i = 0; i < TROUBLE.length; i++) {
      var t = TROUBLE[i];
      if (t.re.test(q) && !(t.not && t.not.test(q))) return L === 'sw' ? t.sw : t.en;
    }
    return null;
  }

  /* ============ nothing is wasted ============ */
  var WASTE_RE = /\b(fish head|heads|the head|bones|frame|carcass|shells|scraps|leftover|left over|fish stock|fish broth|throw away|throwing away|waste)\b|kichwa|vichwa|mifupa|maganda|mabaki|supu|mchuzi wa kichwa|kutupa/i;
  /* "which fish has no bones" must never reach the soup answer */
  var NOT_WASTE = /\b(no|few|fewest|without|any|less|least)\s+(bones|bone)\b|hana (miiba|mifupa)|bila (miiba|mifupa)|hakuna miiba/i;
  function wasteAnswer(L) {
    return L === 'sw'
      ? 'Unatupa sehemu bora?\n\nKichwa na mifupa hutengeneza supu inayotengeneza mchuzi. Maji baridi yafunike mifupa, kitunguu, nyanya moja, tangawizi. Dakika ishirini tu — zaidi ya hapo inakuwa chungu.\n\nMaganda ya kamba vivyo hivyo. Yakaange kwenye sufuria kavu kwanza mpaka yabadilike rangi, kisha tia maji. Hapo ndipo ladha ya bahari inapoishi.\n\nNa kichwa cha samaki mkubwa — nguru au tewa — kina nyama mashavuni na nyuma ya macho. Wavuvi hula hiyo kwanza. Kuna sababu.'
      : 'You are throwing away the best part?\n\nThe head and the frame make the stock that makes the sauce. Cold water to cover the bones, an onion, one tomato, ginger. Twenty minutes only — longer and it turns bitter.\n\nPrawn shells the same. Dry-fry them in the pan first until they change colour, then add the water. That is where the flavour of the sea lives.\n\nAnd the head of a big fish — nguru or tewa — has meat in the cheeks and behind the eye. Fishermen eat that first. There is a reason for it.';
  }


  /* ---------- the ready-made boxes, read from the shop page ----------
     Hard-coding these went stale the day a price moved. He now reads
     catalogue.html, so adding or repricing a box needs no change here. */
  var BOXES = null, BOXES_LOADING = null;
  function loadBoxes() {
    if (BOXES) return Promise.resolve();
    if (BOXES_LOADING) return BOXES_LOADING;
    BOXES_LOADING = fetch(BASE + 'catalogue.html')
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        BOXES = [];
        if (!html) return;
        var doc;
        try { doc = new DOMParser().parseFromString(html, 'text/html'); } catch (e) { return; }
        doc.querySelectorAll('.bcard').forEach(function (c) {
          var h = c.querySelector('h3'), now = c.querySelector('.now'), save = c.querySelector('.save');
          if (!h || !now) return;
          var meta = [];
          c.querySelectorAll('.bmeta i').forEach(function (i) { meta.push(i.textContent.trim()); });
          var items = [];
          c.querySelectorAll('.blist li').forEach(function (li) {
            items.push(li.textContent.replace(/\s+/g, ' ').trim());
          });
          BOXES.push({
            name: h.textContent.replace(/\s+/g, ' ').trim(),
            now: now.textContent.replace(/[^0-9,]/g, ''),
            save: save ? save.textContent.replace(/[^0-9,]/g, '') : '',
            meta: meta, items: items,
            sw: (c.querySelector('.bsw') || {}).textContent || ''
          });
        });
        BOXES.sort(function (a, z) {
          return parseInt(a.now.replace(/,/g, ''), 10) - parseInt(z.now.replace(/,/g, ''), 10);
        });
      }).catch(function () { BOXES = []; });
    return BOXES_LOADING;
  }

  var BOX_RE = /\bbox(es)?\b|ready.?made|bundle|combo|kisanduku|visanduku|sanduku|pakiti/i;

  function boxAnswer(L) {
    if (!BOXES || !BOXES.length) return null;
    var lead = (L === 'sw')
      ? 'Kuna visanduku ' + BOXES.length + ' vilivyotayarishwa. Kila kimoja ni rahisi kuliko kununua vitu vilevile mmoja mmoja:'
      : 'There are ' + BOXES.length + ' ready-made boxes. Every one costs less than buying the same seafood separately:';
    var lines = BOXES.map(function (x) {
      return '· ' + x.name + ' — KES ' + x.now + (x.save ? ' (save ' + x.save + ')' : '')
           + (x.meta.length ? ' — ' + x.meta.slice(0, 2).join(', ') : '');
    }).join('\n');
    var tail = (L === 'sw')
      ? '\n\nNiambie unapika kwa watu wangapi, nami nitakuambia kipi kinakufaa.'
      : '\n\nTell me how many people you are cooking for and I will tell you which one fits.';
    return { a: lead + '\n\n' + lines + tail,
             doc: { href: 'catalogue.html#boxes', title: 'See all the boxes' } };
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
  var css = '.bs-fab{position:fixed;top:calc(50% - 30px);z-index:130;width:60px;height:60px;border-radius:50%;border:0;padding:0;cursor:pointer;background:#07474C;box-shadow:0 8px 24px rgba(3,42,46,.32);overflow:hidden}'
    + '.bs-fab img{width:100%;height:100%;display:block}'
    + '.bs-fab.wave{animation:bswave .6s ease-in-out 1}'
    + '@keyframes bswave{0%,100%{transform:rotate(0)}30%{transform:rotate(-9deg)}60%{transform:rotate(7deg)}}'
    + '.bs-tip{position:fixed;top:calc(50% - 104px);z-index:130;background:#FFFEFA;border:1px solid rgba(3,42,46,.14);border-radius:14px;padding:.6rem .85rem;font:400 .82rem/1.45 Inter,system-ui,sans-serif;color:#0B2E31;max-width:14rem;box-shadow:0 8px 22px rgba(3,42,46,.16);opacity:0;transition:opacity .3s}'
    + '.bs-tip.in{opacity:1}'
    + '.bs-x{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;border:1px solid rgba(3,42,46,.14);background:#FFFEFA;color:#4A6467;font-size:.8rem;line-height:1;cursor:pointer}'
    + '.bs-panel{position:fixed;bottom:18px;z-index:131;width:min(380px,calc(100vw - 24px));max-height:min(70vh,560px);max-height:min(70dvh,560px);overscroll-behavior:contain;background:#FAF6EE;border:1px solid rgba(3,42,46,.14);border-radius:20px;box-shadow:0 20px 50px rgba(3,42,46,.3);display:none;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px) scale(.98);transition:opacity .2s ease,transform .24s cubic-bezier(.2,.8,.3,1)}'
    + '.bs-panel.open{display:flex}.bs-panel.in{opacity:1;transform:none}'
    + '.bs-head{display:flex;align-items:center;gap:.6rem;padding:.75rem .9rem;background:#07474C;color:#F2EDE3;flex:0 0 auto}'
    + '.bs-head img{width:38px;height:38px;border-radius:50%;flex:0 0 auto}'
    + '.bs-head b{font:500 .95rem/1.2 Inter,system-ui,sans-serif;display:block}'
    + '.bs-head span{font:400 .72rem/1.3 "IBM Plex Mono",monospace;color:#7FD4C1}'
    + '.bs-close{margin-left:auto;background:none;border:0;color:#F2EDE3;font-size:1.5rem;line-height:1;cursor:pointer;padding:.1rem .3rem}'
    + '.bs-doc i{color:#FF6B5A}'
    + '.bs-doc{padding:.6rem .75rem}'
    + '.bs-think{opacity:.6;font-style:italic}'
    + '.bs-scene{width:100%;height:auto;border-radius:12px;display:block;flex:0 0 auto}'
    + '.bs-log{flex:1 1 auto;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:.9rem;display:flex;flex-direction:column;gap:.7rem}'
    + '.bs-msg{font:400 .9rem/1.62 Inter,system-ui,sans-serif;white-space:pre-line;max-width:92%}'
    + '.bs-msg.b{background:#FFFEFA;border:1px solid rgba(3,42,46,.1);border-radius:4px 16px 16px 16px;padding:.7rem .85rem;color:#0B2E31;align-self:flex-start}'
    + '.bs-msg.u{background:#07474C;color:#F2EDE3;border-radius:16px 16px 4px 16px;padding:.6rem .85rem;align-self:flex-end}'
    + '.bs-card{display:flex;align-items:center;gap:.6rem;background:#FFFEFA;border:1px solid rgba(3,42,46,.12);border-radius:12px;padding:.45rem;text-decoration:none;margin-top:.35rem}'
    + '.bs-card img{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}'
    + '.bs-card b{display:block;font:500 .84rem/1.25 Inter,system-ui,sans-serif;color:#032A2E}'
    + '.bs-card i{font:400 .74rem/1.4 "IBM Plex Mono",monospace;color:#4A6467;font-style:normal}'
    + '.bs-lang{margin-left:auto;margin-right:.4rem;background:rgba(255,255,255,.16);color:#fff;border:0;border-radius:999px;min-width:44px;height:30px;font:600 .74rem/1 IBM Plex Mono,ui-monospace,monospace;letter-spacing:.06em;cursor:pointer}'
    + '.bs-lang:hover{background:rgba(255,255,255,.28)}'
    + '.bs-wa{display:inline-block;margin-top:.5rem;background:#1FAF54;color:#fff;text-decoration:none;border-radius:999px;padding:.55rem 1rem;font:500 .84rem/1 Inter,system-ui,sans-serif}'
    + '.bs-chips{display:flex;flex-wrap:wrap;gap:.35rem;padding:0 .9rem .7rem}'
    + '.bs-chips button{background:#FFFEFA;border:1px solid rgba(3,42,46,.16);border-radius:999px;padding:.45rem .8rem;min-height:36px;font:400 .8rem/1 Inter,system-ui,sans-serif;color:#07474C;cursor:pointer}'
    + '.bs-chips button:hover{border-color:#7FD4C1}'
    + '.bs-form{display:flex;gap:.4rem;padding:.7rem .9rem;border-top:1px solid rgba(3,42,46,.1);flex:0 0 auto}'
    + '.bs-form input{flex:1;border:1px solid rgba(3,42,46,.16);border-radius:999px;padding:.6rem .9rem;font:400 .9rem Inter,system-ui,sans-serif;min-height:44px}'
    + '.bs-form button{background:#07474C;color:#F2EDE3;border:0;border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:1rem}'
    + '.bs-hide{position:fixed;top:calc(50% - 40px);z-index:132;width:26px;height:26px;border-radius:50%;'
    + 'border:1.5px solid rgba(3,42,46,.18);background:#FFFEFA;color:#0B2E31;cursor:pointer;padding:0;'
    + 'font:600 15px/1 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 3px 10px rgba(3,42,46,.25)}'
    + '.bs-hide:hover,.bs-hide:focus-visible{background:#F2EDE3;outline:2px solid #07474C;outline-offset:1px}'
    + '.bs-fab,.bs-tip,.bs-panel{right:18px}'
    + '.bs-hide{right:12px}'
    + '@media(max-width:760px){.bs-fab,.bs-tip,.bs-panel{right:auto;left:12px}.bs-panel{left:12px;right:12px;width:auto}.bs-hide{right:auto;left:56px}}'
    + '@media(prefers-reduced-motion:reduce){.bs-fab.wave{animation:none}.bs-tip{transition:none}.bs-panel{transition:none;transform:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement('button');
  fab.className = 'bs-fab';
  fab.setAttribute('aria-label', 'Ask Babu Samaki');
  fab.innerHTML = '<img src="' + BASE + 'images/babu-avatar-2.svg" alt="" width="60" height="60">';

  var panel = document.createElement('div');
  panel.className = 'bs-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Babu Samaki');
  panel.innerHTML =
    '<div class="bs-head"><img src="' + BASE + 'images/babu-avatar-2.svg" alt=""><span><b>Babu Samaki</b>'
    + '<span>' + (KIDS ? 'Ocean Explorers' : 'MombasaFish · Shimoni') + '</span></span>'
    + '<button class="bs-lang" id="bsLang" type="button">' + (LANG === 'sw' ? 'EN' : 'SW') + '</button>'
    + '<button class="bs-close" aria-label="Close">&times;</button></div>'
    + '<div class="bs-log" id="bsLog"></div>'
    + '<div class="bs-chips" id="bsChips"></div>'
    + '<form class="bs-form"><input type="text" aria-label="Ask a question" placeholder="'
    + (KIDS ? 'Ask about the sea…' : 'Ask about fish…') + '" autocomplete="off"><button type="submit" aria-label="Send">→</button></form>';

  var hideBtn = document.createElement('button');
  hideBtn.className = 'bs-hide';
  hideBtn.type = 'button';
  hideBtn.innerHTML = '&times;';
  hideBtn.setAttribute('aria-label', 'Hide Babu Samaki for now');
  hideBtn.title = 'Hide Babu — he comes back next visit';

  document.body.appendChild(fab);
  document.body.appendChild(hideBtn);
  document.body.appendChild(panel);

  var log = panel.querySelector('#bsLog'),
      chips = panel.querySelector('#bsChips'),
      form = panel.querySelector('form'),
      input = panel.querySelector('input');


  /* ---------- anonymous record of what people ask ----------
     The question only. No IP, no name, no cookie, no identifier.
     Phone numbers and emails are stripped again server-side.
     Fire-and-forget: if it fails, Babu carries on as if nothing happened. */
  var LOG_SB  = 'https://tcpqbrchpxpshmqprbkv.supabase.co';
  var LOG_KEY = 'sb_publishable_7YLqP3JMq8AFZQl4XF--bw_itOMj1gA';
  var PENDING = null;

  function logQ(q, outcome) {
    try {
      var clean = String(q || '')
        .replace(/(\+?254|0)[17][0-9]{8}/g, '[phone]')
        .replace(/[0-9]{7,}/g, '[number]')
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '[email]')
        .slice(0, 200);
      if (!clean.trim()) return;
      fetch(LOG_SB + '/rest/v1/rpc/mfm_log_babu', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', 'apikey': LOG_KEY, 'Authorization': 'Bearer ' + LOG_KEY },
        body: JSON.stringify({ p_q: clean, p_lang: LANG, p_outcome: outcome, p_page: location.pathname })
      }).catch(function () {});
    } catch (e) { }
  }

  function outcomeOf(extra, text) {
    if (/wa\.me/.test(extra || '')) return 'handoff';
    if (/catalogue\.html#cart/.test(extra || '')) return 'cart';
    if (/bs-doc/.test(extra || '')) return 'doc';
    if (/bs-card/.test(extra || '')) return 'product';
    return 'answered';
  }

  function say(text, cls, extra) {
    var d = document.createElement('div');
    d.className = 'bs-msg ' + cls;
    d.textContent = text;
    if (extra) { var e = document.createElement('div'); e.innerHTML = extra; d.appendChild(e); }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    if (cls === 'b' && PENDING) { logQ(PENDING, outcomeOf(extra, text)); PENDING = null; }
  }


  /* ---------- last resort: ask the model (grounded, server-side) ----------
     Empty ASK_URL = feature off; Babu behaves exactly as before.            */
  var ASK_URL = '';
  var ASK_TRIES = 0;

  function askRemote(q) {
    if (!ASK_URL || ASK_TRIES >= 6) return Promise.resolve(null);
    ASK_TRIES++;
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
    return fetch(ASK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: String(q).slice(0, 400), lang: LANG }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        clearTimeout(timer);
        if (!j || !j.a || j.handoff) return null;
        return String(j.a).slice(0, 1400);
      })
      .catch(function () { clearTimeout(timer); return null; });
  }

  function thinking(on) {
    var log = document.getElementById('bsLog');
    if (!log) return;
    var old = document.getElementById('bsThink');
    if (old) old.remove();
    if (!on) return;
    var d = document.createElement('div');
    d.className = 'bs-msg b bs-think';
    d.id = 'bsThink';
    d.textContent = T('Let me think\u2026', 'Hebu nifikiri\u2026');
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function reply(q, m) {
    if (!m) {
      var giveUp = function () {
        thinking(false);
        say(T('That one I cannot tell you. It is outside what I know.\n\nBut I have kept your question. Tap below and it goes to the shop exactly as you asked it \u2014 you do not have to type it again. They are quick.',
              'Hilo siwezi kukwambia. Liko nje ya ninayoyajua.\n\nLakini nimelihifadhi swali lako. Bonyeza hapa chini nalo litakwenda dukani kama ulivyouliza \u2014 huhitaji kuandika tena. Wao ni wepesi.'),
          'b', '<a class="bs-wa" href="' + waLink(q) + '">' + T('Send my question on WhatsApp →', 'Peleka swali langu WhatsApp →') + '</a>');
      };
      if (!ASK_URL) { giveUp(); return; }
      thinking(true);
      askRemote(q).then(function (a) {
        if (!a) { giveUp(); return; }
        thinking(false);
        say(a, 'b', '<a class="bs-wa" href="' + waLink(q) + '">' +
          T('Check with the team on WhatsApp →', 'Thibitisha na wafanyakazi WhatsApp →') + '</a>');
      });
      return;
    }
    var extra = '';
    if (m.cart) {
      extra = '<a class="bs-wa" style="background:#07474C" href="' + BASE + 'catalogue.html#cart">' + T('See my cart →', 'Ona kikapu changu →') + '</a>';
      extra += (m.f || []).map(cardHTML).join('');
    } else if (m.doc) {
      extra = '<a class="bs-card bs-doc" href="' + BASE + m.doc.href + '">'
        + '<span><b>' + m.doc.title + '</b><i>Read it →</i></span></a>';
    } else {
      extra = (m.f || []).map(cardHTML).join('');
      if (m.wa) extra += '<a class="bs-wa" href="' + waLink(q) + '">' + T('Ask the team on WhatsApp →', 'Uliza wafanyakazi kwenye WhatsApp →') + '</a>';
    }
    if (m.f && m.f.length && CAT.length) {
      var lp = CAT.filter(function (x) { return x.slug === m.f[0]; })[0];
      if (lp) LAST = lp;
    }
    var text = (langOf(q) === 'sw' && m.sw) ? m.sw : m.a;
    say(text, 'b', extra);
  }

  var WANTS_DOC = /\brecipe|\brecipes|mapishi|\bstory|\barticle|\bblog|read about|wrote about/i;

  function answer(q) {
    PENDING = q;
    say(q, 'u');
    input.value = '';
    var stripped = q.replace(GREETINGS_ONLY, '').trim();
    /* "hi there", "hello babu", "habari mzee" — the tail is address,
       not a question. Treat the whole thing as a plain greeting. */
    if (stripped && /^(there|babu|samaki|mzee|sir|madam|bwana|friend|my friend|again|to you|everyone)[\s!.?]*$/i.test(stripped)) stripped = '';
    var greeted = stripped && stripped.length < q.trim().length;

    var tm = talkMatch(q);
    if (tm && (!greeted || !stripped)) {
      setTimeout(function () {
        var extra = '';
        var LS = langOf(q) === 'sw';
        if (tm.wa)    extra = '<a class="bs-wa" href="' + waLink(q) + '">' + (LS ? 'Zungumza na wafanyakazi kwenye WhatsApp →' : 'Talk to the team on WhatsApp →') + '</a>';
        if (tm.track) extra = '<a class="bs-wa" style="background:#07474C" href="' + BASE + 'track.html">' + (LS ? 'Fuatilia oda yangu →' : 'Track my order →') + '</a>';
        if (tm.link)  extra = '<a class="bs-wa" style="background:#07474C" href="' + BASE + tm.link + '">' + tm.linkLabel + '</a>';
        say((langOf(q) === 'sw' && tm.sw) ? tm.sw() : tm.reply(), 'b', extra);
      }, 240);
      return;
    }
    if (greeted && stripped) q = stripped;   // "hello, which fish has no bones" -> answer the fish

    var L = langOf(q);

    /* budget basket */
    var B = parseBudget(q);
    if (B && !findProduct(q)) {
      var bk = budgetBasket(B, L);
      if (!bk) {
        var cheapest = CAT.filter(function (p) { return p.unit === 'kg'; })
                          .sort(function (a, c) { return a.price - c.price; })[0];
        setTimeout(function () {
          say(L === 'sw'
            ? 'KES ' + B.toLocaleString() + ' haitoshi kilo moja, mwanangu. Rahisi kuliko wote ni '
              + (cheapest.sub || cheapest.title) + ' kwa ' + cheapest.price + ' kilo.\n\nNusu kilo inawezekana ukiuliza. Au weka akiba kidogo ufike ' + cheapest.price + '.'
            : 'KES ' + B.toLocaleString() + ' will not cover a kilo, mwanangu. The cheapest we have is '
              + (cheapest.sub || cheapest.title) + ' at ' + cheapest.price + ' the kilo.\n\nHalf a kilo we can discuss. Or wait until you have ' + cheapest.price + '.', 'b', '');
        }, 280);
        return;
      }
      if (bk) {
        setTimeout(function () {
          var head = L === 'sw'
            ? 'Kwa KES ' + B.toLocaleString() + ', hivi ndivyo ningechukua:'
            : 'For KES ' + B.toLocaleString() + ', this is what I would take:';
          var body = bk.rows.map(function (r) {
            return '· ' + r.line + ' — ' + r.kg + ' kg — KES ' + r.cost.toLocaleString();
          }).join('\n');
          var foot = (L === 'sw' ? '\n\nJumla: KES ' : '\n\nTotal: KES ') + bk.spent.toLocaleString()
            + (bk.left >= 100
                ? (L === 'sw' ? '. Zimebaki ' + Math.round(bk.left) + '.' : '. That leaves ' + Math.round(bk.left) + '.')
                : '.');
          var why = L === 'sw'
            ? '\n\nNimechanganya ili upate aina mbalimbali, si kitu kimoja kwa wingi.'
            : '\n\nI have mixed it so you get variety, not one thing in bulk.';
          say(head + '\n\n' + body + foot + why, 'b',
            '<button class="bs-wa bs-addall" type="button">'
            + (L === 'sw' ? 'Weka vyote kwenye kikapu →' : 'Add all to my basket →') + '</button>');
          var btn = log.querySelector('.bs-addall:last-of-type') ||
                    log.querySelectorAll('.bs-addall')[log.querySelectorAll('.bs-addall').length - 1];
          if (btn) btn.addEventListener('click', function () {
            bk.pick.forEach(function (it) { addToCart(it.p, it.kg); });
            btn.textContent = L === 'sw' ? 'Imewekwa ✓' : 'Added ✓';
            btn.disabled = true;
            say(L === 'sw' ? 'Nimeweka. Nenda kwenye kikapu ukimaliza.' : 'Done. Go to the basket when you are ready.',
              'b', '<a class="bs-wa" style="background:#07474C" href="' + BASE + 'catalogue.html#cart">'
              + (L === 'sw' ? 'Ona kikapu changu →' : 'See my basket →') + '</a>');
          });
        }, 300);
        return;
      }
    }

    /* cart adviser */
    if (CART_RE.test(q)) {
      setTimeout(function () {
        say(cartAdvice(L), 'b', '<a class="bs-wa" style="background:#07474C" href="' + BASE
          + 'catalogue.html#cart">' + (L === 'sw' ? 'Ona kikapu changu →' : 'See my basket →') + '</a>');
      }, 280);
      return;
    }

    /* the monsoon */
    if (SEASON_RE.test(q)) {
      setTimeout(function () { say(seasonAnswer(L), 'b', ''); }, 280);
      return;
    }

    /* substitution — what to take instead */
    if (SUB_RE.test(q)) {
      var sp = findProduct(q) || LAST;
      if (sp) {
        var sa = subAnswer(sp, q, L);
        if (sa) {
          setTimeout(function () { say(sa.text, 'b', sa.f.map(cardHTML).join('')); }, 300);
          return;
        }
      }
    }

    /* how to tell a fresh fish */
    if (FRESH_RE.test(q)) { setTimeout(function () { say(freshAnswer(L), 'b', ''); }, 280); return; }

    /* the cooking went wrong */
    if (TROUBLE_RE.test(q)) {
      var ta = troubleAnswer(q, L);
      if (ta) { setTimeout(function () { say(ta, 'b', ''); }, 300); return; }
    }

    /* nothing is wasted */
    if (WASTE_RE.test(q) && !NOT_WASTE.test(q)) { setTimeout(function () { say(wasteAnswer(L), 'b', ''); }, 280); return; }

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
    if (BOX_RE.test(q)) {
      loadBoxes().then(function () {
        var ba = boxAnswer(L);
        setTimeout(function () { reply(q, ba || match(q)); }, 160);
      });
      return;
    }

    var m = match(q);
    if (m) { setTimeout(function () { reply(q, m); }, 260); return; }
    loadDocs().then(function () {
      var d = matchDocs(q);
      if (d) { setTimeout(function () { reply(q, d); }, 120); return; }
      /* before giving up, read the rest of his own house */
      loadSections().then(function () {
        setTimeout(function () { reply(q, matchSection(q)); }, 120);
      });
    });
  }

  function paintChips() {
    chips.innerHTML = '';
    chipSet().forEach(function (c) {
      var el = document.createElement('button');
      el.type = 'button'; el.textContent = c;
      el.addEventListener('click', function () { answer(c); });
      chips.appendChild(el);
    });
  }
  paintChips();

  /* the EN / SW switch */
  var langBtn = panel.querySelector('#bsLang');
  langBtn.setAttribute('aria-label', LANG === 'sw' ? 'Switch to English' : 'Badilisha kwa Kiswahili');
  langBtn.addEventListener('click', function () {
    LANG = (LANG === 'sw') ? 'en' : 'sw';
    try { localStorage.setItem('mf_babu_lang', LANG); } catch (e) {}
    langBtn.textContent = (LANG === 'sw') ? 'EN' : 'SW';
    langBtn.setAttribute('aria-label', LANG === 'sw' ? 'Switch to English' : 'Badilisha kwa Kiswahili');
    input.placeholder = T(KIDS ? 'Ask about the sea…' : 'Ask about fish…',
                          KIDS ? 'Uliza kuhusu bahari…' : 'Uliza kuhusu samaki…');
    paintChips();
    GREET = greetText();
    say(T('English it is. Ask me anything.', 'Haya — tuzungumze Kiswahili. Niulize lolote.'), 'b');
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = input.value.trim();
    if (v) answer(v);
  });

  var opened = false;
  function open() {
    hideBtn.style.display = 'none';
    logQ('-', 'opened');
    panel.classList.add('open');
    requestAnimationFrame(function () { panel.classList.add('in'); });
    if (window.matchMedia('(max-width:760px)').matches) {
      PREV_OVERFLOW = document.body.style.overflow;
      document.body.style.overflow = 'hidden';        /* the page must not scroll under the sheet */
    }
    fab.style.display = 'none';
    if (tip) tip.remove(), tip = null;
    if (!opened) {
      opened = true;
      var ban = document.createElement('img');
      ban.className = 'bs-scene'; ban.alt = '';
      ban.src = BASE + 'images/babu-scene-2.svg';
      ban.width = 400; ban.height = 210;
      log.appendChild(ban);
      say(GREET, 'b');
    }
    setTimeout(function () { input.focus(); }, 80);
  }
  var PREV_OVERFLOW = '', closeT = null;
  function close() {
    panel.classList.remove('in');
    document.body.style.overflow = PREV_OVERFLOW;
    clearTimeout(closeT);
    closeT = setTimeout(function () { panel.classList.remove('open'); }, 220);
    if (!isOff()) { fab.style.display = ''; hideBtn.style.display = ''; }
  }

  var OFF = 'mf_babu_off';
  function isOff() { try { return sessionStorage.getItem(OFF) === '1'; } catch (e) { return false; } }
  function hideBabu() {
    fab.style.display = 'none';
    hideBtn.style.display = 'none';
    if (tip) { tip.remove(); tip = null; }
    logQ('-', 'dismissed');
    try { sessionStorage.setItem(OFF, '1'); } catch (e) {}
  }
  hideBtn.addEventListener('click', function (e) { e.stopPropagation(); hideBabu(); });
  if (isOff()) { fab.style.display = 'none'; hideBtn.style.display = 'none'; }

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
