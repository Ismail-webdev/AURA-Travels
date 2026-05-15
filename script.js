(() => {
  // === Year ===
  document.getElementById('year').textContent = new Date().getFullYear();

  // === Nav scroll state ===
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
    // Active link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    document.querySelectorAll('.nav__link').forEach(l => {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === Mobile nav ===
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    navLinks.classList.remove('is-open');
  }));

  // === Theme toggle ===
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('aura-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aura-theme', next);
  });

  // === Reveal on scroll ===
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // === Destination filters ===
  const filters = document.getElementById('filters');
  const cards = document.querySelectorAll('#destinationGrid .dest');
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    filters.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !match);
    });
  });

  // === Testimonial slider ===
  const track = document.getElementById('sliderTrack');
  const slides = track.children;
  const dotsWrap = document.getElementById('sliderDots');
  let idx = 0;
  for (let i = 0; i < slides.length; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' is-active' : '');
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  }
  const dots = dotsWrap.children;
  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    Array.from(dots).forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }
  document.getElementById('prevSlide').onclick = () => go(idx - 1);
  document.getElementById('nextSlide').onclick = () => go(idx + 1);
  let auto = setInterval(() => go(idx + 1), 6000);
  document.getElementById('slider').addEventListener('mouseenter', () => clearInterval(auto));
  document.getElementById('slider').addEventListener('mouseleave', () => auto = setInterval(() => go(idx + 1), 6000));

  // === FAQ — accordion (one open at a time) ===
  const faqItems = document.querySelectorAll('#faq-list .faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach(i => { if (i !== item) i.open = false; });
    });
  });

  // === Form validation ===
  const form = document.getElementById('bookForm');
  const success = document.getElementById('formSuccess');
  const setErr = (field, msg) => {
    const wrap = field.closest('.field');
    wrap.classList.toggle('is-invalid', !!msg);
    wrap.querySelector('.err').textContent = msg || '';
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const fd = new FormData(form);
    const name = fd.get('name').trim();
    const email = fd.get('email').trim();
    const dest = fd.get('destination');
    const date = fd.get('date');
    const trav = parseInt(fd.get('travelers'), 10);

    if (name.length < 2) { setErr(form.name, 'Please enter your name'); ok = false; } else setErr(form.name, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr(form.email, 'Enter a valid email'); ok = false; } else setErr(form.email, '');
    if (!dest) { setErr(form.destination, 'Pick a destination'); ok = false; } else setErr(form.destination, '');
    if (!date) { setErr(form.date, 'Choose a date'); ok = false; }
    else if (new Date(date) < new Date(new Date().toDateString())) { setErr(form.date, 'Date must be in the future'); ok = false; }
    else setErr(form.date, '');
    if (!trav || trav < 1) { setErr(form.travelers, 'At least 1 traveler'); ok = false; } else setErr(form.travelers, '');

    if (ok) {
      success.classList.add('is-visible');
      form.reset();
      setTimeout(() => success.classList.remove('is-visible'), 6000);
    }
  });

  // === Subtle parallax on hero ===
  const heroBg = document.querySelector('.hero__bg');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) heroBg.style.transform = `scale(1.1) translateY(${y * 0.25}px)`;
  }, { passive: true });
})();
