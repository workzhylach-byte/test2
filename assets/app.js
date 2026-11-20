window.IMG=window.IMG||{};
(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const G=window.gsap,ST=window.ScrollTrigger,FL=window.Flip,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const IM=window.IMG||{};
const PAGE=document.body.dataset.page||'home',isHome=PAGE==='home';
/* готовые внутренние страницы: data-page -> файл */
const PAGES={coaches:'trenery.html',team:'komanda.html','programs-kids':'programmy-detyam.html','programs-adults':'programmy-vzroslym.html',camps:'kempy.html','camp-summer':'kemp-viktory-summer-camp.html',corporate:'korporativy.html',birthdays:'dni-rozhdeniya.html',
 prices:'ceny.html','prices#cards':'ceny.html#cards',about:'o-klube.html','about-tour':'o-klube.html#tour',cafe:'kafe.html','tournaments-kids':'detskie-turniry.html','tournaments-adults':'vzroslye-turniry.html','tournament-open':'turnir-viktory-open.html',
 news:'novosti.html','news-events':'novosti.html?f=event','news-news':'novosti.html?f=news','news-articles':'novosti.html?f=article','news-open':'novost-otkrytie.html',contacts:'kontakty.html',schedule:'raspisanie.html',
 'home-programs':isHome?'#programs':'index.html#programs',events:'kempy.html','article-racket':'statya-kak-vybrat-raketku.html',policy:'politika.html',consent:'soglasie.html',rules:'pravila.html',offer:'oferta.html',requisites:'rekvizity.html',home:'index.html'};
const mapPages=(r=document)=>$$('a[data-page]',r).forEach(a=>{const u=PAGES[a.dataset.page];if(u){a.setAttribute('href',u);delete a.dataset.f}});mapPages();
if(!isHome)$$('a[href^="#"]').forEach(a=>{const h=a.getAttribute('href');if(h.length>1&&!document.querySelector(h))a.setAttribute('href','index.html'+(a.dataset.f?'?f='+a.dataset.f:'')+h)});
{const GR=[/^programs/,/^coaches$/,/^prices$/,/^(about|team|cafe)$/,/^(camp|corporate|birthdays|tournament)/,/^news/,/^contacts$/];
 $$('.nav a.n').forEach((a,k)=>{if(GR[k]&&GR[k].test(PAGE))a.classList.add('is-cur')})}
/* фильтр направлений из ссылки index.html#programs?f=kids */
const hf=new URLSearchParams(location.search).get('f');
$$('img[data-img]').forEach(i=>{const k=i.dataset.img;i.src=IM[k]||('img/'+k+(k==='logo_mark'?'.svg':'.jpg'));i.decoding='async'});
if(G&&ST){G.registerPlugin(ST);FL&&G.registerPlugin(FL)}

/* toast */
let tt;function toast(m){const t=$('#toast');$('span',t).textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)}
document.addEventListener('click',e=>{const a=e.target.closest('[data-toast]');if(a){e.preventDefault();toast(a.dataset.toast)}});
/* data-page: адрес внутренней страницы; пока страниц нет — якорь на главной или подсказка */
document.addEventListener('click',e=>{const a=e.target.closest('a[data-page][href="#"]');if(a){e.preventDefault();toast('Откроется страница «'+(a.textContent.trim().replace(/\s+/g,' '))+'» — следующий этап')}});

/* lenis */
let lenis=null;
if(window.Lenis&&!RM){lenis=new Lenis({duration:1.15,smoothWheel:true});if(G){lenis.on('scroll',ST.update);G.ticker.add(t=>lenis.raf(t*1000));G.ticker.lagSmoothing(0)}else{const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r)}}
const goTo=t=>{const el=typeof t==='string'?$(t):t;if(!el)return;lenis?lenis.scrollTo(el,{offset:-60}):el.scrollIntoView({behavior:'smooth'})};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||a.dataset.modal||a.dataset.toast)return;const h=a.getAttribute('href');if(h.length<2)return e.preventDefault();e.preventDefault();closeMM();if(a.dataset.f)setFilter(a.dataset.f);goTo(h)});

/* header */
const top=$('#top');let ly=0,mmOpen=false;
const onS=()=>{const y=scrollY;top.classList.toggle('solid',y>innerHeight*.75);top.classList.toggle('hide',y>ly&&y>innerHeight&&!mmOpen);ly=y};
addEventListener('scroll',onS,{passive:true});onS();
const club=$('#club');$('button',club).addEventListener('click',e=>{club.classList.toggle('open');$('button',club).setAttribute('aria-expanded',club.classList.contains('open'))});
document.addEventListener('click',e=>{if(!e.target.closest('#club'))club.classList.remove('open')});

/* mobile menu */
const mm=$('#mm');
function closeMM(){mmOpen=false;mm.classList.remove('on');top.classList.remove('mmo');$('#burger').setAttribute('aria-label','Меню');lenis&&lenis.start()}
$('#burger').addEventListener('click',()=>{mmOpen=!mmOpen;mm.classList.toggle('on',mmOpen);top.classList.toggle('mmo',mmOpen);$('#burger').setAttribute('aria-label',mmOpen?'Закрыть меню':'Меню');if(mmOpen){top.classList.remove('hide');lenis&&lenis.stop();G&&G.from('#mm nav a',{y:40,opacity:0,stagger:.05,duration:.8,ease:'expo.out',delay:.15})}else lenis&&lenis.start()});

/* cursor */
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.documentElement.classList.add('has-cur');const c=$('.cur'),b=$('.cur__b'),tx=$('.cur__t');let x=innerWidth/2,y=innerHeight/2,bx=x,by=y;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;const v=e.target.closest('[data-lb],.rail');c.classList.toggle('view',!!v);c.classList.toggle('hov',!!e.target.closest('a,button,label'));c.classList.toggle('nob',!!e.target.closest('.fx__soc'))},{passive:true});
  (function f(){bx+=(x-bx)*.22;by+=(y-by)*.22;b.style.transform=`translate(${bx}px,${by}px)`;tx.style.left=bx+'px';tx.style.top=by+'px';requestAnimationFrame(f)})()}

