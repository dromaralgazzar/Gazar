const menu=document.querySelector('[data-menu]');
document.querySelectorAll('[data-menu-toggle]').forEach(b=>b.addEventListener('click',()=>{ if(menu) menu.classList.toggle('open') }));
document.querySelectorAll('[data-menu] a').forEach(a=>a.addEventListener('click',()=>menu?.classList.remove('open')));

const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modal=document.getElementById('bookingModal');
const modalForm=document.getElementById('modalBookingForm');

function openBooking(service=''){
  if(!modal){
    const text = service ? `مرحبًا، أريد حجز موعد في GAZZAR Dental Clinic بخصوص ${service}` : 'مرحبًا، أريد حجز موعد في GAZZAR Dental Clinic';
    window.open(`https://wa.me/201221753277?text=${encodeURIComponent(text)}`,'_blank');
    return;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(service){
    const s=modal.querySelector('select[name="service"]');
    if(s)s.value=service
  }
  setTimeout(()=>modal.querySelector('input[name="name"]')?.focus(),120)
}
function closeBooking(){
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open')
}

document.querySelectorAll('[data-open-booking]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openBooking()}));
document.querySelectorAll('[data-close-booking]').forEach(b=>b.addEventListener('click',closeBooking));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBooking()});

document.querySelectorAll('.book-service').forEach(b=>b.addEventListener('click',e=>{
  if(b.tagName === 'A' && b.getAttribute('href') && !b.dataset.service) return;
  e.preventDefault();
  openBooking(b.dataset.service||'')
}));

modalForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(modalForm);
  const msg=`مرحبًا، أريد تأكيد حجز موعد في GAZZAR Dental Clinic%0A%0A`+
  `الاسم: ${encodeURIComponent(d.get('name')||'')}%0A`+
  `رقم الموبايل: ${encodeURIComponent(d.get('phone')||'')}%0A`+
  `الخدمة المطلوبة: ${encodeURIComponent(d.get('service')||'')}%0A`+
  `التاريخ: ${encodeURIComponent(d.get('date')||'')}%0A`+
  `الساعة: ${encodeURIComponent(d.get('time')||'')}%0A`+
  `أفضل وقت للتواصل: ${encodeURIComponent(d.get('preferred')||'')}%0A`+
  `ملاحظات: ${encodeURIComponent(d.get('notes')||'لا يوجد')}`;
  window.open(`https://wa.me/201221753277?text=${msg}`,'_blank')
});

function setupCarousel(name){
  const track=document.querySelector(`[data-carousel="${name}"]`);
  if(!track)return;
  const prev=document.querySelector(`[data-carousel-prev="${name}"]`),next=document.querySelector(`[data-carousel-next="${name}"]`),dotsWrap=document.querySelector(`[data-carousel-dots="${name}"]`),items=[...track.children];
  let dots=[];
  if(dotsWrap){
    dotsWrap.innerHTML='';
    items.forEach((_,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label',`Go to item ${i+1}`);
      dotsWrap.appendChild(b);
      dots.push(b);
      b.addEventListener('click',()=>items[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}))
    })
  }
  const isRTL = document.documentElement.dir === 'rtl';
  const step=()=>Math.max(track.clientWidth*.82,280);
  prev?.addEventListener('click',()=>track.scrollBy({left:isRTL?step():-step(),behavior:'smooth'}));
  next?.addEventListener('click',()=>track.scrollBy({left:isRTL?-step():step(),behavior:'smooth'}));
  function update(){
    const iw=items[0]?.offsetWidth||1;
    const gap=18;
    const idx=Math.round(Math.abs(track.scrollLeft)/(iw+gap));
    dots.forEach((d,i)=>d.classList.toggle('active',i===Math.min(idx,dots.length-1)))
  }
  track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
  update()
}
['services','cases','reviews','gallery'].forEach(setupCarousel);

const sticky=document.querySelector('[data-sticky-convert]');
function toggleSticky(){if(!sticky)return;sticky.classList.toggle('show',window.scrollY>620)}
window.addEventListener('scroll',toggleSticky,{passive:true});
toggleSticky();
