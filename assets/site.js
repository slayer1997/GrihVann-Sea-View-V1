/* site.js — shared inner-page behaviour for sea-views.com
   1) nav solidifies on scroll  2) reveal-on-scroll for [data-reveal] */
(function () {var gclid=new URLSearchParams(location.search).get("gclid");if(gclid)sessionStorage.setItem("gclid",gclid);
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* burger menu (mobile drawer) */
    var burger = nav.querySelector(".nav-burger");
    if (burger) {
      var setMenu = function (open) {
        nav.classList.toggle("menu-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        document.body.style.overflow = open ? "hidden" : "";
      };
      burger.addEventListener("click", function () {
        setMenu(!nav.classList.contains("menu-open"));
      });
      nav.querySelectorAll("#nav-links a").forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
      });
    }
  }
  var els = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