/* hero slideshow */
if($('#heroS')){const figs=$$('#heroS figure'),tabs=$$('#heroT button'),lab=$('#heroL');let i=0,tm;
 const show=n=>{figs[i].classList.remove('on');tabs.forEach((t,k)=>{t.classList.remove('on');t.classList.toggle('done',k<n)});i=n;figs[i].classList.add('on');void tabs[i].offsetWidth;tabs[i].classList.add('on');lab.textContent=String(i+1).padStart(2,'0')+' / 04 · '+figs[i].dataset.l;clearTimeout(tm);tm=setTimeout(()=>show((i+1)%figs.length),6000)};
 tabs.forEach((t,k)=>t.addEventListener('click',()=>show(k)));tm=setTimeout(()=>show(1),6000)}

/* modal */
const md=$('#md'),mdB=$('#mdB');
function openMd(type){const t=$('#t-'+type);if(!t)return;md.classList.remove('wide');mdB.innerHTML='';mdB.appendChild(t.content.cloneNode(true));mapPages(mdB);
  const d=$('.yc__d',mdB);if(d){const wd=['вс','пн','вт','ср','чт','пт','сб'],n=new Date();for(let k=0;k<6;k++){const x=new Date(n);x.setDate(n.getDate()+k);d.insertAdjacentHTML('beforeend',`<span class="${k?'':'on'}">${wd[x.getDay()]}<b>${x.getDate()}</b></span>`)}}
  bindReq(mdB);const go=$('[data-go]',mdB);go&&go.addEventListener('click',()=>{toast('Здесь откроется виджет YCLIENTS');closeMd()});
  campForm(mdB);const f=$('form',mdB);f&&bindForm(f,()=>f.dataset.thanks?(location.href='spasibo.html?t='+f.dataset.thanks):okMd(f.dataset.okh||'Спасибо! Ваша заявка принята.',f.dataset.okp||'Наш менеджер свяжется с вами в течение 2 часов для подтверждения.'));
  md.classList.add('on');md.setAttribute('aria-hidden','false');lenis&&lenis.stop()}
function okMd(h,p){mdB.innerHTML=`<div class="ok"><div class="ball"></div><h3>${h}</h3><p class="desc">${p}</p><button class="bt" data-x>Закрыть</button></div>`;G&&G.from('.ok .ball',{scale:0,y:-80,duration:1.1,ease:'bounce.out'})}
function closeMd(){md.classList.remove('on');md.setAttribute('aria-hidden','true');!mmOpen&&lenis&&lenis.start()}
function bindReq(root){const r=$$('[data-req]',root),s=$('[type=submit],[data-go]',root);const c=()=>{if(s)s.disabled=!r.every(x=>x.checked)};r.forEach(x=>x.addEventListener('change',c))}
function bindForm(f,ok){f.addEventListener('submit',e=>{e.preventDefault();const bad=$$('input[required],select[required]',f).find(i=>!(i.value||'').trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value)));$$('input,select',f).forEach(i=>i.classList.remove('err'));if(bad){bad.classList.add('err');bad.focus();return}ok()})}
document.addEventListener('click',e=>{const o=e.target.closest('[data-modal]');if(o){e.preventDefault();closeMM();openMd(o.dataset.modal)}if(e.target.closest('[data-x]'))closeMd()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeMd();closeLb();closeMM()}});
if($('#askF')){const f=$('#askF');bindReq(f);bindForm(f,()=>{f.innerHTML='<h3>Спасибо за обращение!</h3><p>Мы ответим вам в течение 2 часов в рабочее время.</p>'})}

/* programs filter */
const pcs=$$('#pgr .pc'),fb=$$('#flt button');
function setFilter(f){fb.forEach(b=>b.classList.toggle('on',b.dataset.f===f));const st=FL&&!RM&&innerWidth>620?FL.getState(pcs):null;
  pcs.forEach(p=>p.classList.toggle('hid',!(f==='all'||p.dataset.cat.split(' ').includes(f))));setTimeout(()=>ST&&ST.refresh(),st?850:50);
  if(st)FL.from(st,{duration:.8,ease:'expo.inOut',absolute:true,scale:true,onEnter:el=>G.fromTo(el,{opacity:0,scale:.9},{opacity:1,scale:1,duration:.6,delay:.2}),onLeave:el=>G.to(el,{opacity:0,scale:.9,duration:.4})})}
fb.forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.f)));
if($('#pgr')){const g=$('#pgr'),n=$('#pgN'),bar=$('#pgB');const vis=()=>pcs.filter(p=>!p.classList.contains('hid'));
 const upd=()=>{const v=vis(),max=g.scrollWidth-g.clientWidth;let i=0;if(max>0)i=Math.round(g.scrollLeft/max*(v.length-1));n.textContent=String(i+1).padStart(2,'0')+' / '+String(v.length).padStart(2,'0');const w=100/v.length;bar.style.width=w+'%';bar.style.left=(i*w)+'%';g.__i=i};
 const to=d=>{const v=vis();const i=Math.max(0,Math.min(v.length-1,(g.__i||0)+d));g.scrollTo({left:v[i].offsetLeft-v[0].offsetLeft,behavior:'smooth'})};
 g.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);$('#pgP').onclick=()=>to(-1);$('#pgX').onclick=()=>to(1);fb.forEach(b=>b.addEventListener('click',()=>{g.scrollLeft=0;setTimeout(upd,900)}));upd()}

