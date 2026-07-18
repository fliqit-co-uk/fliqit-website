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

document.querySelector('#year').textContent = new Date().getFullYear();

const waitlist = document.querySelector('#waitlist-form');
const status = document.querySelector('#form-status');
waitlist?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(waitlist).get('email');
  status.textContent = `Thanks — we'll keep ${email} in the loop.`;
  waitlist.reset();
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
