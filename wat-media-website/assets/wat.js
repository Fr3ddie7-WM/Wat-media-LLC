/* ============================================================
   WAT MEDIA — shared behavior v2.0
   ============================================================ */
(function () {
  'use strict';

  /* ── Nav scroll state + progress bar ── */
  var nav = document.querySelector('.nav');
  var progress = document.querySelector('.scroll-progress');
  var mobileCta = document.querySelector('.mobile-cta');
  var hero = document.querySelector('[data-hero]');

  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (mobileCta) {
      var threshold = hero ? hero.offsetHeight * 0.6 : 500;
      var nearForm = false;
      var claim = document.getElementById('claim');
      if (claim) {
        var r = claim.getBoundingClientRect();
        nearForm = r.top < window.innerHeight && r.bottom > 0;
      }
      mobileCta.classList.toggle('show', y > threshold && !nearForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveals ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Counters — values are ALREADY in the HTML (SEO/no-JS safe).
        We only animate from 0 → value when scrolled into view. ── */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      var group = item.closest('[data-faq-group]');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = null;
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
      }
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Live timecode ── */
  var tcEls = document.querySelectorAll('[data-timecode]');
  if (tcEls.length) {
    var frames = 0;
    setInterval(function () {
      frames = (frames + 1) % (24 * 60 * 60 * 24);
      var f = frames % 24;
      var s = Math.floor(frames / 24) % 60;
      var m = Math.floor(frames / (24 * 60)) % 60;
      var h = Math.floor(frames / (24 * 60 * 60));
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var tc = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
      tcEls.forEach(function (el) { el.textContent = tc; });
    }, 1000 / 24);
  }

  /* ── Lead form (Formspree) ── */
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      fetch('https://formspree.io/f/mojzrzgn', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          var success = document.getElementById('form-success');
          if (success) success.style.display = 'block';
        } else {
          throw new Error('Form error');
        }
      }).catch(function () {
        btn.disabled = false;
        btn.innerHTML = original;
        var err = document.getElementById('form-error');
        if (err) err.style.display = 'block';
      });
    });
  }
})();