/* courts plan switch */
{const tb=$$('.ct__tabs button'),T=$('#planT'),P=$('#planP');
 const draw=svg=>{if(!G||RM)return;$$('.cl,.net,.wall',svg).forEach(l=>{const len=l.getTotalLength?l.getTotalLength():600;G.fromTo(l,{strokeDasharray:len,strokeDashoffset:len},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut',delay:Math.random()*.3})})};
 tb.forEach(b=>b.addEventListener('click',()=>{tb.forEach(x=>x.classList.toggle('on',x===b));const p=b.dataset.m==='p';T.style.display=p?'none':'';P.style.display=p?'':'none';$('#planL').textContent=p?'Панорамное остекление':'Hard Pro · ITF';draw(p?P:T)}));
 window.__drawPlan=()=>draw(T)}

/* advantages accordion */
{const it=$$('#acc .acc__i'),im=$$('#adImg img');it.forEach((x,k)=>$('.acc__h',x).addEventListener('click',()=>{const was=x.classList.contains('on');it.forEach(y=>y.classList.remove('on'));if(!was)x.classList.add('on');im.forEach((m,j)=>m.classList.toggle('on',j===(was?0:k)))}))}

/* gallery rail */
if($('#rail')){const r=$('#rail'),fig=$$('figure',r),bar=$('#glBar'),n=$('#glN');let down=false,sx=0,sl=0,moved=false;
 const upd=()=>{const max=r.scrollWidth-r.clientWidth;const p=max?r.scrollLeft/max:0;bar.style.width=(r.clientWidth/r.scrollWidth*100)+'%';bar.style.left=(p*(100-r.clientWidth/r.scrollWidth*100))+'%';let idx=0;fig.forEach((f,k)=>{if(f.offsetLeft-r.offsetLeft<=r.scrollLeft+40)idx=k});n.textContent=String(idx+1).padStart(2,'0')+' / '+String(fig.length).padStart(2,'0')};
 r.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
 r.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=r.scrollLeft;r.classList.add('drag')});
 addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;r.scrollLeft=sl-dx});
 addEventListener('pointerup',()=>{if(!down)return;down=false;r.classList.remove('drag')});
 r.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 const step=d=>{const w=fig[0].offsetWidth+20;r.scrollBy({left:d*w,behavior:'smooth'})};$('#glP').onclick=()=>step(-1);$('#glX').onclick=()=>step(1);
 /* lightbox */
 const lb=$('#lb'),li=$('img',lb),lc=$('.lb__c',lb);let cur=0;const src=fig.map(f=>[$('img',f).src,$('figcaption span',f).textContent]);
 const show=k=>{cur=(k+src.length)%src.length;li.src=src[cur][0];lc.textContent=String(cur+1).padStart(2,'0')+' / '+String(src.length).padStart(2,'0')+' · '+src[cur][1];G&&G.fromTo(li,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.5,ease:'expo.out'})};
 fig.forEach((f,k)=>f.addEventListener('click',()=>{show(k);lb.classList.add('on');lenis&&lenis.stop()}));
 window.closeLb=()=>{lb.classList.remove('on');lenis&&lenis.start()};$('.lb__x',lb).onclick=closeLb;$('.lb__p',lb).onclick=()=>show(cur-1);$('.lb__n',lb).onclick=()=>show(cur+1);
 lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
 addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
 let tsx=null;lb.addEventListener('touchstart',e=>tsx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{if(tsx===null)return;const d=e.changedTouches[0].clientX-tsx;if(Math.abs(d)>50)show(cur+(d<0?1:-1));tsx=null})}
function closeLb(){window.closeLb&&window.closeLb()}

$('#fxUp').addEventListener('click',()=>lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'}));
if(isHome&&hf){setFilter(hf);setTimeout(()=>goTo('#programs'),300)}
/* заявка на кэмп: взрослый кэмп — без полей родителя */
function campForm(root,v){const s=$('[data-camp-sel]',root);if(!s)return;if(v)s.value=v;const u=()=>{const ad=s.value==='winter';$$('[data-kid-only]',root).forEach(l=>{l.hidden=ad;$$('input',l).forEach(i=>i.required=!ad)});$$('[data-l-kid]',root).forEach(e=>e.textContent=ad?e.dataset.lAdult:e.dataset.lKid)};s.addEventListener('change',u);u()}
$$('form[data-camp-form]').forEach(f=>campForm(f));
document.addEventListener('click',e=>{const o=e.target.closest('[data-modal][data-camp]');if(!o)return;setTimeout(()=>campForm(mdB,o.dataset.camp),0)});
/* форматы корпоратива: вкладки */
if($('.fmt__t')){const tb=$$('.fmt__t button'),ps=$$('.fp');tb.forEach((b,k)=>b.addEventListener('click',()=>{tb.forEach((x,j)=>{x.classList.toggle('on',j===k);x.setAttribute('aria-selected',j===k)});ps.forEach((p,j)=>p.classList.toggle('on',j===k));const f=$('#corpFmt');if(f){f.selectedIndex=k+1;f.dispatchEvent(new Event('change'))}if(innerWidth<=1000)b.parentElement.scrollTo({left:b.offsetLeft-20,behavior:'smooth'})}))}
/* корпоратив: кнопки форматов и вместимость */
if($('#corpFmt')){const f=$('#corpFmt'),cap=$('#corpCap');const u=()=>{const o=f.options[f.selectedIndex];if(cap)cap.textContent=o&&o.dataset.cap?(f.dataset.capl||'Заявленная вместимость формата: ')+o.dataset.cap:(cap&&cap.dataset.def)||'Выберите формат, чтобы посмотреть заявленную вместимость.'};f.addEventListener('change',u);
 $$('[data-fmt]').forEach(b=>b.addEventListener('click',()=>{f.selectedIndex=+b.dataset.fmt+1;u();goTo('#apply')}))}
/* кэмпы: предстоящие / архив */
if($('.ctab')){const bs=$$('.ctab button');bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});$$('[data-cp]').forEach(p=>p.hidden=p.dataset.cp!==b.dataset.ct);ST&&ST.refresh()}))}
/* направление в заявке в группу */
document.addEventListener('click',e=>{const o=e.target.closest('[data-modal][data-dir]');if(!o)return;setTimeout(()=>{const s=$('select[name=dir]',mdB);if(s)s.value=o.dataset.dir},0)});
/* формы прямо на странице */
$$('form[data-inline]').forEach(f=>{bindReq(f);bindForm(f,()=>{if(f.dataset.thanks){location.href='spasibo.html?t='+f.dataset.thanks;return}f.innerHTML='<div class="ok"><div class="ball"></div><h3>'+f.dataset.okh+'</h3><p class="desc">'+f.dataset.okp+'</p></div>';G&&G.from($('.ok .ball',f),{scale:0,y:-60,duration:1,ease:'bounce.out'})})});
/* раскрывающиеся блоки: плавно, без скачка страницы */
let rT;const stRefresh=()=>{clearTimeout(rT);rT=setTimeout(()=>{ST&&ST.refresh();lenis&&lenis.resize&&lenis.resize()},60)};
$$('.pd__ds').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const d=b.closest('.pd__d'),o=!d.classList.contains('open');d.classList.toggle('open',o);b.setAttribute('aria-expanded',o);const c=$('.pd__dc',d);c.addEventListener('transitionend',stRefresh,{once:true})}));
/* подсветка направления в липком меню */
if($('.psub')){const ls=$$('.psub__l a'),secs=ls.map(a=>$(a.getAttribute('href')));const on=()=>{let k=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)k=i});ls.forEach((a,i)=>a.classList.toggle('on',i===k));const a=ls[k];if(a){const l=a.parentElement;const x=a.offsetLeft-l.clientWidth/2+a.clientWidth/2;if(Math.abs(l.scrollLeft-x)>40)l.scrollTo({left:x,behavior:'smooth'})}};addEventListener('scroll',on,{passive:true});on()}
/* профиль тренера в боковой панели */
document.addEventListener('click',e=>{const b=e.target.closest('[data-prof]');if(!b)return;e.preventDefault();const t=b.closest('.cc').querySelector('template.prof');if(!t)return;
  mdB.innerHTML='';mdB.appendChild(t.content.cloneNode(true));md.classList.add('on','wide');md.setAttribute('aria-hidden','false');lenis&&lenis.stop();
  $$('img[data-img]',mdB).forEach(i=>{const k=i.dataset.img;i.src=IM[k]||('img/'+k+'.jpg')});G&&G.from('.pf>*',{y:24,opacity:0,duration:.8,ease:'expo.out',stagger:.05,delay:.2})});
