(function(){
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (!isAndroid) return;

  function pad(n){return String(n).padStart(2,'0')}
  function toGCalDate(d){
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  }

  document.addEventListener('bookingConfirmed', function(e){
    const data = e.detail || {};
    if (!data.date || !data.time) return;

    const start = new Date(data.date + 'T' + data.time + ':00');
    if (isNaN(start.getTime())) return;

    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const service = data.service || 'Dental visit';

    setTimeout(function(){
      if (!window.confirm('هل تريد إضافة الموعد إلى Google Calendar؟')) return;

      const gcal = new URL('https://calendar.google.com/calendar/render');
      gcal.searchParams.set('action', 'TEMPLATE');
      gcal.searchParams.set('text', 'GAZZAR Dental Clinic Appointment');
      gcal.searchParams.set('details', 'Appointment request for ' + service + '. Please confirm with the clinic on WhatsApp.');
      gcal.searchParams.set('location', 'GAZZAR Dental Clinic, 723 Loran, Abu Qir Street, Alexandria');
      gcal.searchParams.set('dates', toGCalDate(start) + '/' + toGCalDate(end));

      window.open(gcal.toString(), '_blank', 'noopener');
    }, 700);
  });
})();
