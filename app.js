
/* BOOKING HOURS VALIDATION - GAZZAR Dental Clinic */
(function(){
  const form = document.getElementById('modalBookingForm');
  if (!form) return;

  const dateInput = form.querySelector('input[name="date"]');
  const timeInput = form.querySelector('input[name="time"]');

  // Time picker is left unrestricted to avoid native iPhone validation popups.
  // Actual working-hours validation happens only on form submit.

  function isFriday(dateValue) {
    if (!dateValue) return false;
    const d = new Date(dateValue + 'T12:00:00');
    return d.getDay() === 5;
  }

  function validTime(v){
    return v >= '15:00' && v <= '22:00';
  }

  // UX note: do not alert while the patient is scrolling the mobile time picker.
  // Time is validated only when submitting the booking form.

  dateInput?.addEventListener('change', function(){
    if (isFriday(this.value)) {
      alert('الجمعة إجازة. اختر يومًا من السبت إلى الخميس.');
      this.value = '';
    }
  });

  form.addEventListener('submit', function(e){
    if (isFriday(dateInput?.value || '')) {
      e.preventDefault();
      alert('الجمعة إجازة. اختر يومًا من السبت إلى الخميس.');
      return false;
    }

    if (!validTime(timeInput?.value || '')) {
      e.preventDefault();
      alert('المواعيد المتاحة من 3:00 مساءً إلى 10:00 مساءً فقط.');
      return false;
    }
  }, true);
})();


const menu=document.querySelector('[data-menu]');
document.querySelectorAll('[data-menu-toggle]').forEach(b=>b.addEventListener('click',()=>menu.classList.toggle('open')));
document.querySelectorAll('[data-menu] a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const modal=document.getElementById('bookingModal');
const modalForm=document.getElementById('modalBookingForm');
function openBooking(service=''){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');if(service){const s=modal.querySelector('select[name="service"]');if(s)s.value=service}setTimeout(()=>modal.querySelector('input[name="name"]')?.focus(),120)}
function closeBooking(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.querySelectorAll('[data-open-booking]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openBooking()}));
document.querySelectorAll('[data-close-booking]').forEach(b=>b.addEventListener('click',closeBooking));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBooking()});
document.querySelectorAll('.book-service').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openBooking(b.dataset.service||'')}));
modalForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(modalForm);const msg=`مرحبًا، أريد تأكيد حجز موعد في GAZZAR Dental Clinic%0A%0A`+`الاسم: ${encodeURIComponent(d.get('name')||'')}%0A`+`رقم الموبايل: ${encodeURIComponent(d.get('phone')||'')}%0A`+`الخدمة المطلوبة: ${encodeURIComponent(d.get('service')||'')}%0A`+`التاريخ: ${encodeURIComponent(d.get('date')||'')}%0A`+`الساعة: ${encodeURIComponent(d.get('time')||'')}%0A`+`أفضل وقت للتواصل: ${encodeURIComponent(d.get('preferred')||'')}%0A`+`ملاحظات: ${encodeURIComponent(d.get('notes')||'لا يوجد')}`;document.dispatchEvent(new CustomEvent('bookingConfirmed',{detail:{date:d.get('date'),time:d.get('time'),service:d.get('service'),name:d.get('name')}}));window.open(`https://wa.me/201221753277?text=${msg}`,'_blank')});
function setupCarousel(name){const track=document.querySelector(`[data-carousel="${name}"]`);if(!track)return;const prev=document.querySelector(`[data-carousel-prev="${name}"]`),next=document.querySelector(`[data-carousel-next="${name}"]`),dotsWrap=document.querySelector(`[data-carousel-dots="${name}"]`),items=[...track.children];let dots=[];if(dotsWrap){dotsWrap.innerHTML='';items.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`اذهب إلى العنصر ${i+1}`);dotsWrap.appendChild(b);dots.push(b);b.addEventListener('click',()=>items[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}))})}const step=()=>Math.max(track.clientWidth*.82,280);prev?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));next?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));function update(){const iw=items[0]?.offsetWidth||1;const gap=18;const idx=Math.round(Math.abs(track.scrollLeft)/(iw+gap));dots.forEach((d,i)=>d.classList.toggle('active',i===Math.min(idx,dots.length-1)))}track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});update()}
['services','cases','reviews','gallery'].forEach(setupCarousel);
const sticky=document.querySelector('[data-sticky-convert]');function toggleSticky(){if(!sticky)return;sticky.classList.toggle('show',window.scrollY>620)}window.addEventListener('scroll',toggleSticky,{passive:true});toggleSticky();


