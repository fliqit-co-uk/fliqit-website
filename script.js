const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const WAITLIST_URL = 'https://europe-west1-fliqit-f5a70.cloudfunctions.net/api/v1/waitlist';

const waitlist = document.querySelector('#waitlist-form');
const status = document.querySelector('#form-status');
waitlist?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const email = String(new FormData(form).get('email') || '').trim();
  if (!status) return;

  status.classList.remove('is-error', 'is-success');
  status.textContent = 'Joining the list…';
  if (button) button.disabled = true;

  try {
    const response = await fetch(WAITLIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || 'Could not join the waitlist. Please try again.');
    }

    status.classList.add('is-success');
    status.textContent = payload.data?.alreadyJoined
      ? `${email} is already on the list. We'll keep you posted.`
      : `Thanks — we'll keep ${email} in the loop.`;
    form.reset();
  } catch (err) {
    status.classList.add('is-error');
    status.textContent = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
  } finally {
    if (button) button.disabled = false;
  }
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent(`Website message from ${data.get('name')}`);
  const body = encodeURIComponent(`From: ${data.get('name')} (${data.get('contact-email')})\n\n${data.get('message')}`);
  window.location.href = `mailto:noreply@fliqit.co.uk?subject=${subject}&body=${body}`;
  form.reset();
});
