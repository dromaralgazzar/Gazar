(function(){
  function pad(n){return String(n).padStart(2,'0')}
  function toICSDate(d){return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z'}
  function safeText(v){return String(v||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
  function createICS(details){
    const title=safeText(details.title||'GAZZAR Dental Clinic Appointment');
    const desc=safeText(details.description||'Dental appointment at GAZZAR Dental Clinic');
    const loc=safeText(details.location||'GAZZAR Dental Clinic, 723 Loran, Abu Qir Street, Alexandria');
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GAZZAR Dental Clinic//PWA Booking//EN','BEGIN:VEVENT','UID:gazzar-'+Date.now()+'@gazzardentalclinic.com','DTSTAMP:'+toICSDate(new Date()),'SUMMARY:'+title,'DESCRIPTION:'+desc,'LOCATION:'+loc,'DTSTART:'+toICSDate(details.start),'DTEND:'+toICSDate(details.end),'END:VEVENT','END:VCALENDAR'].join('\r\n');
    return URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  }
  function addCalendar(details){
    const isIOS=/iPhone|iPad|iPod/i.test(navigator.userAgent);
    if(isIOS){
      const url=createICS(details);
      const a=document.createElement('a');
      a.href=url;a.download='gazzar-dental-appointment.ics';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(url)},5000);
      return;
    }
    const fmt=function(d){return toICSDate(d).replace(/Z$/,'Z')};
    const gcal=new URL('https://calendar.google.com/calendar/render');
    gcal.searchParams.set('action','TEMPLATE');
    gcal.searchParams.set('text',details.title);
    gcal.searchParams.set('details',details.description);
    gcal.searchParams.set('location',details.location);
    gcal.searchParams.set('dates',fmt(details.start)+'/'+fmt(details.end));
    window.open(gcal.toString(),'_blank','noopener');
  }
  document.addEventListener('bookingConfirmed',function(e){
    const data=e.detail||{};
    if(!data.date||!data.time)return;
    const start=new Date(data.date+'T'+data.time+':00');
    if(isNaN(start.getTime()))return;
    const end=new Date(start.getTime()+60*60*1000);
    const details={
      title:'GAZZAR Dental Clinic Appointment',
      description:'Appointment request for '+(data.service||'dental visit')+'. Please confirm with the clinic on WhatsApp.',
      location:'GAZZAR Dental Clinic, 723 Loran, Abu Qir Street, Alexandria',
      start:start,
      end:end
    };
    setTimeout(function(){
      if(window.confirm('تم تجهيز رسالة الحجز على واتساب. هل تريد إضافة الموعد إلى التقويم؟')) addCalendar(details);
    },700);
  });
})();
