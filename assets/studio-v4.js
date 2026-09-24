(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
  window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submit = form.querySelector('button');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = '';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      form.reset(); status.textContent = 'You’re on the list! Freddie will be in touch within one business day.'; status.focus();
    } catch {
      status.textContent = 'Your request couldn’t be sent. Please try again or email freddie@watmediallc.com.'; status.focus();
    } finally { submit.disabled = false; submit.innerHTML = 'Let’s make my free video <span aria-hidden="true">↗</span>'; }
  });
})();
