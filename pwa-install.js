(function () {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream;
  let deferredPrompt = null;
  let installBtn = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch(function () {});
    });
  }

  if (!isMobile || isStandalone) return;

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-menu-btn{width:calc(100% - 32px);margin:18px 16px 8px;border:1px solid rgba(197,163,102,.45);border-radius:999px;background:#111;color:#fff;padding:13px 16px;font:800 14px/1.2 Manrope,'IBM Plex Sans Arabic',Arial,sans-serif;box-shadow:0 12px 28px rgba(0,0,0,.14);display:none;align-items:center;justify-content:center;gap:8px;cursor:pointer;direction:rtl}
      .pwa-install-menu-btn.show{display:flex}
      .pwa-install-menu-btn::before{content:'↧';font-size:16px;line-height:1;color:#d3b56d}
      .pwa-ios-tip{position:fixed;inset:auto 12px 86px 12px;z-index:9999;background:#fff;color:#111;border:1px solid rgba(0,0,0,.12);border-radius:18px;padding:16px;box-shadow:0 18px 48px rgba(0,0,0,.22);font-family:Manrope,'IBM Plex Sans Arabic',Arial,sans-serif;display:none;direction:rtl;text-align:right}
      .pwa-ios-tip.show{display:block}
      .pwa-ios-tip strong{display:block;margin-bottom:6px;font-size:15px}.pwa-ios-tip p{margin:0 0 12px;font-size:14px;line-height:1.7}.pwa-ios-tip button{border:0;border-radius:999px;background:#000;color:#fff;padding:10px 14px;font-weight:700;cursor:pointer}
      @media (min-width: 769px){.pwa-install-menu-btn,.pwa-ios-tip{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureButton() {
    if (installBtn) return installBtn;
    const menu = document.querySelector('[data-menu]');
    installBtn = document.createElement('button');
    installBtn.type = 'button';
    installBtn.className = 'pwa-install-menu-btn';
    installBtn.setAttribute('aria-label', 'تثبيت تطبيق GAZZAR Dental Clinic');
    installBtn.textContent = 'ثبّت التطبيق على الموبايل';

    if (menu) menu.appendChild(installBtn);
    else document.body.appendChild(installBtn);

    return installBtn;
  }

  function createTip() {
    const tip = document.createElement('div');
    tip.className = 'pwa-ios-tip';
    tip.setAttribute('role', 'dialog');
    tip.setAttribute('aria-live', 'polite');
    tip.innerHTML = '<strong>تثبيت التطبيق على iPhone</strong><p>افتح الموقع من Safari، اضغط زر المشاركة Share، ثم اختر Add to Home Screen.</p><button type="button">تمام</button>';
    document.body.appendChild(tip);
    tip.querySelector('button').addEventListener('click', function () {
      tip.classList.remove('show');
      sessionStorage.setItem('gazzarPwaIosTipClosed', '1');
    });
    return tip;
  }

  function setupInstallUI() {
    addStyles();
    const btn = ensureButton();
    const tip = createTip();

    if (isIOS) {
      btn.classList.add('show');
      btn.addEventListener('click', function () {
        if (sessionStorage.getItem('gazzarPwaIosTipClosed') !== '1') tip.classList.add('show');
        else tip.classList.toggle('show');
      });
      return;
    }

    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredPrompt = event;
      btn.classList.add('show');
    });

    btn.addEventListener('click', async function () {
      if (!deferredPrompt) return;
      btn.classList.remove('show');
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(function () {});
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      btn.classList.remove('show');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupInstallUI, { once: true });
  } else {
    setupInstallUI();
  }
})();