/* GAZZAR Smile Pass - Google Sheet CSV integration
   Replace the value below with your published Google Sheet CSV link.
   Required columns: name, phone, points, benefit, followup, last_service
*/
(function(){
  const form = document.querySelector('[data-smile-pass-form]');
  if(!form) return;

  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1-A6ZpHhvPQuvYm98fMhR_EmcJG-NBbh6xP4ISOA4goE/gviz/tq?tqx=out:csv&gid=0'; // Google Sheet CSV link
  const WHATSAPP_NUMBER = '201221753277';
  const lang = document.documentElement.lang || 'ar';
  const isAr = lang.startsWith('ar');
  const isTr = lang.startsWith('tr');

  const t = {
    ar:{
      phoneLabel:'رقم الموبايل', points:'النقاط', hello:'أهلاً', notFound:'لم نجد حساب بهذا الرقم. تواصل معنا عبر واتساب لمراجعة بياناتك.', loading:'جاري البحث...', setup:'لم يتم ربط Google Sheet بعد. بعد إضافة الرابط سيعمل البحث مباشرة.', benefit:'الميزة المتاحة', followup:'المتابعة القادمة', last:'آخر خدمة', use:'استخدم الميزة', book:'احجز متابعة', refer:'رشح صديق', msg:'مرحبًا، أريد استخدام ميزة Smile Pass الخاصة بي.', bookMsg:'مرحبًا، أريد حجز متابعة من حساب Smile Pass.', refMsg:'مرحبًا، أريد ترشيح صديق من خلال Smile Pass.'
    },
    en:{
      phoneLabel:'Phone number', points:'Points', hello:'Hello', notFound:'No account was found for this number. Please contact us on WhatsApp to check your details.', loading:'Searching...', setup:'Google Sheet is not connected yet. Add the CSV link and the search will work automatically.', benefit:'Available benefit', followup:'Next follow-up', last:'Last service', use:'Use benefit', book:'Book follow-up', refer:'Refer a friend', msg:'Hello, I would like to use my Smile Pass benefit.', bookMsg:'Hello, I would like to book a follow-up from my Smile Pass account.', refMsg:'Hello, I would like to refer a friend through Smile Pass.'
    },
    tr:{
      phoneLabel:'Telefon numarası', points:'Puan', hello:'Merhaba', notFound:'Bu numara için hesap bulunamadı. Bilgilerinizi kontrol etmek için WhatsApp üzerinden bize ulaşın.', loading:'Aranıyor...', setup:'Google Sheet henüz bağlanmadı. CSV linkini ekledikten sonra arama otomatik çalışır.', benefit:'Mevcut avantaj', followup:'Sonraki takip', last:'Son hizmet', use:'Avantajı kullan', book:'Takip randevusu al', refer:'Arkadaş öner', msg:'Merhaba, Smile Pass avantajımı kullanmak istiyorum.', bookMsg:'Merhaba, Smile Pass hesabımdan takip randevusu almak istiyorum.', refMsg:'Merhaba, Smile Pass üzerinden arkadaşımı önermek istiyorum.'
    }
  }[isTr?'tr':(isAr?'ar':'en')];

  const result = document.querySelector('[data-smile-result]');
  const input = form.querySelector('[data-smile-phone]');

  function normalizePhone(v){return String(v||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g,'').replace(/^20(?=1)/,'0');}
  function parseCSV(text){
    const rows=[]; let row=[], cur='', q=false;
    for(let i=0;i<text.length;i++){
      const c=text[i], n=text[i+1];
      if(c==='"' && q && n==='"'){cur+='"'; i++; continue;}
      if(c==='"'){q=!q; continue;}
      if(c===',' && !q){row.push(cur.trim()); cur=''; continue;}
      if((c==='\n'||c==='\r') && !q){ if(cur || row.length){row.push(cur.trim()); rows.push(row); row=[]; cur='';} continue;}
      cur+=c;
    }
    if(cur || row.length){row.push(cur.trim()); rows.push(row);}
    if(rows.length<2) return [];
    const headers=rows[0].map(h=>h.toLowerCase().trim());
    return rows.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]||''])));
  }
  function pick(row, keys){ for(const k of keys){ if(row[k]!==undefined && row[k]!==null && row[k] !== '') return row[k]; } return ''; }
  function wa(text){ return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`; }
  function renderCard(row){
    const name=pick(row,['name','الاسم','isim','ad']) || input.value;
    const points=pick(row,['points','النقاط','puan','puanlar']) || '0';
    const benefit=pick(row,['benefit','الميزة','الميزة المتاحة','avantaj']) || '—';
    const followup=pick(row,['followup','المتابعة','المتابعة القادمة','takip']) || '—';
    const last=pick(row,['last_service','last service','آخر خدمة','son hizmet']) || '—';
    result.innerHTML = `
      <div class="smile-patient-card">
        <div class="smile-patient-top">
          <div><h2>${t.hello} ${name}</h2><p>GAZZAR Smile Pass</p></div>
          <div class="smile-score"><span>${t.points}</span><strong>${points}</strong></div>
        </div>
        <div class="smile-info-grid">
          <div class="smile-info-box"><span>${t.benefit}</span><strong>${benefit}</strong></div>
          <div class="smile-info-box"><span>${t.followup}</span><strong>${followup}</strong></div>
          <div class="smile-info-box"><span>${t.last}</span><strong>${last}</strong></div>
          <div class="smile-info-box"><span>Smile Pass</span><strong>${normalizePhone(input.value)}</strong></div>
        </div>
        <div class="smile-actions">
          <a class="btn btn-dark" target="_blank" rel="noopener" href="${wa(t.msg)}">${t.use}</a>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${wa(t.bookMsg)}">${t.book}</a>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${wa(t.refMsg)}">${t.refer}</a>
        </div>
      </div>`;
  }
  function message(text, error=false){ result.innerHTML = `<div class="smile-message${error?' error':''}">${text}</div>`; }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const phone=normalizePhone(input.value);
    if(!GOOGLE_SHEET_CSV_URL){ message(t.setup); return; }
    message(t.loading);
    try{
      const res=await fetch(GOOGLE_SHEET_CSV_URL,{cache:'no-store'});
      const data=parseCSV(await res.text());
      const found=data.find(row=>normalizePhone(pick(row,['phone','رقم الموبايل','mobile','telefon']))===phone);
      if(found) renderCard(found); else message(t.notFound,true);
    }catch(err){ message(t.notFound,true); }
  });
})();
