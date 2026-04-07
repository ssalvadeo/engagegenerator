/**
 * LEADGENERATOR — ULTRA-MOTION SYSTEM
 * Vanilla JS logic for:
 *  1. Intersection Observer for Reveal Animations
 *  2. Sequential Animation for "How It Works"
 *  3. Magnetic Button Experience
 */

/* ============================================================
   1. REVEAL ANIMATIONS (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealOnScroll.observe(el));
})();

/* ============================================================
   2. HOW IT WORKS — Step Sequential Activation
   ============================================================ */
(function initProcessSteps() {
  const steps = document.querySelectorAll('.process__step');
  
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // En lugar de activar solo uno, podemos hacer que se iluminen secuencialmente
        // pero para este diseño ultra-motion, que se activen cuando entren al view
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
})();

/* ============================================================
   3. MAGNETIC BUTTON EXPERIENCE
   ============================================================ */
(function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
})();

/* ============================================================
   4. LOGO ROTATION (Extra refinement)
   ============================================================ */
// Handled via CSS but we could add mouse tracking to the logo icon here.
const logo = document.querySelector('.logo-icon');
if (logo) {
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        logo.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    });
}
