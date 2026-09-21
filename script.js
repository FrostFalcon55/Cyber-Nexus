/* ============================================================
   CYBER NEXUS '26 — script.js
   Vanilla JS: Matrix Rain · Countdown · Scroll Reveal ·
   Active Nav · Hamburger · Event Modal
   ============================================================ */

'use strict';

/* ============================================================
   1. MATRIX RAIN CANVAS
   ============================================================ */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}();';
  const FONT_SIZE = 14;
  let columns, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);
    drops   = Array.from({ length: columns }, () => Math.random() * -100);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5, 10, 19, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Alternate between cyan and green tones
      const isGreen = i % 3 === 0;
      ctx.fillStyle = isGreen ? '#00ff88' : '#00f5ff';

      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  // Run at ~30 fps to keep CPU usage low
  let last = 0;
  function loop(ts) {
    if (ts - last > 33) { draw(); last = ts; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();


/* ============================================================
   2. COUNTDOWN TIMER — 30 Sept 2026, 08:30 AM
   ============================================================ */
(function initCountdown() {
  const TARGET = new Date('2026-09-30T08:30:00').getTime();

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      // Replace wrapper text with "Event is LIVE!"
      const wrapper = elDays.closest('.countdown-wrapper');
      if (wrapper) {
        wrapper.innerHTML =
          '<p style="font-family:var(--font-orbit);font-size:1.5rem;color:var(--green);' +
          'text-shadow:var(--glow-green);letter-spacing:0.12em;">🚀 EVENT IS LIVE!</p>';
      }
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600)  / 60);
    const s = totalSecs % 60;

    elDays.textContent    = pad(d);
    elHours.textContent   = pad(h);
    elMinutes.textContent = pad(m);
    elSeconds.textContent = pad(s);

    setTimeout(tick, 1000);
  }

  tick();
})();


/* ============================================================
   3. STICKY NAVBAR — scroll shadow
   ============================================================ */
(function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when a nav link is clicked
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) close();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();


/* ============================================================
   5. ACTIVE NAV LINK ON SCROLL (IntersectionObserver)
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const NAV_H = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64',
    10
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector(
            `.nav-link[data-section="${entry.target.id}"]`
          );
          if (active) active.classList.add('active');
        }
      });
    },
    {
      rootMargin: `-${NAV_H}px 0px -55% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* ============================================================
   6. SCROLL REVEAL ANIMATION
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Stagger children within the same parent slightly
  els.forEach((el, i) => {
    if (!el.style.transitionDelay) {
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.transitionDelay = `${idx * 0.08}s`;
      }
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
})();


/* ============================================================
   7. EVENT MODAL — data & open/close logic
   ============================================================ */