/* фильтр тренеров: без Flip, с пересчётом ScrollTrigger после смены высоты */
if($('#cgr')){const cs=$$('#cgr .cc'),cb=$$('#cflt button');let first=true;
  cb.forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('on'))return;cb.forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
    const ok=c=>f==='all'||c.dataset.cat.split(' ').includes(f);
    if(first){first=false;(window.__ccT||[]).forEach(t=>{t.scrollTrigger&&t.scrollTrigger.kill();t.kill()});$$('#cgr .cr__m,.ldc__m').forEach(m=>m.style.clipPath='none')}
    const swap=()=>{cs.forEach(c=>c.classList.toggle('hid',!ok(c)));ST&&ST.refresh();
      const v=cs.filter(c=>!c.classList.contains('hid'));if(G&&!RM)G.fromTo(v,{opacity:0,y:24},{opacity:1,y:0,duration:.55,ease:'expo.out',stagger:.06,clearProps:'opacity,transform'})};
    if(G&&!RM){G.killTweensOf(cs);G.to(cs.filter(c=>!c.classList.contains('hid')),{opacity:0,y:-10,duration:.2,ease:'power1.in',onComplete:swap})}else swap()}))}
















































/* ===== v3: остальные страницы ===== */
/* вопросы-ответы: плавное раскрытие */
$$('.faq__q').forEach(q=>q.addEventListener('click',()=>{const i=q.closest('.faq__i'),o=!i.classList.contains('open');i.classList.toggle('open',o);q.setAttribute('aria-expanded',o);$('.faq__a',i).addEventListener('transitionend',stRefresh,{once:true})}));
/* фильтры карточек: новости, турниры */
$$('[data-flt]').forEach(box=>{const bs=$$('button[data-f]',box),items=$$(box.dataset.flt),cnt=$(box.dataset.cnt||'#none');
  const set=f=>{bs.forEach(b=>{const on=b.dataset.f===f;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});let n=0;items.forEach(c=>{const ok=f==='all'||c.dataset.t.split(' ').includes(f);c.classList.toggle('hid',!ok);if(ok)n++});if(cnt)cnt.textContent=n;
    const v=items.filter(c=>!c.classList.contains('hid'));if(G&&!RM)G.fromTo(v,{opacity:0,y:24},{opacity:1,y:0,duration:.55,ease:'expo.out',stagger:.06,clearProps:'opacity,transform'});stRefresh()};
  bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.f)));
  const q=new URLSearchParams(location.search).get('f');if(q&&bs.some(b=>b.dataset.f===q))set(q)});
/* карта: загружается только по клику */
$$('[data-map]').forEach(b=>b.addEventListener('click',()=>{const m=b.closest('.map2');if(!m||$('iframe',m))return;const f=document.createElement('iframe');f.src='https://yandex.ru/map-widget/v1/?ll=37.392499%2C55.834896&z=16&pt=37.392499,55.834896,pm2gnm';f.title='Клуб на карте';f.loading='lazy';f.allowFullscreen=true;m.appendChild(f)}));
/* меню кафе: подсветка раздела */
if($('.mnu__nav')){const ls=$$('.mnu__nav a'),ss=ls.map(a=>$(a.getAttribute('href')));const on=()=>{let k=0;ss.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.45)k=i});ls.forEach((a,i)=>a.classList.toggle('on',i===k));const a=ls[k],n=a.parentElement;if(n.scrollWidth>n.clientWidth)n.scrollTo({left:a.offsetLeft-n.clientWidth/2+a.clientWidth/2,behavior:'smooth'})};addEventListener('scroll',on,{passive:true});on()}
/* документы: текущий пункт */
$$('.doc__nav a').forEach(a=>{if(a.dataset.page===PAGE)a.classList.add('on')});
/* страница «Спасибо» */
if(PAGE==='thanks'){const T={
  camp:['Спасибо!','Ваша заявка на кэмп принята','Менеджер свяжется с вами в течение 24 часов для подтверждения бронирования','Вернуться к кэмпам','kempy.html'],
  corp:['Спасибо!','Мы получили заявку на корпоратив','Менеджер свяжется с вами в течение 4 часов для обсуждения деталей.','Вернуться назад','korporativy.html'],
  bday:['Спасибо!','Мы получили заявку на день рождения','Менеджер свяжется с вами в течение 4 часов для обсуждения деталей.','Вернуться назад','dni-rozhdeniya.html'],
  contact:['Спасибо','за обращение!','Мы ответим вам в течение 2 часов в рабочее время','Вернуться назад','kontakty.html']};
 const t=T[new URLSearchParams(location.search).get('t')]||T.contact;$('#thxH').innerHTML='<span>'+t[0]+'</span> <span class="o">'+t[1]+'</span>';$('#thxP').textContent=t[2];const b=$('#thxB');b.firstChild.textContent=t[3]+' ';b.href=t[4];
 if(document.referrer&&new URL(document.referrer).origin===location.origin&&!/spasibo/.test(document.referrer))b.href=document.referrer}
/* просмотр фото: тур по клубу и галереи в карточках */
const GAL=(()=>{const lb=$('#lb');if(!lb||!$('.tour__i,.rsc'))return null;const li=$('img',lb),lc=$('.lb__c',lb);let list=[],k=0;
 const show=n=>{k=(n+list.length)%list.length;li.src=list[k][0];lc.textContent=String(k+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0')+(list[k][1]?' · '+list[k][1]:'');G&&G.fromTo(li,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.5,ease:'expo.out'})};
 const close=()=>{lb.classList.remove('on');lenis&&lenis.start()};window.closeLb=close;
 $('.lb__x',lb).onclick=close;$('.lb__p',lb).onclick=()=>show(k-1);$('.lb__n',lb).onclick=()=>show(k+1);lb.addEventListener('click',e=>{if(e.target===lb)close()});
 addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='ArrowRight')show(k+1);if(e.key==='ArrowLeft')show(k-1)});
 let tsx=null;lb.addEventListener('touchstart',e=>tsx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{if(tsx===null)return;const d=e.changedTouches[0].clientX-tsx;if(Math.abs(d)>50)show(k+(d<0?1:-1));tsx=null});
 return {open:(items,n=0)=>{list=items;show(n);lb.classList.add('on');lenis&&lenis.stop()}}})();
