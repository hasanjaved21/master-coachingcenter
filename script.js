/**
 * Master Coaching Center - Main JavaScript
 * Handles: scroll animations, counter animation, header scroll, mobile menu
 */

(function() {
  'use strict';

  // ----- Header scroll effect -----
  var header = document.getElementById('header');
  if (header) {
    function updateHeader() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ----- Hero background parallax motion on scroll -----
  var heroBg = document.getElementById('heroBg');
  if (heroBg) {
    function heroParallax() {
      var scrollY = window.scrollY;
      var rate = 0.25;
      var y = scrollY * rate;
      heroBg.style.transform = 'translate3d(0, ' + (y * 0.5) + 'px, 0)';
    }
    window.addEventListener('scroll', heroParallax, { passive: true });
    heroParallax();
  }

  // ----- Mobile menu toggle -----
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- Scroll reveal (sections / cards) -----
  var revealEls = document.querySelectorAll('.reveal');
  var revealOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  function revealOnScroll() {
    revealEls.forEach(function(el) {
      if (el.classList.contains('revealed')) return;
      var rect = el.getBoundingClientRect();
      var inView = rect.top < window.innerHeight - 60;
      if (inView) {
        el.classList.add('revealed');
      }
    });
  }

  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, revealOptions);
      revealEls.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      window.addEventListener('scroll', revealOnScroll, { passive: true });
      revealOnScroll();
    }
  }

  // ----- Counter animation -----
  var counterEls = document.querySelectorAll('.stat-number[data-counter]');
  var counterAnimated = {};

  function animateCounter(el) {
    var id = el.getAttribute('data-counter');
    if (counterAnimated[id]) return;
    counterAnimated[id] = true;

    var target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: easeOutQuart
      var ease = 1 - Math.pow(1 - progress, 4);
      var current = Math.round(start + (target - start) * ease);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if (counterEls.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    var href = anchor.getAttribute('href');
    if (href === '#') return;
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