const EVENT_DATA = {
  'pixel-forge': {
    icon: '🎨',
    name: 'Pixel Forge',
    tag:  'Design & Creative',
    content: `
      <h3>About the Event</h3>
      <ul>
        <li>A creative design challenge where participants showcase their artistic and digital design skills.</li>
        <li>Theme and specific brief will be announced on the day of the event.</li>
        <li>Use your imagination, precision, and creativity to produce standout digital artwork or designs.</li>
      </ul>
      <h3>General Rules</h3>
      <ul>
        <li>All entries must be original and created during the event.</li>
        <li>No plagiarism or use of pre-made templates.</li>
        <li>Judges' decision on creativity, execution, and theme adherence is final.</li>
        <li>Participants must follow all general event instructions.</li>
      </ul>
      <p class="modal-note">Bring your own design tools/accessories as required. Follow the general dress code.</p>
    `,
  },

  'debug-dash': {
    icon: '🐛',
    name: 'Debug Dash',
    tag:  'Debugging in C++',
    content: `
      <h3>Round 1 — Preliminaries</h3>
      <ul>
        <li><strong>Format:</strong> Multiple Choice Questions (MCQ) on any programming language.</li>
        <li>Complete within the given time limit.</li>
        <li>Top performers from Round 1 qualify for Round 2.</li>
      </ul>
      <h3>Round 2 — Debugging</h3>
      <ul>
        <li><strong>Language:</strong> C++</li>
        <li>Participants receive C++ programs containing errors.</li>
        <li>Identify and correct all errors within the given time.</li>
        <li>Winners are judged on <strong>accuracy</strong> and <strong>time taken</strong>.</li>
      </ul>
      <h3>General Rules</h3>
      <ul>
        <li>No internet access or mobile phones during the event.</li>
        <li>No external help of any kind is permitted.</li>
        <li>Follow all instructions given by the event coordinators.</li>
        <li>Judges' decision is final and binding.</li>
      </ul>
      <p class="modal-note">Participants should be well-versed in C++ syntax, logic, and common debugging techniques.</p>
    `,
  },

  'gaming-knight': {
    icon: '♞',
    name: 'Gaming Knight',
    tag:  'Free Fire — Clash Squad',
    content: `
      <h3>Game Details</h3>
      <ul>
        <li><strong>Game:</strong> Free Fire</li>
        <li><strong>Mode:</strong> Clash Squad – Knockout</li>
        <li><strong>Team Size:</strong> 4 participants per team</li>
      </ul>
      <h3>Restrictions</h3>
      <ul>
        <li>No emotes allowed during gameplay.</li>
        <li>No gun skins permitted.</li>
        <li>No character skills to be used.</li>
        <li>No panels allowed.</li>
        <li>No roof access during gameplay.</li>
        <li>Gloo walls <strong>cannot</strong> be broken.</li>
      </ul>
      <h3>Conduct & Rules</h3>
      <ul>
        <li>Any misbehaviour by a team member will result in the <strong>entire team's disqualification</strong>.</li>
        <li>Judges' decision is final.</li>
      </ul>
      <span class="special-badge">🏆 Special Prize: ₹2,000 — First Prize</span>
    `,
  },

  'your-stage': {
    icon: '🎭',
    name: 'Your Stage, Your Rules',
    tag:  'As You Like It — Shakespeare',
    content: `
      <h3>Event Format</h3>
      <ul>
        <li><strong>Team Size:</strong> 6 participants per team</li>
        <li>Performance based on Shakespeare's <strong>"As You Like It"</strong></li>
        <li>Performance duration: <strong>5–10 minutes</strong></li>
        <li>Props and costumes are allowed and encouraged.</li>
      </ul>
      <h3>Judging Criteria</h3>
      <ul>
        <li>Acting ability and stage presence</li>
        <li>Dialogue delivery and expression</li>
        <li>Creativity and interpretation</li>
        <li>Overall presentation and coordination</li>
      </ul>
      <h3>Rules</h3>
      <ul>
        <li>No vulgar or inappropriate content is permitted.</li>
        <li>Maintain discipline and decorum at all times.</li>
        <li>Participants must bring their own costumes and props.</li>
        <li>Judges' decision is final.</li>
      </ul>
      <p class="modal-note">Teams are encouraged to adapt the Shakespeare text creatively while staying true to the spirit of the work.</p>
    `,
  },

  'papershere': {
    icon: '📄',
    name: 'Papershere',
    tag:  'Techtalk — Paper Presentation',
    content: `
      <h3>Participation</h3>
      <ul>
        <li><strong>Team Size:</strong> 1–2 participants per team</li>
        <li><strong>Limit:</strong> 1 team per college / per department</li>
      </ul>
      <h3>Presentation Format</h3>
      <ul>
        <li>Submit an <strong>original paper</strong> related to the given topic.</li>
        <li>Presentation time: <strong>10 minutes</strong></li>
        <li>Q&A session: <strong>2–5 minutes</strong></li>
        <li>PPT or PDF presentation is <strong>mandatory</strong>.</li>
      </ul>
      <h3>Eligible Topics</h3>
      <ul>
        <li>Cloud Security</li>
        <li>AI in Cloud Computing</li>
        <li>Cloud Privacy</li>
        <li>Ethical Hacking</li>
        <li>Network Security</li>
        <li>AI in Cyber Security</li>
        <li>Data Privacy</li>
        <li>Cyber Attacks &amp; Defense</li>
      </ul>
      <h3>Rules</h3>
      <ul>
        <li>Paper must be original; plagiarism will lead to disqualification.</li>
        <li>Judges will evaluate content, clarity, depth, and Q&A responses.</li>
        <li>Judges' decision is final.</li>
      </ul>
      <p class="modal-note">Bring your presentation file on a USB drive as backup. Report to the event venue 15 minutes before your slot.</p>
    `,
  },

  'brainwave': {
    icon: '🧠',
    name: 'Brainwave Quiz',
    tag:  'Brain Blast — Technical Quiz',
    content: `
      <h3>Round 1 — Preliminaries</h3>
      <ul>
        <li><strong>Format:</strong> MCQ on technical subjects</li>
        <li>Top scoring participants qualify for Round 2.</li>
      </ul>
      <h3>Round 2 — Quiz Finals</h3>
      <ul>
        <li>Mixed format: MCQs, Rapid-Fire, and advanced Technical Questions</li>
        <li>Scored on both <strong>correctness</strong> and <strong>time taken</strong></li>
        <li>Rapid-fire rounds test speed and depth of knowledge</li>
      </ul>
      <h3>Rules</h3>
      <ul>
        <li>No mobile phones or electronic devices during the quiz.</li>
        <li>No external help of any kind.</li>
        <li>Judges' decision is final and binding.</li>
      </ul>
      <p class="modal-note">Topics may span Computer Science, Cloud Computing, Networking, Cyber Security, and General Technology.</p>
    `,
  },

  'web-wizard': {
    icon: '🧙',
    name: 'Web Wizard',
    tag:  'Web Designing — Individual',
    content: `
      <h3>Event Format</h3>
      <ul>
        <li><strong>Individual event</strong> — 1 participant only</li>
        <li>Theme-based website creation during the event</li>
        <li>Theme will be announced at the start of the event</li>
      </ul>
      <h3>Technical Requirements</h3>
      <ul>
        <li>Allowed technologies: <strong>HTML, CSS, JavaScript</strong> and other permitted tools</li>
        <li>Website must be <strong>responsive</strong> and <strong>user-friendly</strong></li>
        <li>Must be creative and visually appealing</li>
      </ul>
      <h3>Judging Criteria</h3>
      <ul>
        <li>Design aesthetics and visual appeal</li>
        <li>Creativity and originality</li>
        <li>Functionality and interactivity</li>
        <li>Overall presentation</li>
      </ul>
      <h3>Rules</h3>
      <ul>
        <li>All work must be done during the event — no pre-built templates.</li>
        <li>Bring your own laptop with required tools installed.</li>
        <li>Judges' decision is final.</li>
      </ul>
      <p class="modal-note">Participants are advised to practice responsive web design techniques and CSS animations beforehand.</p>
    `,
  },

  'ad-mad': {
    icon: '📢',
    name: 'AD MAD',
    tag:  'Digital Marketing',
    content: `
      <h3>Event Format</h3>
      <ul>
        <li><strong>Team Size:</strong> 4 participants per team</li>
        <li>Create an <strong>original digital advertisement</strong> for a given product or topic</li>
        <li>Product / topic will be announced at the start of the event</li>
      </ul>
      <h3>Judging Criteria</h3>
      <ul>
        <li>Creativity and innovation</li>
        <li>Marketing strategy and messaging</li>
        <li>Quality of presentation</li>
        <li>Audience impact and recall value</li>
      </ul>
      <h3>Rules</h3>
      <ul>
        <li>All content must be <strong>appropriate and professional</strong>.</li>
        <li>Internet access and digital tools are allowed as permitted by coordinators.</li>
        <li>No offensive, vulgar, or inappropriate material.</li>
        <li>Judges' decision is final.</li>
      </ul>
      <p class="modal-note">Teams should bring creative assets, brand ideas, and any digital tools they plan to use.</p>
    `,
  },
};

