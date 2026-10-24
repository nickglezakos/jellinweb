/**
 * Marketing demo request — Formspree only.
 * Does NOT create Jellin accounts. Account CTAs live in index.html → app/.
 */
(function () {
  const openBtn = document.getElementById('contact-open-btn');
  const modal = document.getElementById('contact-modal');
  const form = document.getElementById('contact-form');
  const thanks = document.getElementById('contact-thanks');
  const submitBtn = document.getElementById('contact-submit');
  if (!modal || !form) return;

  function show() {
    modal.hidden = false;
    const email = document.getElementById('contact-email');
    if (email) email.focus();
  }

  function hide() {
    modal.hidden = true;
    if (thanks) thanks.hidden = true;
    form.hidden = false;
    form.reset();
    if (submitBtn) submitBtn.disabled = false;
  }

  openBtn && openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    show();
  });

  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', hide);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    const email = document.getElementById('contact-email').value;
    const metadata = {
      url: window.location.href,
      ua: navigator.userAgent,
      ts: new Date().toISOString(),
    };
    const endpoint = form.dataset.endpoint;

    try {
      if (endpoint) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('message', 'Requesting prelaunch demo');
        formData.append('metadata', JSON.stringify(metadata));
        if (form.dataset.cc) formData.append('cc', form.dataset.cc);

        const resp = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });
        if (!resp.ok) throw new Error('Submission failed');
      }
      form.hidden = true;
      if (thanks) thanks.hidden = false;
    } catch {
      alert('Failed to send. Please try again or email nick.glezakos@gmail.com directly.');
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
