const header = document.querySelector('[data-header]');
const modal = document.querySelector('[data-modal]');
const form = document.querySelector('[data-contact-form]');
const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
  try {
    const endpoint = 'https://script.google.com/macros/s/AKfycbwVqv-mM40H0m8HV_hKYQUcmhuf7x7E6Iin2nwSGc0e9ljiTUJxH4whhYz2Ej4Vz3Vj/exec';
    const formData = new FormData(form);
    const response = await fetch(endpoint, { method: 'POST', body: formData });
    const result = await response.json();
    if (result.success === true) {
      form.reset(); modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    } else {
      status.textContent = result.message || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    status.textContent = 'Something went wrong. Please email hello@borbon.cc instead.';
  } finally { button.disabled = false; button.innerHTML = 'Send message <span>→</span>'; }
});
document.querySelector('[data-year]').textContent = new Date().getFullYear();