(function initModal() {
  const overlay    = document.getElementById('event-modal');
  const closeBtn   = document.getElementById('modal-close');
  const modalIcon  = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalTag   = document.getElementById('modal-tag');
  const modalBody  = document.getElementById('modal-body');

  if (!overlay) return;

  let lastFocused = null;

  function openModal(eventKey) {
    const data = EVENT_DATA[eventKey];
    if (!data) return;

    lastFocused = document.activeElement;

    modalIcon.textContent  = data.icon;
    modalTitle.textContent = data.name;
    modalTag.textContent   = data.tag;
    modalBody.innerHTML    = data.content;

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the close button for keyboard users
    requestAnimationFrame(() => closeBtn.focus());
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  }

  // Open on card click / Enter / Space
  document.querySelectorAll('.event-card[data-event]').forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.event));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.event);
      }
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Click outside modal box
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });

  // Trap focus inside modal
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();


/* ============================================================
   8. SMOOTH SCROLL POLYFILL (for older Safari / WebView)
      Handles anchor links not covered by CSS scroll-behavior
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      // Let CSS scroll-behavior handle it; only intervene if unsupported
      if (!('scrollBehavior' in document.documentElement.style)) {
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64',
          10
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ============================================================
   9. REGISTER LINK — easy swap helper
      Change the href below (or in index.html) to the real
      Google Form URL when ready.
   ============================================================ */
(function patchRegisterLink() {
  const FORM_URL = 'https://forms.gle/77mwaNCsiNNCKCFNA'; // ← swap this
  const link = document.getElementById('register-form-link');
  if (link && link.getAttribute('href') === '#register-link') {
    link.setAttribute('href', FORM_URL);
  }
})();


/* ============================================================
   10. GLITCH TITLE — periodic extra burst on hover
   ============================================================ */
(function initGlitchHover() {
  const title = document.querySelector('.glitch-title');
  if (!title) return;

  title.addEventListener('mouseenter', () => {
    title.style.animationDuration = '0.5s';
  });
  title.addEventListener('mouseleave', () => {
    title.style.animationDuration = '4s';
  });
})();
