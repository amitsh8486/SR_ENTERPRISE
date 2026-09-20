// ==========================================
// S R ENTERPRISE - COMPANY INFORMATION
// Update company details here
// ==========================================
const COMPANY = {
  name: 'S R Enterprise',
  phone: '+91 9876543212',
  whatsapp: '+91 9876543212',
  email: 'srenterprise170701@gmail.com',
  address: 'Jorabagan, Howrah, Kolkata',
  hours: '9:00 AM - 9:00 PM',
  // Default message used by every general WhatsApp button
  whatsappMessage: 'Hello S R Enterprise, I would like to enquire about your timber and timber products. Please share more details.'
};
// ==========================================
// END OF COMPANY INFORMATION
// ==========================================

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const digitsOnly = (value) => value.replace(/\D/g, '');
  const telNumber = (value) => value.replace(/[^\d+]/g, '');

  function whatsappUrl(message) {
    return 'https://wa.me/' + digitsOnly(COMPANY.whatsapp) + '?text=' + encodeURIComponent(message);
  }

  /* ---------- Company info & links ---------- */
  function applyCompanyInfo() {
    const values = {
      name: COMPANY.name,
      nameUpper: COMPANY.name.toUpperCase(),
      phone: COMPANY.phone,
      whatsapp: COMPANY.whatsapp,
      email: COMPANY.email,
      address: COMPANY.address,
      hours: COMPANY.hours
    };
    $$('[data-company]').forEach((el) => {
      const value = values[el.dataset.company];
      if (value) el.textContent = value;
    });

    const links = {
      tel: 'tel:' + telNumber(COMPANY.phone),
      mailto: 'mailto:' + COMPANY.email,
      whatsapp: whatsappUrl(COMPANY.whatsappMessage),
      maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(COMPANY.address)
    };
    $$('[data-link]').forEach((el) => {
      const href = links[el.dataset.link];
      if (href) el.setAttribute('href', href);
    });

    // Product "Enquire Now" buttons open WhatsApp with the product name
    $$('[data-product]').forEach((el) => {
      const message = 'Hello ' + COMPANY.name + ', I am interested in ' + el.dataset.product + '. Please share the details.';
      el.setAttribute('href', whatsappUrl(message));
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNavigation() {
    const header = $('.site-header');
    const toggle = $('.nav-toggle');
    const nav = $('#site-nav');

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    $$('a', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('is-open') && !header.contains(event.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });

    // Solid header on scroll
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Active navigation link ---------- */
  function initActiveLink() {
    const links = $$('.nav__link');
    const sections = links
      .map((link) => $(link.getAttribute('href')))
      .filter(Boolean);
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = $$('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Enquiry form -> WhatsApp ---------- */
  function initEnquiryForm() {
    const form = $('#enquiry-form');
    const status = $('#form-status');
    const fields = {
      name: $('#f-name'),
      phone: $('#f-phone'),
      email: $('#f-email'),
      product: $('#f-product'),
      species: $('#f-species'),
      message: $('#f-message')
    };

    function setError(field, text) {
      $('#' + field.id + '-err').textContent = text;
      field.setAttribute('aria-invalid', text ? 'true' : 'false');
    }

    function validate() {
      const name = fields.name.value.trim();
      const phone = fields.phone.value.trim();
      const email = fields.email.value.trim();
      const errors = [];

      setError(fields.name, name ? '' : 'Please enter your name.');
      if (!name) errors.push(fields.name);

      const phoneOk = /^[0-9]{10}$/.test(phone);
      setError(fields.phone, phoneOk ? '' : 'Please enter a 10-digit mobile number (without +91).');
      if (!phoneOk) errors.push(fields.phone);

      const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError(fields.email, emailOk ? '' : 'Please enter a valid email address.');
      if (!emailOk) errors.push(fields.email);

      setError(fields.product, fields.product.value ? '' : 'Please select a product or requirement.');
      if (!fields.product.value) errors.push(fields.product);

      return errors;
    }

    // Phone accepts digits only (the +91 prefix is added automatically)
    fields.phone.addEventListener('input', () => {
      let digits = digitsOnly(fields.phone.value);
      if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2); // pasted/autofilled +91 number
      fields.phone.value = digits.slice(0, 10);
    });

    Object.values(fields).forEach((field) => {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validate();
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      const errors = validate();
      if (errors.length) {
        errors[0].focus();
        status.classList.add('is-error');
        status.textContent = 'Please correct the highlighted fields and try again.';
        return;
      }

      const message = [
        'Hello ' + COMPANY.name + ',',
        '',
        'I would like to request a quote for timber.',
        '',
        'Name: ' + fields.name.value.trim(),
        'Phone: +91 ' + fields.phone.value.trim(),
        'Email: ' + (fields.email.value.trim() || 'Not provided'),
        'Requirement: ' + fields.product.value,
        'Wood species: ' + (fields.species.value || 'Not specified'),
        'Message: ' + (fields.message.value.trim() || 'Not provided')
      ].join('\n');
      const url = whatsappUrl(message);

      window.open(url, '_blank', 'noopener');

      status.classList.add('is-success');
      status.textContent = 'WhatsApp has been opened with your enquiry. Please press Send in WhatsApp to deliver it to ' + COMPANY.name + '. ';
      const retry = document.createElement('a');
      retry.href = url;
      retry.target = '_blank';
      retry.rel = 'noopener noreferrer';
      retry.textContent = 'WhatsApp did not open? Click here.';
      status.appendChild(retry);
      form.reset();
    });
  }

  /* ---------- Init ---------- */
  applyCompanyInfo();
  initNavigation();
  initActiveLink();
  initReveal();
  initEnquiryForm();
})();




