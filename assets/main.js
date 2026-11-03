const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const nav = $("header.nav");
const toTop = $(".to-top");

const onScroll = () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle("scrolled", y > 10);
  if (toTop) toTop.classList.toggle("show", y > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const toggle = $(".menu-toggle");
if (toggle) toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
$$("nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

const slides = $$(".slide");
const dots = $$(".dots button");
let current = 0;
let timer;

const show = (i) => {
  slides[current].classList.remove("on");
  dots[current].classList.remove("on");
  current = (i + slides.length) % slides.length;
  slides[current].classList.add("on");
  void dots[current].offsetWidth;
  dots[current].classList.add("on");
};

const play = () => {
  clearInterval(timer);
  timer = setInterval(() => show(current + 1), 6000);
};

if (slides.length > 1) {
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      show(i);
      play();
    })
  );
  play();
}

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    }),
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => io.observe(el));

const form = $(".contact-form");
if (form) {
  const status = $(".form-status", form);
  const button = $("button[type=submit]", form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending...";
    try {
      const res = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || `Server responded with status ${res.status}`);
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you! Your enquiry has been sent. We'll get back to you soon.";
    } catch (err) {
      status.classList.add("err");
      status.textContent = `Sorry, the enquiry could not be sent (${err.message}). Please email info@flextechautomation.org or call +91-7840829782.`;
    } finally {
      button.disabled = false;
    }
  });
}

$$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
