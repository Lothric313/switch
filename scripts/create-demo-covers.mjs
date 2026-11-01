import fs from 'node:fs';
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720"><defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#70eaff"/><stop offset="1" stop-color="#2479ff"/></linearGradient><radialGradient id="bg"><stop stop-color="#122740"/><stop offset="1" stop-color="#080d16"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="35"/></filter></defs>${body}</svg>`;
const text = (x,y,s,size=14,fill='#8494ab',extra='') => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const rect = (x,y,w,h,fill,r=0,stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
let orbit = rect(0,0,960,720,'#08101c') + rect(26,26,908,668,'#0d1523',12,'#27374a');
orbit += text(64,79,'◉ ORBIT',24,'#fff','font-weight="bold"')+text(64,148,'Workspace',12)+text(64,199,'▦  Overview',14,'#8bd7ff')+text(64,244,'↗  Analytics')+text(64,289,'⇄  Transactions')+text(64,334,'◷  Activity')+text(64,615,'Your next orbit.',11);
orbit += '<path d="M242 27V693" stroke="#253044"/>'+text(279,78,'Overview',21,'#e6eefb')+text(279,121,'A clearer view of your money.',12)+rect(779,51,117,36,'#5bd1ff',8)+text(802,74,'+ Add funds',12,'#082035');
orbit += rect(279,155,362,151,'url(#blue)',10)+text(302,186,'Total balance',12,'#103e68')+text(302,246,'$48,562.00',40,'#0b2a4d','font-weight="bold"')+text(304,282,'↗ 12.8% this month',12,'#164571')+rect(659,155,237,151,'#162239',10)+text(681,186,'Savings goal',12)+text(681,241,'78.4%',34,'#eff6ff')+'<path d="M684 271H864" stroke="#2e3d58" stroke-width="7" stroke-linecap="round"/><path d="M684 271H824" stroke="#60cbff" stroke-width="7" stroke-linecap="round"/>';
orbit += rect(279,325,617,214,'#111e31',10)+text(302,361,'Cash flow',15,'#edf3fb')+text(796,360,'This month',11);
for(let i=0;i<10;i++) orbit += `<path d="M${306+i*55} 390V510" stroke="#1c2c43"/>`;
orbit += '<path d="M305 492 355 469 405 480 455 436 505 453 555 413 605 429 655 384 705 411 755 395 805 403 865 375" fill="none" stroke="#66d9ff" stroke-width="3" stroke-linejoin="round"/>';
orbit += rect(279,557,617,102,'#111e31',10)+text(302,591,'Recent activity',13,'#e5efff')+text(302,630,'↙  Payment received',13)+text(775,630,'+ $2,400.00',14,'#78dec8');
fs.writeFileSync('public/works/orbit.svg',wrap(orbit));

let mono=rect(0,0,960,720,'#e5e2dc')+text(46,61,'mono.',30,'#232724','font-weight="bold"')+text(537,57,'Projects',12,'#454b46')+text(637,57,'Approach',12,'#454b46')+text(760,57,'Studio',12,'#454b46')+text(860,57,'↗',22,'#454b46');
mono+=text(47,150,'Spaces for',66,'#262d28','letter-spacing="-3"')+text(47,221,'a slower life.',66,'#262d28','letter-spacing="-3"')+text(680,166,'Architecture that brings',13,'#6a7069')+text(680,189,'you back to what matters.',13,'#6a7069')+text(47,271,'SELECTED SPACES / 2026',10,'#777e74','letter-spacing="2"');
mono+=rect(46,303,868,359,'#bbc4bd')+'<path d="M46 600 914 400V662H46Z" fill="#8b9c8b"/><path d="M46 303H914V410L46 542Z" fill="#ced5cc"/>';
mono+='<path d="M180 480 581 361 824 403 422 540Z" fill="#d4cec1"/><path d="M180 480 422 540V644L180 585Z" fill="#c1b9a9"/><path d="M422 540 824 403V509L422 644Z" fill="#969084"/><path d="M237 496 370 529V609L237 574Z" fill="#45514b"/><path d="M456 549 774 444V500L456 606Z" fill="#3f4a44"/>';
for(let i=0;i<8;i++)mono+=`<path d="M${472+i*38} ${548-i*12.7}v56" stroke="#c8bca8" stroke-width="6"/>`;
mono+=text(63,636,'01 — THE STILL HOUSE',10,'#fff','letter-spacing="2"')+text(851,637,'↗',28,'#fff')+text(46,696,'Independent architecture &amp; interiors',10,'#71796f')+text(815,696,'EST. 2026',10,'#71796f');
fs.writeFileSync('public/works/mono.svg',wrap(mono));

let signal=rect(0,0,960,720,'#101014')+text(46,62,'SIGNAL®',24,'#f0ecff','font-weight="bold" letter-spacing="-1"')+text(637,58,'Artists',12,'#b2a8c9')+text(724,58,'Releases',12,'#b2a8c9')+text(833,58,'Listen ↗',12,'#b2a8c9');
signal+='<ellipse cx="590" cy="397" rx="262" ry="233" fill="#612bda" opacity=".23" filter="url(#blur)"/>';
for(let i=0;i<18;i++)signal+=`<ellipse cx="${586+i*2}" cy="${375-i*1.5}" rx="${60+i*9}" ry="${130+i*4}" fill="none" stroke="${i%2?'#7060f3':'#b294ff'}" stroke-width="${i%3===0?3:1}" opacity="${.2+i*.034}" transform="rotate(${i*5} 590 375)"/>`;
signal+=text(45,164,'INDEPENDENT SOUNDS. UNLIMITED FREQUENCIES.',9,'#a6a0bd','letter-spacing="2"')+text(43,319,'Beyond',114,'#f0edfa','letter-spacing="-6"')+text(43,427,'the noise.',114,'#f0edfa','letter-spacing="-6"')+text(48,508,'A new frequency for a new generation.',15,'#a39bb7')+rect(46,548,167,43,'#b5a0ff',24)+text(69,575,'Explore the sound  ↗',12,'#171022')+'<path d="M46 644H914" stroke="#383141"/>'+text(46,680,'LATEST RELEASE / VOL. 004',10,'#a79ebd','letter-spacing="1.4"')+text(794,680,'PLAY NOW  ▶',10,'#e4dcf4');
fs.writeFileSync('public/works/signal.svg',wrap(signal));

let native=rect(0,0,960,720,'#ebe8e0')+text(47,62,'NATIVE',25,'#29362e','letter-spacing="3"')+text(333,58,'Objects',12,'#596352')+text(430,58,'Our story',12,'#596352')+text(830,58,'Bag (0)',12,'#29362e');
native+=rect(35,96,890,558,'#b8c1ad')+text(69,175,'LESS, BUT BETTER.',9,'#4f5b46','letter-spacing="2"')+text(65,254,'Made for',76,'#2b392b','letter-spacing="-3"')+text(65,335,'the everyday.',76,'#2b392b','letter-spacing="-3"')+text(70,405,'Thoughtful objects. Natural materials.',14,'#536047')+text(70,430,'A little closer to the way you live.',14,'#536047');
native+='<ellipse cx="692" cy="555" rx="162" ry="27" fill="#7b866f" opacity=".5" filter="url(#blur)"/><path d="M630 326Q597 399 598 476Q592 570 692 579Q796 570 788 475Q785 398 753 326Z" fill="#d9d3c4"/><ellipse cx="692" cy="326" rx="62" ry="19" fill="#9c988b"/><ellipse cx="692" cy="325" rx="45" ry="10" fill="#5a6050"/><path d="M690 327Q648 218 702 148M697 291Q774 230 757 187M687 261Q622 228 627 196" fill="none" stroke="#5c6e48" stroke-width="5"/><path d="M702 148q-45-19-38 30q39 9 38-30M757 187q-42 3-30 39q38 0 30-39M627 196q-20 29 10 45q24-26-10-45" fill="#6f8057"/>';
native+=rect(69,480,158,43,'#2f402e',24)+text(91,507,'Discover objects  ↗',12,'#e9edde')+text(68,621,'01 / THE EARTH COLLECTION',9,'#56624b','letter-spacing="1.6"')+text(749,621,'CRAFTED TO LAST',9,'#56624b','letter-spacing="1.6"')+text(36,694,'Fewer things. More meaning.',11,'#7b806e')+text(785,694,'NATURALLY YOURS.',9,'#7b806e');
fs.writeFileSync('public/works/native.svg',wrap(native));
console.log('Created 4 lightweight SVG concept covers.');