if(GAL&&$('.tour__i')){const it=$$('.tour__i');const items=()=>it.map(t=>[$('img',t).src,$('.tour__t b',t).textContent]);
 it.forEach((t,n)=>{t.setAttribute('tabindex','0');t.setAttribute('role','button');const o=()=>GAL.open(items(),n);t.addEventListener('click',o);t.addEventListener('keydown',e=>{if(e.key==='Enter')o()})})}
if(GAL)$$('.rsc').forEach(r=>{const figs=$$('.rsc__ph figure',r);const cap=($('h3',r)||{}).textContent||'';const items=()=>figs.map(f=>[$('img',f).src,cap]);
 figs.forEach((f,n)=>{f.setAttribute('tabindex','0');f.setAttribute('role','button');f.setAttribute('aria-label','Открыть фото');f.setAttribute('data-lb','');f.addEventListener('click',()=>GAL.open(items(),n));f.addEventListener('keydown',e=>{if(e.key==='Enter')GAL.open(items(),n)})});
 const b=$('.btns .bt',r);if(b){b.removeAttribute('data-toast');b.addEventListener('click',e=>{e.preventDefault();GAL.open(items(),0)})}});
/* анимации новых страниц */
if(G&&ST&&!RM){
 if($('.phs')){G.from('.phs .bc,.phs .kicker,.phs .lead,.phs__m,.phs .ph__ctas',{y:26,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,delay:.45});
  $$('.phs__court rect,.phs__court line').forEach((l,i)=>{const n=l.getTotalLength?l.getTotalLength():800;G.fromTo(l,{strokeDasharray:n,strokeDashoffset:n},{strokeDashoffset:0,duration:2,ease:'power2.inOut',delay:.3+i*.05,onComplete:()=>{l.style.strokeDasharray=l.classList.contains('nt')?'3 5':'none'}})})}
 $$('[data-rv]').forEach(g=>[...g.children].forEach((el,k)=>{el.style.transition='none';G.from(el,{y:50,opacity:0,duration:1.05,ease:'expo.out',delay:(k%4)*.08,scrollTrigger:{trigger:el,start:'top 94%',once:true},onComplete:()=>{el.style.transition=''}})}));
 $$('[data-clip]').forEach(m=>G.fromTo(m,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:m,start:'top 88%'}}));
 $$('[data-par] img').forEach(im=>G.fromTo(im,{yPercent:-5,scale:1.1},{yPercent:5,scale:1.1,ease:'none',scrollTrigger:{trigger:im.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
 $$('.ptb__r').forEach(r=>G.from(r,{x:-40,opacity:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:r,start:'top 92%'}}));
 $$('.cat__c svg').forEach(s=>{$$('rect.o,line',s).forEach(l=>{const n=l.getTotalLength?l.getTotalLength():400;G.fromTo(l,{strokeDasharray:n,strokeDashoffset:n},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut',scrollTrigger:{trigger:s,start:'top 88%'},onComplete:()=>l.style.strokeDasharray='none'})})});
 if(!PAGE.startsWith('camp'))$$('.bp').forEach(p=>G.from(p,{y:80,rotate:1.5,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 88%'}}));
 if($('.thx__ball')){G.from('.thx__ball',{y:-260,duration:1.5,ease:'bounce.out',delay:.2});G.from('.thx__sh',{scaleX:.3,opacity:0,duration:1.5,ease:'bounce.out',delay:.2});G.from('.thx h1>span,.thx p,.thx .btns',{y:30,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,delay:.6})}
 $$('[data-cnt-up]').forEach(b=>{const n=+b.dataset.cntUp,o={v:0},sfx=b.dataset.sfx||'';ST.create({trigger:b,start:'top 90%',once:true,onEnter:()=>G.to(o,{v:n,duration:1.8,ease:'power3.out',onUpdate:()=>b.firstChild.textContent=Math.round(o.v)+sfx})})});
}
/* расписание: даты в превью виджета и галочка правил */
if($('#ycD')){const d=$('#ycD'),wd=['вс','пн','вт','ср','чт','пт','сб'],n=new Date();for(let k=0;k<7;k++){const x=new Date(n);x.setDate(n.getDate()+k);d.insertAdjacentHTML('beforeend',`<span class="${k?'':'on'}">${wd[x.getDay()]}<b>${x.getDate()}</b></span>`)}bindReq($('.ycw__w'))}
/* главная: кэмпы — фото раскрывается из окна на весь экран, текст выезжает */
if($('.cpx')&&G&&ST&&!RM){const mm=G.matchMedia();
 mm.add('(min-width:901px)',()=>{const tl=G.timeline({scrollTrigger:{trigger:'.cpx',start:'top top',end:'bottom bottom',scrub:.8}});
  const pv=$('.cpx').previousElementSibling;let bg=pv?getComputedStyle(pv).backgroundColor:'';if(!bg||bg==='rgba(0, 0, 0, 0)')bg=getComputedStyle(document.body).backgroundColor;$('.cpx').style.background=bg;
  tl.fromTo('.cpx__st',{backgroundColor:bg},{backgroundColor:'#0D0E0C',ease:'power1.in',duration:.9},0);
  tl.fromTo('.cpx__win',{clipPath:'inset(14% 22% 14% 22% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'power2.inOut',duration:1},0)
    .fromTo('.cpx__bg',{scale:1.35,yPercent:-3},{scale:1.02,yPercent:3,ease:'none',duration:1.6},0)
    .fromTo('.cpx__sh',{opacity:.15},{opacity:1,ease:'none',duration:.8},.3)
    .fromTo('.cpx__path',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',ease:'none',duration:1.2},.4)
    .fromTo('.cpx__c .kicker',{y:30,opacity:0},{y:0,opacity:1,duration:.3},.7)
    .fromTo('.cpx__t .ln>span',{yPercent:110},{yPercent:0,duration:.45,stagger:.12,ease:'power3.out'},.75)
    .fromTo('.cpx__r>*',{y:50,opacity:0},{y:0,opacity:1,duration:.4,stagger:.1,ease:'power3.out'},1)
    .fromTo('.cpx__tk',{yPercent:100},{yPercent:0,duration:.4,ease:'power3.out'},1.1)
    .to({},{duration:.4});
  return()=>tl.kill()});
 mm.add('(max-width:900px)',()=>{const a=G.fromTo('.cpx__bg',{scale:1.25},{scale:1.02,ease:'none',scrollTrigger:{trigger:'.cpx',start:'top bottom',end:'bottom top',scrub:true}});
  const b=G.timeline({scrollTrigger:{trigger:'.cpx__c',start:'top 75%'}});b.from('.cpx__c .kicker',{y:24,opacity:0,duration:.8,ease:'expo.out'}).from('.cpx__t .ln>span',{yPercent:110,duration:1.1,ease:'expo.out',stagger:.1},'-=.5').from('.cpx__r>*',{y:30,opacity:0,duration:.9,ease:'expo.out',stagger:.08},'-=.7');
  return()=>{a.kill();b.kill()}})}
/* программы: вступление — подсветка и лестница уровней */
if($('.pin__t')){const t=$('.pin__t');if(G&&ST&&!RM){ST.create({trigger:t,start:'top 80%',once:true,onEnter:()=>t.classList.add('in')});
 G.from('.pin__s>*',{y:40,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.pin',start:'top 80%'}});
 G.from('.pin__lad',{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.pin__lad',start:'top 85%'}});
 G.from('.pin__bars div',{scaleY:0,duration:1.2,ease:'expo.out',stagger:.12,delay:.2,scrollTrigger:{trigger:'.pin__lad',start:'top 85%'}});
 G.from('.pin__bars b,.pin__bars small',{y:20,opacity:0,duration:.8,ease:'expo.out',stagger:.06,delay:.6,scrollTrigger:{trigger:'.pin__lad',start:'top 85%'}})}else t.classList.add('in')}
/* клубные карты: лёгкий наклон за курсором */
$$('[data-tilt]').forEach(c=>{if(!matchMedia('(hover:hover)').matches)return;c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--ry',(x*14)+'deg');c.style.setProperty('--rx',(-y*12)+'deg')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--ry','0deg');c.style.setProperty('--rx','0deg')})});
/* контакты: как добраться — вкладки и метки на фото */
if($('.rt2')){const bs=$$('.rt2__t button'),ps=$$('.rt2__pn'),pins=$$('.rt2__pin');const set=r=>{bs.forEach(b=>{const on=b.dataset.r===r;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});ps.forEach(p=>p.classList.toggle('on',p.dataset.r===r));pins.forEach(p=>p.classList.toggle('on',p.dataset.for===r||(r==='bus'&&p.dataset.for==='door')))};
 bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.r)));set('car')}
/* заголовки: длинное слово не рвём — уменьшаем шрифт, пока слово не влезет */
{const SEL='h1,h2,h3,.h1,.h2,.pv__t,.fp h3,.bp__t,.cpx__t,.tc__b h3,.sb h3,.rsc h3,.ifc__b h3,.cmf__i h3,.gl__l h3,.cnd b,.stp__l h3,.thx h1,.sr h3,.cat h3,.rt2__pn h3,.cpr__t,.pin__c b,.tl__s b,.pgc__c li,.who__t,.art h2,.sc__b h3,.ask2__l h2,.pr2__v,.fx__h,.ncd h3,.mnu__s h3,.ofp__t';
 const fit=()=>{$$(SEL).forEach(el=>{el.style.fontSize='';const w=el.clientWidth;if(!w)return;const words=(el.innerText||el.textContent||'').split(/\s+/).filter(Boolean);if(!words.length)return;
   const m=document.createElement('span');m.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0;padding:0;margin:0';el.appendChild(m);let mx=0;
   words.forEach(t=>{m.textContent=t;mx=Math.max(mx,m.getBoundingClientRect().width)});m.remove();
   if(mx>w){const fs=parseFloat(getComputedStyle(el).fontSize);el.style.fontSize=Math.floor(fs*w/mx*0.97)+'px'}})};
 fit();document.fonts&&document.fonts.ready.then(()=>{fit();ST&&ST.refresh()});let ft;addEventListener('resize',()=>{clearTimeout(ft);ft=setTimeout(fit,150)})}
/* соседние блоки одного цвета: убираем двойной отступ */
{const ss=$$('main>section');for(let i=1;i<ss.length;i++){const a=ss[i-1],b=ss[i];if(!a.classList.contains('sec')||!b.classList.contains('sec'))continue;const BG=getComputedStyle(document.body).backgroundColor,bgc=e=>{const c=getComputedStyle(e).backgroundColor;return c==='rgba(0, 0, 0, 0)'?BG:c};const ca=bgc(a),cb=bgc(b);
 const L=c=>{const m=c.match(/\d+/g);return m?(+m[0]+ +m[1]+ +m[2])/765:0};if(ca===cb){a.style.paddingBottom='clamp(48px,5.5vw,90px)';b.style.paddingTop='clamp(24px,3vw,48px)'}else if(L(ca)>.85&&L(cb)>.85){a.style.paddingBottom='clamp(56px,6vw,96px)';b.style.paddingTop='clamp(56px,6vw,96px)'}}}
/* главная: фильтр направлений — высота блока не прыгает */
if($('#pgr')&&$$('#flt button').length){const g=$('#pgr');const lock=()=>{const hid=$$('.pc.hid',g);hid.forEach(p=>p.classList.remove('hid'));g.style.minHeight='';const h=g.offsetHeight;hid.forEach(p=>p.classList.add('hid'));g.style.minHeight=h+'px'};
 lock();addEventListener('load',lock);let lt;addEventListener('resize',()=>{clearTimeout(lt);lt=setTimeout(lock,200)})}

/* ===== /v3 ===== */
/* ===== scroll animations ===== */
if(!G||!ST||RM){return}
/* reveal-анимации: после проигрыша убираем инлайн-стили, чтобы блоки не «застревали» со смещением */
{const _f=G.from.bind(G);G.from=(t,v)=>{if(v&&!(v.scrollTrigger&&v.scrollTrigger.scrub)&&!v.clearProps)v.clearProps='transform,opacity,translate,rotate,scale';return _f(t,v)}}
// heading line reveals
$$('.h2').forEach(h=>G.from($$('.ln>span',h),{yPercent:108,duration:1.2,ease:'expo.out',stagger:.09,scrollTrigger:{trigger:h,start:'top 88%'}}));
G.from('.top',{yPercent:-100,duration:1,ease:'expo.out',delay:.3,clearProps:'transform'});
if(isHome){
// hero intro
G.from('.hero__t .ln>span',{yPercent:110,duration:1.4,ease:'expo.out',stagger:.12,delay:.2});
G.from('.hero__g>*',{y:30,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,delay:.6});
G.to('.hero__s',{yPercent:18,scale:1.05,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
G.to('.hero__c',{yPercent:-12,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'center top',end:'bottom top',scrub:true}});
// statement word scrub
if($('#stT')){const el=$('#stT');const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w))f.appendChild(document.createTextNode(w));else{const s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s)}});c.replaceWith(f)}else if(c.nodeType===1&&!c.classList.contains('pic'))walk(c)})};walk(el);
 const ws=$$('.w,.pic',el);G.set($$('.w',el),{opacity:.14});G.set($$('.pic',el),{opacity:.14,scale:.6});
 G.to(ws,{opacity:1,scale:1,stagger:.08,ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'bottom 45%',scrub:true}})}
// facts counters
$$('[data-c]').forEach(b=>{const n=+b.dataset.c;const o={v:0};b.textContent='0';ST.create({trigger:b,start:'top 92%',once:true,onEnter:()=>G.to(o,{v:n,duration:1.8,ease:'power3.out',onUpdate:()=>b.textContent=Math.round(o.v)})})});
// program cards: rise with mask
G.from('#pgr .pc',{y:80,opacity:0,duration:1.1,ease:'expo.out',stagger:{each:.08,grid:'auto',from:'start'},scrollTrigger:{trigger:'#pgr',start:'top 85%'}});

G.fromTo('.pc__bg',{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:'.pc--cta',start:'top bottom',end:'bottom top',scrub:true}});
$$('.pc__court rect,.pc__court line').forEach(l=>{const len=l.getTotalLength?l.getTotalLength():600;G.fromTo(l,{strokeDasharray:len,strokeDashoffset:len},{strokeDashoffset:0,duration:1.8,ease:'power2.inOut',scrollTrigger:{trigger:'.pc--cta',start:'top 80%'},onComplete:()=>{if(l.classList.contains('nt'))l.style.strokeDasharray='3 4'}})});
// court plan draw on enter
ST.create({trigger:'#plan',start:'top 75%',once:true,onEnter:()=>window.__drawPlan()});
G.from('#spec>div',{x:60,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'#spec',start:'top 85%'}});
// accordion rows
G.from('#acc .acc__i',{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'#acc',start:'top 85%'}});
G.from('.nums>div',{y:50,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.nums',start:'top 90%'}});
// gallery rail drift-in
G.from('#rail figure',{x:200,opacity:0,duration:1.4,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'#rail',start:'top 85%'}});
// coaches: curtain reveal on photo
$$('.cr__m').forEach((m,k)=>G.fromTo(m,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.3,ease:'expo.inOut',delay:(k%3)*.1,scrollTrigger:{trigger:m,start:'top 90%'}}));
// prices rows slide from left with line draw
G.from('.rw',{x:-60,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.rows',start:'top 85%'}});
G.from('.fv',{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.fv',start:'top 90%'}});
// camps parallax + tickets
G.from('.tk',{x:120,rotate:4,opacity:0,duration:1.3,ease:'expo.out',stagger:.15,scrollTrigger:{trigger:'.tix',start:'top 85%'}});
// kitchen
G.fromTo('.kt__img',{clipPath:'inset(12% 12% 12% 12%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:'.kt__img',start:'top 90%',end:'top 35%',scrub:true}});
G.fromTo('.kt__img img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.kt__img',start:'top bottom',end:'bottom top',scrub:true}});
G.from('.menu li',{x:40,opacity:0,duration:.8,ease:'expo.out',stagger:.05,scrollTrigger:{trigger:'.menu',start:'top 88%'}});
// news
G.from('.nc',{y:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.nw__g',start:'top 85%'}});
// contacts
G.from('.dl>div',{y:24,opacity:0,duration:.9,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:'.dl',start:'top 88%'}});
G.from('.map',{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:'.map',start:'top 85%'}});
}
G.from('.fx__h .ln>span',{yPercent:108,duration:1.3,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.fx__h',start:'top 90%'}});
G.from('.fx__cell',{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.fx__grid',start:'top 92%'}});
if(isHome&&$('.co__ld')){G.from('.co__ld .ldc',{y:70,opacity:0,duration:1.2,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.co__ld',start:'top 85%'}});$$('.co__ld .ldc__m').forEach((m,k)=>G.fromTo(m,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.3,ease:'expo.inOut',delay:k*.1,scrollTrigger:{trigger:m,start:'top 90%'}}))}
// inner pages
if(!isHome){
 G.from('.h1 .ln>span',{yPercent:110,duration:1.4,ease:'expo.out',stagger:.1,delay:.2});
 G.from('.ph .bc,.ph .kicker,.ph .lead,.ph__ctas',{y:26,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,delay:.5});
 G.fromTo('.ph__img',{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.5,ease:'expo.inOut',delay:.3});
 G.from('.ph__badge',{scale:.6,rotate:-8,opacity:0,duration:1,ease:'back.out(2)',delay:1.2});
 G.from('.ph__f>div',{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.ph__f',start:'top 95%'}});
 G.from('.ldc',{y:70,opacity:0,duration:1.2,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.ld__g',start:'top 85%'}});
 window.__ccT=[];$$('.ldc__m,.cc .cr__m').forEach((m,k)=>window.__ccT.push(G.fromTo(m,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.3,ease:'expo.inOut',delay:(k%3)*.1,scrollTrigger:{trigger:m,start:'top 90%'}})));
 G.from('.tq__a>*',{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:'.tq__g',start:'top 85%'}});
 G.fromTo('.tq__c',{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:'.tq__g',start:'top 80%'}});
 G.fromTo('.tq__bg',{yPercent:-6,scale:1.1},{yPercent:6,scale:1.1,ease:'none',scrollTrigger:{trigger:'.tq__c',start:'top bottom',end:'bottom top',scrub:true}});
 G.from('.pi__b>*',{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'.pi__g',start:'top 80%'}});
 $$('.pi__m,.pd__im').forEach(m=>G.fromTo(m,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:m,start:'top 85%'}}));
 $$('.pd').forEach(p=>{G.from($$('.pd__b>*',p),{y:40,opacity:0,duration:1,ease:'expo.out',stagger:.05,scrollTrigger:{trigger:p,start:'top 75%'}})});
 G.from('.fvv__g>div',{y:50,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.fvv__g',start:'top 85%'}});
 G.from('.pk__f',{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.pk__g',start:'top 80%'}});
 if($('.phx')){G.fromTo('.phx__bg img',{scale:1.12},{scale:1,duration:2.2,ease:'expo.out'});G.to('.phx__bg img',{yPercent:10,ease:'none',scrollTrigger:{trigger:'.phx',start:'top top',end:'bottom top',scrub:true}});G.from('.phx__tag',{y:-30,rotate:-6,opacity:0,duration:1.1,ease:'back.out(2)',delay:1});G.from('.phx .kicker,.phx .lead,.phx .ph__ctas',{y:26,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,delay:.5})}
 if($('.pix__t'))G.from('.pix__t',{y:60,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.pix',start:'top 80%'}});
 $$('.pv').forEach(v=>{const im=$('.pv__bg img',v);if(innerWidth>1000)G.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:v,start:'top bottom',end:'bottom top',scrub:true}});
   G.from($('.pv__n',v),{yPercent:30,opacity:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:v,start:'top 70%'}});
   G.from($$('.pv__h>*:not(.pv__n)',v),{y:30,opacity:0,duration:1,ease:'expo.out',stagger:.07,delay:.15,scrollTrigger:{trigger:v,start:'top 70%'}});
   G.from($('.pv__c',v),{y:80,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:v,start:'top 65%'}})});
 G.from('.gs__s li',{x:50,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.gs__s',start:'top 85%'}});
}

// camps pages
if(PAGE==='corporate'||PAGE==='birthdays'){G.from('.fmt__t button',{x:-40,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.fmt__g',start:'top 80%'}});G.from('.fmt__p',{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.fmt__g',start:'top 80%'}});G.from('.prc__v',{yPercent:40,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.prc',start:'top 75%'}});G.from('.prc__c li',{scale:.7,opacity:0,duration:.6,ease:'back.out(2)',stagger:.04,scrollTrigger:{trigger:'.prc__g',start:'top 85%'}});G.from('.arc__stamp',{scale:2.2,rotate:-20,opacity:0,duration:.8,ease:'back.out(1.6)',scrollTrigger:{trigger:'.arc__e',start:'top 80%'}})}
if(PAGE.startsWith('camp')){
 G.from('.gl__l li',{y:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.09,scrollTrigger:{trigger:'.gl__l',start:'top 85%'}});
 if($('.brd__b')){const CH='АБВГДЕЖЗИКЛМНОПРСТУФХЦЭЮЯ0123456789';$$('[data-flap]').forEach((b,k)=>{const w=b.textContent.trim();b.setAttribute('aria-label',w);b.innerHTML=[...w].map(c=>'<i aria-hidden="true">'+c+'</i>').join('');
   const cs=$$('i',b);ST.create({trigger:b,start:'top 92%',once:true,onEnter:()=>{cs.forEach((c,j)=>{let n=0;const max=6+j*2+k;const t=setInterval(()=>{if(++n>=max){c.textContent=w[j];clearInterval(t)}else c.textContent=CH[Math.random()*CH.length|0]},45)})}})});
  G.from('.brd__r',{x:-30,opacity:0,duration:.9,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'.brd__b',start:'top 85%'}})}
 $$('.bp').forEach(p=>{G.from(p,{y:80,rotate:1.5,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 88%'}});G.from($('.bp__s b',p),{yPercent:60,opacity:0,duration:1.2,ease:'expo.out',delay:.3,scrollTrigger:{trigger:p,start:'top 80%'}})});
 G.from('.inc__g li',{y:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.inc__g',start:'top 88%'}});
 if($('.arc__stamp'))G.from('.arc__stamp',{scale:2.2,rotate:-20,opacity:0,duration:.8,ease:'back.out(1.6)',scrollTrigger:{trigger:'.arc__e',start:'top 80%'}});
 if($('.pass'))G.from('.pass div',{y:30,opacity:0,duration:1,ease:'expo.out',stagger:.06,delay:.9});
 if($('.day')){const d=$('.day');G.fromTo(d,{'--p':0},{'--p':1,ease:'none',scrollTrigger:{trigger:d,start:'top 70%',end:'bottom 60%',scrub:true}});G.from('.day li',{x:40,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:d,start:'top 80%'}});G.from('.xtr li',{y:50,rotate:3,opacity:0,duration:1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.xtr',start:'top 88%'}})}
 if($('.sty')){G.fromTo('.sty__bg img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.sty',start:'top bottom',end:'bottom top',scrub:true}});G.from('.sty__c',{y:70,opacity:0,duration:1.2,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.sty__g',start:'top 85%'}})}
 if($('.prn')){G.from('.prn__t',{yPercent:30,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.prn',start:'top 75%'}});G.from('.prn__l li',{x:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.prn',start:'top 75%'}})}
 if($('.prc')){G.from('.prc__v',{yPercent:40,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.prc',start:'top 75%'}});G.from('.prc__c li',{scale:.7,opacity:0,duration:.6,ease:'back.out(2)',stagger:.04,scrollTrigger:{trigger:'.prc__g',start:'top 85%'}});G.from('.pay__b div,.cnc__s',{scaleX:0,duration:1,ease:'expo.inOut',stagger:.12,scrollTrigger:{trigger:'.prc__r',start:'top 88%'}})}
}
[['.stp__l li','.stp__l'],['.pgc__c','.pgc'],['.who__d div','.who__d'],['.chk li','.chk'],['.cq__r>*','.cq__g']].forEach(([a,t])=>{if($(t))G.from(a,{y:50,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:t,start:'top 85%'}})});
if($('.cch'))G.fromTo('.cch__m',{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:'.cch',start:'top 80%'}});
if($('.cpr__c'))G.from('.cpr__c',{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.cpr__c',start:'top 88%'}});
if($('.sc'))G.from('.sc',{y:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.sty2__g',start:'top 85%'}});
if($('.tl'))G.from('.tl__s',{y:40,opacity:0,duration:.9,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'.tl',start:'top 90%'}});
if($('.pr2__card'))G.from('.pr2__card,.pl',{y:50,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.pr2__g',start:'top 85%'}});
// kicker dots pop
$$('.kicker i').forEach(i=>G.from(i,{scale:0,duration:.8,ease:'back.out(3)',scrollTrigger:{trigger:i,start:'top 92%'}}));
addEventListener('load',()=>ST.refresh());
})();
