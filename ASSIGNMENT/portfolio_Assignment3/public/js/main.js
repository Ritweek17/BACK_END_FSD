// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Setup GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom integration of GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

document.addEventListener('DOMContentLoaded', () => {

  // Navbar Auto-hide & active state styling
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      mobileMenu.classList.remove('opacity-0', '-translate-y-5', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'translate-y-0');
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-3xl"></i>';
    } else {
      mobileMenu.classList.add('opacity-0', '-translate-y-5', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'translate-y-0');
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-3xl"></i>';
    }
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isMobileMenuOpen) toggleMobileMenu();
    });
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Styling based on scroll pos
    if (currentScrollY > 50) {
      navbar.classList.remove('py-6', 'bg-[#08121C]/30', 'shadow-none');
      navbar.classList.add('py-4', 'bg-[#08121C]/90', 'backdrop-blur-xl', 'shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
    } else {
      navbar.classList.add('py-6', 'bg-[#08121C]/30', 'shadow-none');
      navbar.classList.remove('py-4', 'bg-[#08121C]/90', 'backdrop-blur-xl', 'shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
    }

    // Auto-hide navigation
    if (!isMobileMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
      } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
      }
    }
    lastScrollY = currentScrollY;

    // Scroll Progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
  });

  // Reveal Navbar on hover near top
  window.addEventListener("mousemove", (event) => {
    if (event.clientY < 80) {
      navbar.style.transform = 'translateY(0)';
      navbar.style.opacity = '1';
    }
  });

  // Intersection Observer for Navbar Active State
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const underline = link.querySelector('span');
          if (link.getAttribute('data-section') === entry.target.id) {
            link.classList.add('text-orange-500');
            link.classList.remove('text-gray-400');
            if(underline) {
              if (link.classList.contains('mobile-nav-link')) {
                underline.classList.remove('hidden');
              } else {
                underline.classList.add('w-full', 'shadow-[0_0_8px_#f97316]');
                underline.classList.remove('w-0');
              }
            }
          } else {
            link.classList.remove('text-orange-500');
            link.classList.add('text-gray-400');
            if(underline) {
              if (link.classList.contains('mobile-nav-link')) {
                underline.classList.add('hidden');
              } else {
                underline.classList.remove('w-full', 'shadow-[0_0_8px_#f97316]');
                underline.classList.add('w-0');
              }
            }
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Mouse Glow
  const mouseGlow = document.getElementById('mouse-glow');
  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.display = 'block';
    // Use requestAnimationFrame for smoother mouse tracking
    requestAnimationFrame(() => {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
    });
  });

  // Smooth scroll for anchor links using Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target);
      }
    });
  });

  // GSAP Animations
  // Hero Entrance
  const tl = gsap.timeline();
  tl.to(".hero-text", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.2
  })
  .to(".hero-image", {
    x: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.6");

  // Avatar float effect
  gsap.to("#avatar-img", {
    y: -15,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.gsap-reveal');
  revealElements.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xl"></i><span>Sending...</span>';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        formMessage.classList.remove('hidden');
        if (response.ok) {
          formMessage.textContent = data.success || 'Message sent successfully!';
          formMessage.classList.add('text-green-500');
          formMessage.classList.remove('text-red-500');
          contactForm.reset();
        } else {
          formMessage.textContent = data.error || 'Failed to send message. Please try again.';
          formMessage.classList.add('text-red-500');
          formMessage.classList.remove('text-green-500');
        }
      } catch (err) {
        formMessage.classList.remove('hidden');
        formMessage.textContent = 'An error occurred. Please try again.';
        formMessage.classList.add('text-red-500');
        formMessage.classList.remove('text-green-500');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.classList.add('hidden');
        }, 5000);
      }
    });
  }
});
