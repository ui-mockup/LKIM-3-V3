document.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('navToggle');
  var backdrop = document.getElementById('navBackdrop');

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('show');
    nav.querySelectorAll('li.open').forEach(function (li) { li.classList.remove('open'); });
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    backdrop.classList.toggle('show', isOpen);
  });

  backdrop.addEventListener('click', closeNav);

  // Mega menu: toggle on click for touch/mobile, ignore when clicking a real link target
  var topLevelLinks = nav.querySelectorAll(':scope > li > a');
  topLevelLinks.forEach(function (link) {
    var li = link.parentElement;
    var mega = li.querySelector('.mega');
    if (!mega) return;

    link.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 900px)').matches || matchMedia('(hover:none)').matches) {
        e.preventDefault();
        var wasOpen = li.classList.contains('open');
        nav.querySelectorAll('li.open').forEach(function (item) { item.classList.remove('open'); });
        if (!wasOpen) li.classList.add('open');
      }
    });
  });

  // close mobile nav when a real (non-dropdown) link is chosen
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!a.parentElement.querySelector('.mega') && window.matchMedia('(max-width: 900px)').matches) {
        closeNav();
      }
    });
  });

  // gallery filter tabs (visual only — highlights active tab)
  var tabs = document.querySelectorAll('.gallery-tabs button');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // agency logo carousel: prev/next buttons + seamless loop across the 3 repeated sets
  var agencyTrack = document.getElementById('agencyTrack');
  var agencyPrev = document.getElementById('agencyPrev');
  var agencyNext = document.getElementById('agencyNext');
  if (agencyTrack && agencyPrev && agencyNext) {
    var setWidth = agencyTrack.scrollWidth / 3;
    agencyTrack.scrollLeft = setWidth;

    agencyPrev.addEventListener('click', function () {
      agencyTrack.scrollBy({ left: -320, behavior: 'smooth' });
    });
    agencyNext.addEventListener('click', function () {
      agencyTrack.scrollBy({ left: 320, behavior: 'smooth' });
    });

    var loopTimer;
    agencyTrack.addEventListener('scroll', function () {
      clearTimeout(loopTimer);
      loopTimer = setTimeout(function () {
        if (agencyTrack.scrollLeft < setWidth * 0.15) {
          agencyTrack.scrollLeft += setWidth;
        } else if (agencyTrack.scrollLeft > setWidth * 1.85) {
          agencyTrack.scrollLeft -= setWidth;
        }
      }, 80);
    });
  }

  // ---------- Accessibility Tools ----------
  var a11yBtn = document.getElementById('a11yBtn');
  var a11yBackdrop = document.getElementById('a11yBackdrop');
  var a11yPanel = document.getElementById('a11yPanel');
  var a11yClose = document.getElementById('a11yClose');
  var root = document.documentElement;
  var a11yScaleWrap = document.getElementById('a11yScaleWrap');

  if (a11yBtn && a11yBackdrop && a11yPanel && a11yClose && a11yScaleWrap) {
    function openA11y() {
      a11yBackdrop.classList.add('open');
      a11yBtn.setAttribute('aria-expanded', 'true');
    }
    function closeA11y() {
      a11yBackdrop.classList.remove('open');
      a11yBtn.setAttribute('aria-expanded', 'false');
    }
    a11yBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      a11yBackdrop.classList.contains('open') ? closeA11y() : openA11y();
    });
    a11yClose.addEventListener('click', closeA11y);
    a11yBackdrop.addEventListener('click', function (e) {
      if (e.target === a11yBackdrop) closeA11y();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeA11y();
    });

    // toggle option cards (mutually exclusive within each visual pair)
    var toggleMap = {
      a11yInvert: 'a11y-invert',
      a11yMono: 'a11y-monochrome',
      a11yDark: 'a11y-dark-contrast',
      a11yLight: 'a11y-light-contrast',
      a11yLowSat: 'a11y-low-sat',
      a11yHighSat: 'a11y-high-sat',
      a11yLinks: 'a11y-highlight-links',
      a11yHeadings: 'a11y-highlight-headings',
      a11yReadMode: 'a11y-read-mode'
    };
    var exclusivePairs = [
      ['a11yInvert', 'a11yMono'],
      ['a11yDark', 'a11yLight'],
      ['a11yLowSat', 'a11yHighSat']
    ];
    function findPairPartner(id) {
      for (var i = 0; i < exclusivePairs.length; i++) {
        var pair = exclusivePairs[i];
        if (pair[0] === id) return pair[1];
        if (pair[1] === id) return pair[0];
      }
      return null;
    }
    Object.keys(toggleMap).forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOn = btn.classList.contains('on');
        var partnerId = findPairPartner(id);
        if (partnerId && !isOn) {
          var partnerBtn = document.getElementById(partnerId);
          partnerBtn.classList.remove('on');
          root.classList.remove(toggleMap[partnerId]);
        }
        btn.classList.toggle('on', !isOn);
        root.classList.toggle(toggleMap[id], !isOn);
      });
    });

    // screen reader: read aloud on click when enabled
    var srBtn = document.getElementById('a11yScreenReader');
    var srOn = false;
    function speak(text) {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.trim());
      window.speechSynthesis.speak(u);
    }
    srBtn.addEventListener('click', function () {
      srOn = !srOn;
      srBtn.classList.toggle('on', srOn);
      if (srOn) { speak('Mod pembaca skrin diaktifkan. Klik mana-mana teks untuk mendengarnya.'); }
      else { window.speechSynthesis && window.speechSynthesis.cancel(); }
    });
    document.addEventListener('click', function (e) {
      if (!srOn) return;
      if (a11yPanel.contains(e.target)) return;
      var el = e.target.closest('p, h1, h2, h3, h4, h5, a, button, li, span');
      if (el && el.innerText) speak(el.innerText);
    });

    // sliders: content scaling / font size / line height / letter spacing
    function wireSlider(inputId, valId, apply) {
      var input = document.getElementById(inputId);
      var val = document.getElementById(valId);
      function update() {
        val.textContent = input.value + '%';
        var pct = (input.value - input.min) / (input.max - input.min) * 100;
        input.style.background = 'linear-gradient(to right, var(--hero-orange) 0%, var(--hero-orange) ' + pct + '%, #d8d8d8 ' + pct + '%, #d8d8d8 100%)';
        apply(input.value);
      }
      input.addEventListener('input', update);
      update();
      return { input: input, update: update };
    }
    wireSlider('a11yScale', 'a11yScaleVal', function (v) {
      a11yScaleWrap.style.transformOrigin = 'top center';
      a11yScaleWrap.style.transform = v == 100 ? '' : 'scale(' + (v / 100) + ')';
    });
    wireSlider('a11yFont', 'a11yFontVal', function (v) {
      root.style.fontSize = v + '%';
    });
    wireSlider('a11yLine', 'a11yLineVal', function (v) {
      a11yScaleWrap.style.lineHeight = v == 100 ? '' : (v / 100 * 1.55);
      document.querySelectorAll('p, li').forEach(function (el) { el.style.lineHeight = v == 100 ? '' : (v / 100 * 1.6); });
    });
    wireSlider('a11ySpacing', 'a11ySpacingVal', function (v) {
      var extra = (v - 100) / 100 * 1.5;
      a11yScaleWrap.style.letterSpacing = v == 100 ? '' : extra + 'px';
    });

    document.querySelectorAll('.a11y-slider-steps button').forEach(function (stepBtn) {
      stepBtn.addEventListener('click', function () {
        var target = document.getElementById(stepBtn.dataset.target);
        var dir = parseInt(stepBtn.dataset.dir, 10);
        var step = parseInt(target.step, 10);
        var next = parseInt(target.value, 10) + (dir * step);
        next = Math.max(parseInt(target.min, 10), Math.min(parseInt(target.max, 10), next));
        target.value = next;
        target.dispatchEvent(new Event('input'));
      });
    });

    // reset (refresh icon)
    document.getElementById('a11yReset').addEventListener('click', function () {
      Object.keys(toggleMap).forEach(function (id) {
        document.getElementById(id).classList.remove('on');
        root.classList.remove(toggleMap[id]);
      });
      srOn = false;
      srBtn.classList.remove('on');
      window.speechSynthesis && window.speechSynthesis.cancel();
      [['a11yScale', 'a11yScaleVal'], ['a11yFont', 'a11yFontVal'], ['a11yLine', 'a11yLineVal'], ['a11ySpacing', 'a11ySpacingVal']]
        .forEach(function (pair) {
          document.getElementById(pair[0]).value = 100;
          document.getElementById(pair[0]).dispatchEvent(new Event('input'));
        });
      a11yScaleWrap.style.transform = '';
      a11yScaleWrap.style.letterSpacing = '';
      a11yScaleWrap.style.lineHeight = '';
      document.querySelectorAll('p, li').forEach(function (el) { el.style.lineHeight = ''; });
      root.style.fontSize = '';
    });
  }

  // ---------- Pengumuman (announcement) carousel ----------
  var announcements = [
    'TENDER BAGI KAJIAN KEMUNGKINAN PEMBANGUNAN PELABUHAN TUNA DI PULAU PINANG KE ARAH KETERJAMINAN MAKANAN DALAM NEGARA',
    'CADANGAN KAJIAN KEMUNGKINAN PEMBINAAN KOMPLEKS PERIKANAN LKIM DI HUTAN MELINTANG, PERAK',
    'SEBUT HARGA PEMANTAUAN HARGA IKAN LKIM PERINGKAT PASAR BORONG DAN RUNCIT',
    'JAWATAN KOSONG KONTRAK MyPERSONEL LKIM',
    'TAWARAN PENYEWAAN PROJEK AGROPELANCONGAN RUMAH RAKIT DAN EKOPELANCONGAN KUALA JARUM MAS, PERAK'
  ];
  var annSlide = document.getElementById('announceSlide');
  var annPrev = document.getElementById('annPrev');
  var annNext = document.getElementById('annNext');
  if (annSlide && annPrev && annNext) {
    var annIndex = 0;
    function showAnnouncement(i) {
      annSlide.style.animation = 'none';
      void annSlide.offsetWidth;
      annSlide.textContent = announcements[i];
      annSlide.style.animation = 'announceFade .6s ease';
    }
    var annTimer = setInterval(function () {
      annIndex = (annIndex + 1) % announcements.length;
      showAnnouncement(annIndex);
    }, 6000);
    function resetAnnTimer() {
      clearInterval(annTimer);
      annTimer = setInterval(function () {
        annIndex = (annIndex + 1) % announcements.length;
        showAnnouncement(annIndex);
      }, 6000);
    }
    annPrev.addEventListener('click', function () {
      annIndex = (annIndex - 1 + announcements.length) % announcements.length;
      showAnnouncement(annIndex);
      resetAnnTimer();
    });
    annNext.addEventListener('click', function () {
      annIndex = (annIndex + 1) % announcements.length;
      showAnnouncement(annIndex);
      resetAnnTimer();
    });
  }
});
